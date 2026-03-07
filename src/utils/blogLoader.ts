import { BlogPost, BlogPostMetadata } from '../types/blog';
import { calculateReadingTime } from './markdown';

const postModules = import.meta.glob('../posts/**/*.md', { as: 'raw' });

// Vite processes these imports and returns hashed asset URLs at build time
const postImageModules = import.meta.glob(
  '../posts/**/*.{jpg,jpeg,png,gif,webp,svg,mp4,webm}',
  {
    eager: true,
    import: 'default',
  },
) as Record<string, string>;

/**
 * Rewrites relative media src attributes (src="./foo.jpg" or src="foo.jpg") in
 * markdown/HTML content to Vite-hashed absolute URLs, using the post's glob path
 * as the base directory (e.g. "../posts/2026-03-07-coding-agents/index.md").
 */
function resolvePostAssets(content: string, postGlobPath: string): string {
  const dir = postGlobPath.replace(/\/[^/]+$/, ''); // strip filename → "../posts/2026-03-07-coding-agents"
  return content.replace(
    /src="(\.\/)?([^/"#][^"]*?)"/g,
    (match, _dot, filename) => {
      const key = `${dir}/${filename}`;
      const resolved = postImageModules[key];
      return resolved ? `src="${resolved}"` : match;
    },
  );
}

export async function getAllPosts(): Promise<BlogPostMetadata[]> {
  const posts: BlogPostMetadata[] = [];
  
  for (const path in postModules) {
    const content = (await postModules[path]()) as string;
    const { metadata, content: markdownContent } = parseFrontmatter(content);
    // Extract slug from path (handles both relative and absolute paths)
    const pathParts = path.split('/');
    const filename = pathParts[pathParts.length - 1];
    let slug = filename.replace('.md', '');

    if (filename === 'index.md' && pathParts.length > 2) {
      slug = pathParts[pathParts.length - 2];
    }

    posts.push({
      slug,
      ...metadata,
      readingTime: calculateReadingTime(markdownContent),
    });
  }
  
  // Sort by date, newest first
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  // Find the post by matching the slug in the path
  for (const path in postModules) {
    const pathParts = path.split('/');
    const filename = pathParts[pathParts.length - 1];
    let pathSlug = filename.replace('.md', '');

    if (filename === 'index.md' && pathParts.length > 2) {
      pathSlug = pathParts[pathParts.length - 2];
    }

    if (pathSlug === slug) {
      const content = (await postModules[path]()) as string;
      const { metadata, content: markdownContent } = parseFrontmatter(content);
      const resolvedContent = resolvePostAssets(markdownContent, path);

      return {
        slug,
        ...metadata,
        content: resolvedContent,
        readingTime: calculateReadingTime(markdownContent),
      };
    }
  }
  
  return null;
}

export async function getAdjacentPosts(slug: string): Promise<{ previous: BlogPostMetadata | null; next: BlogPostMetadata | null }> {
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((post) => post.slug === slug);
  
  if (currentIndex === -1) {
    return { previous: null, next: null };
  }
  
  return {
    previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next: currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}

function parseFrontmatter(content: string): { metadata: Omit<BlogPostMetadata, 'slug' | 'readingTime'>; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid frontmatter format');
  }
  
  const frontmatter = match[1];
  const markdownContent = match[2];
  
  const metadata: any = {};
  const lines = frontmatter.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.slice(0, colonIndex).trim();
    let value = line.slice(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    // Handle arrays (tags)
    if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
      metadata[key] = value.slice(1, -1).split(',').map(t => t.trim().replace(/["']/g, ''));
    } else {
      metadata[key] = value;
    }
  }
  
  return { metadata, content: markdownContent };
}
