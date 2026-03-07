export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  content: string;
  readingTime?: number;
  author?: string;
}

export interface BlogPostMetadata {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  readingTime?: number;
  author?: string;
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}
