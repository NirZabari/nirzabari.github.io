import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';

function getClassNames(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string')
    : [];
}

function createTextNode(value: string): Text {
  return { type: 'text', value };
}

function trimTrailingEmptyLines(
  lines: Array<Array<Element | Text>>,
): Array<Array<Element | Text>> {
  const trimmedLines = [...lines];

  while (
    trimmedLines.length > 1 &&
    trimmedLines[trimmedLines.length - 1].length === 0
  ) {
    trimmedLines.pop();
  }

  return trimmedLines;
}

function splitNodesIntoLines(
  nodes: Array<Element | Text>,
): Array<Array<Element | Text>> {
  const lines: Array<Array<Element | Text>> = [[]];

  const pushToCurrentLine = (node: Element | Text) => {
    lines[lines.length - 1].push(node);
  };

  const createNextLine = () => {
    lines.push([]);
  };

  for (const node of nodes) {
    if (node.type === 'text') {
      const parts = node.value.split('\n');

      parts.forEach((part, index) => {
        if (part.length > 0) {
          pushToCurrentLine(createTextNode(part));
        }

        if (index < parts.length - 1) {
          createNextLine();
        }
      });

      continue;
    }

    const childNodes = node.children.filter(
      (child): child is Element | Text =>
        child.type === 'element' || child.type === 'text',
    );
    const childLines = splitNodesIntoLines(childNodes);

    childLines.forEach((childLine, index) => {
      if (childLine.length > 0) {
        pushToCurrentLine({
          ...node,
          properties: node.properties ? { ...node.properties } : undefined,
          children: childLine,
        });
      }

      if (index < childLines.length - 1) {
        createNextLine();
      }
    });
  }

  return lines;
}

function getNodeText(node: Element | Text): string {
  if (node.type === 'text') {
    return node.value;
  }

  return node.children
    .map((child) =>
      child.type === 'element' || child.type === 'text'
        ? getNodeText(child)
        : '',
    )
    .join('');
}

function createCopyIcon(className: string, path: string): Element {
  return {
    type: 'element',
    tagName: 'svg',
    properties: {
      className: [className],
      viewBox: '0 0 16 16',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '1.5',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      ariaHidden: 'true',
    },
    children: [
      {
        type: 'element',
        tagName: 'path',
        properties: { d: path },
        children: [],
      },
    ],
  };
}

function isElementNode(node: unknown): node is Element {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as Element).type === 'element'
  );
}

function isTextNode(node: unknown): node is Text {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    (node as Text).type === 'text'
  );
}

function isWhitespaceTextNode(node: unknown): node is Text {
  return isTextNode(node) && node.value.trim().length === 0;
}

function getSourceMetadataElement(
  node: Element | undefined,
): { href: string; label: string } | null {
  if (!node || node.tagName !== 'p') {
    return null;
  }

  const meaningfulChildren = node.children.filter(
    (child) => !isWhitespaceTextNode(child),
  );

  if (
    meaningfulChildren.length !== 1 ||
    !isElementNode(meaningfulChildren[0]) ||
    meaningfulChildren[0].tagName !== 'a'
  ) {
    return null;
  }

  const link = meaningfulChildren[0];
  const href =
    typeof link.properties?.href === 'string' ? link.properties.href : '';
  const text = getNodeText(link).trim();

  if (!href || !text.startsWith('Source:')) {
    return null;
  }

  const label = text.replace(/^Source:\s*/, '').trim();
  return {
    href,
    label: label || href,
  };
}

function getNextMeaningfulSiblingIndex(
  siblings: Array<Element | Text>,
  startIndex: number,
): number | null {
  for (let index = startIndex + 1; index < siblings.length; index += 1) {
    const sibling = siblings[index];

    if (isWhitespaceTextNode(sibling)) {
      continue;
    }

    return index;
  }

  return null;
}

function createToolbarElement(language: string): Element {
  const children: Array<Element | Text> = [];

  if (language) {
    children.push({
      type: 'element',
      tagName: 'span',
      properties: { className: ['code-language-badge'] },
      children: [createTextNode(language)],
    });
  }

  children.push({
    type: 'element',
    tagName: 'button',
    properties: {
      className: ['code-copy-button'],
      type: 'button',
      dataCodeCopyButton: 'true',
      ariaLabel: 'Copy code to clipboard',
    },
    children: [
      createCopyIcon(
        'code-copy-icon',
        'M5.75 5.75h7.5v8.5h-7.5z M2.75 2.75h7.5v8.5',
      ),
      createCopyIcon('code-check-icon', 'M3.75 8.25 6.5 11l5.75-5.75'),
    ],
  });

  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['code-block-toolbar'] },
    children: [
      {
        type: 'element',
        tagName: 'div',
        properties: { className: ['code-block-actions'] },
        children,
      },
    ],
  };
}

function createSourceFooterElement(href: string, label: string): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['code-block-source'] },
    children: [
      {
        type: 'element',
        tagName: 'span',
        properties: { className: ['code-block-source-label'] },
        children: [createTextNode('Source')],
      },
      {
        type: 'element',
        tagName: 'a',
        properties: {
          className: ['code-block-source-link'],
          href,
        },
        children: [createTextNode(label)],
      },
    ],
  };
}

function createLineNumbersElement(lineCount: number): Element {
  return {
    type: 'element',
    tagName: 'div',
    properties: {
      className: ['code-line-numbers'],
      ariaHidden: 'true',
    },
    children: Array.from({ length: lineCount }, (_, index) => ({
      type: 'element',
      tagName: 'span',
      properties: { className: ['code-line-number'] },
      children: [createTextNode(String(index + 1))],
    })),
  };
}

function createCodeLineElement(children: Array<Element | Text>): Element {
  return {
    type: 'element',
    tagName: 'span',
    properties: { className: ['code-line'] },
    children: children.length > 0 ? children : [createTextNode('')],
  };
}

export function rehypeRememberExplicitCodeLanguage() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element) => {
      if (
        node.tagName === 'pre' &&
        node.children[0]?.type === 'element' &&
        node.children[0].tagName === 'code'
      ) {
        const codeElement = node.children[0] as Element;
        const className = (codeElement.properties?.className as string[]) || [];
        const explicitLanguage =
          className
            .find((cls: string) => cls.startsWith('language-'))
            ?.replace('language-', '') || '';

        node.properties = node.properties || {};
        node.properties['data-explicit-language'] = explicitLanguage;
      }
    });
  };
}

export function rehypeEnhanceCodeBlocks() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, index: number | null, parent: Element | null) => {
      if (
        node.tagName !== 'pre' ||
        index === null ||
        !parent ||
        node.properties?.dataCodeEnhanced === 'true' ||
        node.children[0]?.type !== 'element' ||
        node.children[0].tagName !== 'code'
      ) {
        return;
      }

      const codeElement = node.children[0] as Element;
      const className = getClassNames(codeElement.properties?.className);
      const explicitLanguage =
        typeof node.properties?.['data-explicit-language'] === 'string'
          ? (node.properties['data-explicit-language'] as string)
          : '';
      const highlightedChildren = codeElement.children.filter(
        (child): child is Element | Text =>
          child.type === 'element' || child.type === 'text',
      );
      const codeLines = trimTrailingEmptyLines(
        splitNodesIntoLines(highlightedChildren),
      );
      const lineCount = Math.max(codeLines.length, 1);
      const sourceSiblingIndex = getNextMeaningfulSiblingIndex(
        parent.children as Array<Element | Text>,
        index,
      );
      const sourceMetadata = getSourceMetadataElement(
        sourceSiblingIndex !== null
          ? (parent.children[sourceSiblingIndex] as Element | undefined)
          : undefined,
      );

      node.properties = node.properties || {};
      node.properties.dataCodeEnhanced = 'true';
      node.properties.className = [
        ...getClassNames(node.properties.className),
        'code-block-pre',
      ];
      codeElement.properties = codeElement.properties || {};
      codeElement.properties.className = [
        ...getClassNames(codeElement.properties.className),
        'code-block-code',
      ];
      codeElement.children = codeLines.map((line) =>
        createCodeLineElement(line),
      );

      const wrapperChildren: Element[] = [
        createToolbarElement(explicitLanguage),
        {
          type: 'element',
          tagName: 'div',
          properties: { className: ['code-block-body'] },
          children: [createLineNumbersElement(lineCount), node],
        },
      ];

      if (sourceMetadata) {
        wrapperChildren.push(
          createSourceFooterElement(sourceMetadata.href, sourceMetadata.label),
        );
      }

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: { className: ['enhanced-code-block'] },
        children: wrapperChildren,
      };

      if (sourceMetadata && sourceSiblingIndex !== null) {
        parent.children.splice(sourceSiblingIndex, 1);
      }
    });
  };
}
