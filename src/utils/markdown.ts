import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import type { Root, Element } from 'hast';
import { remarkVideoEmbeds } from './remark-video-embeds';
import { remarkInteractiveGraphs } from './remark-interactive-graphs';
import {
  rehypeEnhanceCodeBlocks,
  rehypeRememberExplicitCodeLanguage,
} from './rehype-enhance-code-blocks';
import { TableOfContentsItem } from '../types/blog';

function rehypeExternalLinks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (node.tagName === 'a' && node.properties) {
        const href = String(node.properties.href ?? '');
        if (href.startsWith('http://') || href.startsWith('https://')) {
          node.properties.target = '_blank';
          node.properties.rel = 'noopener noreferrer';
        }
      }
    });
  };
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkVideoEmbeds)
    .use(remarkInteractiveGraphs)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['anchor-link'],
        ariaLabel: 'Anchor link',
      },
      content: {
        type: 'element',
        tagName: 'span',
        properties: { className: ['anchor-icon'] },
        children: [{ type: 'text', value: '#' }],
      },
    })
    .use(rehypeRememberExplicitCodeLanguage)
    .use(rehypeHighlight, {
      detect: true,
      ignoreMissing: true,
    })
    .use(rehypeEnhanceCodeBlocks)
    .use(rehypeKatex)
    .use(rehypeExternalLinks)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}

export function extractTableOfContents(html: string): TableOfContentsItem[] {
  if (typeof window === 'undefined') {
    // Server-side: use regex to extract headings
    const toc: TableOfContentsItem[] = [];
    const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
    let match;

    while ((match = headingRegex.exec(html)) !== null) {
      const level = parseInt(match[1]);
      const id = match[2];
      // Remove HTML tags and anchor links from text
      const text = match[3]
        .replace(/<a[^>]*>.*?<\/a>/gi, '')
        .replace(/<[^>]+>/g, '')
        .trim();
      
      if (id && text) {
        toc.push({ id, text, level });
      }
    }

    return toc;
  }

  // Client-side: use DOM parser
  const toc: TableOfContentsItem[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  headings.forEach((heading) => {
    const id = heading.id || heading.getAttribute('id');
    if (id) {
      const level = parseInt(heading.tagName.substring(1));
      // Remove anchor link icons from text
      const text = heading.textContent?.replace(/#/g, '').trim() || '';
      toc.push({
        id,
        text,
        level,
      });
    }
  });

  return toc;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
