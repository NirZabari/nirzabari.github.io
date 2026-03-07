import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { TableOfContents } from '../components/TableOfContents';
import { getPost, getAdjacentPosts } from '../utils/blogLoader';
import { markdownToHtml, extractTableOfContents } from '../utils/markdown';
import { BlogPost, BlogPostMetadata, TableOfContentsItem } from '../types/blog';
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  ArrowRight,
  User,
} from 'lucide-react';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css';

type PlotlyPayload = {
  data?: unknown[];
  layout?: Record<string, unknown>;
};

type PlotlyWindow = Window & {
  Plotly?: {
    newPlot: (
      element: HTMLElement,
      data: unknown[],
      layout: Record<string, unknown>,
      config: { responsive: boolean; displayModeBar: boolean },
    ) => void;
  };
};

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const articleContentRef = useRef<HTMLDivElement | null>(null);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [toc, setToc] = useState<TableOfContentsItem[]>([]);
  const [adjacentPosts, setAdjacentPosts] = useState<{
    previous: BlogPostMetadata | null;
    next: BlogPostMetadata | null;
  }>({ previous: null, next: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add light theme for syntax highlighting
    const style = document.createElement('style');
    style.textContent = `
      .prose pre.hljs {
        background: #f6f8fa !important;
        color: #24292e !important;
      }
      .dark .prose pre.hljs {
        background: #161b22 !important;
        color: #c9d1d9 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) {
        setError('Post not found');
        setLoading(false);
        return;
      }

      try {
        const [postData, adjacent] = await Promise.all([
          getPost(slug),
          getAdjacentPosts(slug),
        ]);

        if (!postData) {
          setError('Post not found');
          setLoading(false);
          return;
        }

        setPost(postData);
        setAdjacentPosts(adjacent);
        const html = await markdownToHtml(postData.content);
        setHtmlContent(html);

        // Extract TOC from HTML
        const tocItems = extractTableOfContents(html);
        setToc(tocItems);

        // Initialize interactive graphs after a short delay to ensure DOM is ready
        setTimeout(() => {
          initializeInteractiveGraphs();
        }, 100);
      } catch (err) {
        console.error('Error loading post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  useEffect(() => {
    const container = articleContentRef.current;
    if (!container) {
      return;
    }

    const resetTimers = new Map<HTMLButtonElement, number>();

    const updateCopyButton = (
      button: HTMLButtonElement,
      state: 'copied' | 'error',
    ) => {
      const existingTimer = resetTimers.get(button);
      if (existingTimer) {
        window.clearTimeout(existingTimer);
      }

      button.dataset.copyState = state;
      button.setAttribute(
        'aria-label',
        state === 'copied' ? 'Copied code' : 'Copy failed',
      );

      const resetTimer = window.setTimeout(() => {
        delete button.dataset.copyState;
        button.setAttribute('aria-label', 'Copy code to clipboard');
        resetTimers.delete(button);
      }, 1800);

      resetTimers.set(button, resetTimer);
    };

    const handleCopyClick = async (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const button = target.closest<HTMLButtonElement>(
        '[data-code-copy-button]',
      );
      if (!button || !container.contains(button)) {
        return;
      }

      const code = button
        .closest('.enhanced-code-block')
        ?.querySelector('pre code')?.textContent;

      if (!code) {
        updateCopyButton(button, 'error');
        return;
      }

      try {
        await navigator.clipboard.writeText(code);
        updateCopyButton(button, 'copied');
      } catch (error) {
        console.error('Failed to copy code block:', error);
        updateCopyButton(button, 'error');
      }
    };

    container.addEventListener('click', handleCopyClick);

    return () => {
      container.removeEventListener('click', handleCopyClick);
      resetTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [htmlContent]);

  useEffect(() => {
    const container = articleContentRef.current;
    if (!container || !htmlContent) {
      return;
    }

    let outerFrame = 0;
    let innerFrame = 0;

    const measureCodeBlocks = () => {
      const blocks = Array.from(
        container.querySelectorAll<HTMLElement>('.enhanced-code-block'),
      ).slice(0, 6);

      blocks.forEach((block) => {
        const gutter = block.querySelector<HTMLElement>('.code-line-numbers');
        const body = block.querySelector<HTMLElement>('.code-block-body');
        const pre = block.querySelector<HTMLElement>('pre');
        const code = block.querySelector<HTMLElement>('pre code');

        if (!gutter || !body || !pre || !code) {
          return;
        }

        block.classList.toggle(
          'code-block-has-horizontal-scroll',
          pre.scrollWidth > pre.clientWidth,
        );
      });
    };

    outerFrame = window.requestAnimationFrame(() => {
      innerFrame = window.requestAnimationFrame(measureCodeBlocks);
    });

    return () => {
      window.cancelAnimationFrame(outerFrame);
      window.cancelAnimationFrame(innerFrame);
    };
  }, [htmlContent]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const initializeInteractiveGraphs = () => {
    // Initialize Plotly graphs
    const plotlyWindow = window as PlotlyWindow;
    const plotlyGraphs = document.querySelectorAll(
      '.plotly-graph[data-plotly]',
    );
    plotlyGraphs.forEach((graph) => {
      const data = graph.getAttribute('data-plotly');
      if (data && !plotlyWindow.Plotly) {
        const script = document.createElement('script');
        script.src = 'https://cdn.plot.ly/plotly-2.27.0.min.js';
        script.onload = () => {
          try {
            const plotData = JSON.parse(
              data.replace(/&apos;/g, "'"),
            ) as PlotlyPayload;
            plotlyWindow.Plotly?.newPlot(
              graph as HTMLElement,
              plotData.data || [],
              plotData.layout || {},
              {
                responsive: true,
                displayModeBar: true,
              },
            );
          } catch (e) {
            console.error('Error rendering Plotly graph:', e);
          }
        };
        document.head.appendChild(script);
      } else if (data && plotlyWindow.Plotly) {
        try {
          const plotData = JSON.parse(
            data.replace(/&apos;/g, "'"),
          ) as PlotlyPayload;
          plotlyWindow.Plotly.newPlot(
            graph as HTMLElement,
            plotData.data || [],
            plotData.layout || {},
            {
              responsive: true,
              displayModeBar: true,
            },
          );
        } catch (e) {
          console.error('Error rendering Plotly graph:', e);
        }
      }
    });
  };

  if (loading) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-background-dark dark:to-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Loading post...
              </p>
            </div>
          </div>
        </main>
      </PageTransition>
    );
  }

  if (error || !post) {
    return (
      <PageTransition>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-background-dark dark:to-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-24">
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                {error || 'Post not found'}
              </p>
            </div>
          </div>
        </main>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-background-dark dark:to-background-dark">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-12 sm:gap-8 sm:items-start">
            {/* Main Content */}
            <article className="sm:col-span-8 rounded-[2rem] border border-gray-200/70 bg-white/90 p-6 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] backdrop-blur dark:border-gray-800 dark:bg-surface-dark/90 md:p-8 lg:p-10">
              <header className="mb-4 border-b border-gray-200/80 pb-4 dark:border-gray-800">
                <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-4xl lg:text-[2.85rem] lg:leading-[1.08]">
                  {post.title}
                </h1>
                {post.excerpt && (
                  <p className="max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
                    {post.excerpt}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
                  <div className="inline-flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.date)}</span>
                  </div>
                  {post.readingTime && (
                    <div className="inline-flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTime} min read</span>
                    </div>
                  )}
                  {post.author && (
                    <div className="inline-flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                  )}
                </div>
              </header>

              <div
                ref={articleContentRef}
                className="prose prose-lg dark:prose-invert max-w-none
                  prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:font-semibold prose-headings:tracking-tight prose-headings:mb-3
                  prose-p:my-3 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-8
                  prose-a:text-primary-700 dark:prose-a:text-primary-400 prose-a:underline prose-a:decoration-primary-300 prose-a:underline-offset-4
                  prose-strong:text-gray-900 dark:prose-strong:text-white
                  prose-code:text-primary-600 dark:prose-code:text-primary-400
                  prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
                  prose-pre:text-gray-900 dark:prose-pre:text-gray-100
                  prose-blockquote:border-primary-500
                  prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300
                  prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto prose-img:max-h-[600px] prose-img:object-contain
                  prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-7
                  prose-ol:my-3 prose-ol:pl-6 prose-ol:marker:font-semibold prose-ol:marker:text-primary-600
                  prose-ul:pl-6
                  [&>*:first-child]:mt-0
                  [&>h2:first-child]:border-t-0 [&>h2:first-child]:pt-0
                  [&_.katex]:text-gray-900 dark:[&_.katex]:text-white
                  [&_.katex-display]:my-8
                  [&_h2]:mt-10 [&_h2]:border-t [&_h2]:border-gray-200 [&_h2]:pt-5 dark:[&_h2]:border-gray-800
                  [&_h3]:mt-6 [&_h3]:mb-2
                  [&_ol]:space-y-1.5 [&_ul]:space-y-1.5
                  [&_ol>li>a]:break-all [&_ul>li>a]:break-all
                  [&_.anchor-link]:opacity-0 [&_h1:hover_.anchor-link]:opacity-100 [&_h2:hover_.anchor-link]:opacity-100 [&_h3:hover_.anchor-link]:opacity-100 [&_h4:hover_.anchor-link]:opacity-100 [&_h5:hover_.anchor-link]:opacity-100 [&_h6:hover_.anchor-link]:opacity-100
                  [&_.anchor-link]:transition-opacity [&_.anchor-link]:ml-2 [&_.anchor-link]:text-primary-500
                  [&_.hljs]:bg-gray-900 [&_.hljs]:text-gray-100"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />

              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Previous/Next Navigation */}
              {(adjacentPosts.previous || adjacentPosts.next) && (
                <nav className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between gap-4">
                  {adjacentPosts.previous ? (
                    <Link
                      to={`/blog/${adjacentPosts.previous.slug}`}
                      className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group"
                    >
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Previous
                        </span>
                        <span className="font-medium">
                          {adjacentPosts.previous.title}
                        </span>
                      </div>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {adjacentPosts.next ? (
                    <Link
                      to={`/blog/${adjacentPosts.next.slug}`}
                      className="flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group ml-auto text-right"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Next
                        </span>
                        <span className="font-medium">
                          {adjacentPosts.next.title}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  ) : null}
                </nav>
              )}
            </article>

            {/* Table of Contents Sidebar */}
            {toc.length > 0 && (
              <aside className="hidden sm:sticky sm:top-20 sm:col-span-4 sm:block sm:self-start">
                <TableOfContents items={toc} />
              </aside>
            )}
          </div>
        </div>
      </main>
    </PageTransition>
  );
};
