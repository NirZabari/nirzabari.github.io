import { visit } from 'unist-util-visit';
import type { Root, Paragraph, Link, Parent } from 'mdast';

// Patterns for different video platforms
const VIDEO_PATTERNS = {
  youtube: /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  vimeo: /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/,
  youtubeEmbed: /^https?:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  vimeoEmbed: /^https?:\/\/player\.vimeo\.com\/video\/(\d+)/,
};

export function remarkVideoEmbeds() {
  return (tree: Root) => {
    visit(tree, 'paragraph', (node: Paragraph, index: number | null, parent: Parent | null) => {
      if (node.children.length === 1 && node.children[0].type === 'link') {
        const link = node.children[0] as Link;
        const url = link.url;
        
        // Check for YouTube
        let match = url.match(VIDEO_PATTERNS.youtube) || url.match(VIDEO_PATTERNS.youtubeEmbed);
        if (match) {
          const videoId = match[1];
          const embedUrl = `https://www.youtube.com/embed/${videoId}`;
          
          parent.children[index!] = {
            type: 'html',
            value: `<div class="video-embed video-embed-youtube"><iframe src="${embedUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`,
          };
          return;
        }
        
        // Check for Vimeo
        match = url.match(VIDEO_PATTERNS.vimeo) || url.match(VIDEO_PATTERNS.vimeoEmbed);
        if (match) {
          const videoId = match[1];
          const embedUrl = `https://player.vimeo.com/video/${videoId}`;
          
          parent.children[index!] = {
            type: 'html',
            value: `<div class="video-embed video-embed-vimeo"><iframe src="${embedUrl}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`,
          };
          return;
        }
      }
    });
  };
}
