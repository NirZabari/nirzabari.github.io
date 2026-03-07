import { visit } from 'unist-util-visit';
import type { Root, Paragraph, Code, Parent } from 'mdast';

// Support for Plotly.js, Observable, and custom interactive graphs
export function remarkInteractiveGraphs() {
  return (tree: Root) => {
    visit(tree, 'code', (node: Code, index: number | null, parent: Parent | null) => {
      // Check for plotly code blocks: ```plotly
      if (node.lang === 'plotly' && parent) {
        const plotlyData = node.value;
        parent.children[index!] = {
          type: 'html',
          value: `<div class="interactive-graph plotly-graph" data-plotly='${plotlyData.replace(/'/g, '&apos;')}'></div>`,
        };
      }
      
      // Check for observable code blocks: ```observable
      if (node.lang === 'observable' && parent) {
        const notebookId = node.value.trim();
        parent.children[index!] = {
          type: 'html',
          value: `<div class="interactive-graph observable-graph"><iframe src="https://observablehq.com/embed/${notebookId}?cell=*" style="width: 100%; height: 600px; border: 0;"></iframe></div>`,
        };
      }
    });
    
    // Support for plotly: URL pattern in paragraphs
    visit(tree, 'paragraph', (node: Paragraph, index: number | null, parent: Parent | null) => {
      if (node.children.length === 1 && node.children[0].type === 'text') {
        const text = (node.children[0] as any).value;
        
        // Plotly JSON URL: plotly:https://...
        if (text.startsWith('plotly:')) {
          const url = text.replace('plotly:', '');
          parent!.children[index!] = {
            type: 'html',
            value: `<div class="interactive-graph plotly-graph" data-plotly-url="${url}"></div>`,
          };
        }
      }
    });
  };
}
