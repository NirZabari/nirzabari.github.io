import React, { useEffect, useRef, useState } from 'react';
import { TableOfContentsItem } from '../types/blog';
import {
  getActiveHeadingId,
  type HeadingPosition,
} from '../utils/getActiveHeadingId';

interface TableOfContentsProps {
  items: TableOfContentsItem[];
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ items }) => {
  const [activeId, setActiveId] = useState<string>('');
  const navRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (items.length === 0) return;

    const offset = 120;

    const updateActiveHeading = () => {
      const headings = items
        .map((item) => {
          const element = document.getElementById(item.id);
          if (!element) return null;

          return {
            id: item.id,
            top: window.scrollY + element.getBoundingClientRect().top,
          };
        })
        .filter((heading): heading is HeadingPosition => heading !== null);

      if (headings.length === 0) return;

      const nextActiveId = getActiveHeadingId(headings, window.scrollY, offset);

      setActiveId(nextActiveId);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(() => {
        updateActiveHeading();
        ticking = false;
      });
    };

    const timers = [0, 100, 300].map((delay) =>
      window.setTimeout(updateActiveHeading, delay),
    );

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveHeading);

    return () => {
      timers.forEach(window.clearTimeout);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveHeading);
    };
  }, [items]);

  useEffect(() => {
    if (!activeId || !navRef.current) return;

    const navElement = navRef.current;
    const activeItem = navElement.querySelector<HTMLElement>(
      `[data-toc-id="${CSS.escape(activeId)}"]`,
    );

    if (activeItem) {
      const navRect = navElement.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const padding = 12;

      if (itemRect.top < navRect.top + padding) {
        navElement.scrollTop -= navRect.top + padding - itemRect.top;
      } else if (itemRect.bottom > navRect.bottom - padding) {
        navElement.scrollTop += itemRect.bottom - (navRect.bottom - padding);
      }
    }
  }, [activeId]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const offsetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const buildTOCTree = (items: TableOfContentsItem[]): React.ReactNode => {
    const result: React.ReactNode[] = [];
    let i = 0;

    while (i < items.length) {
      const item = items[i];
      const children: TableOfContentsItem[] = [];
      let j = i + 1;

      while (j < items.length && items[j].level > item.level) {
        children.push(items[j]);
        j++;
      }

      const isActive = activeId === item.id;

      result.push(
        <li key={item.id} className="mt-2">
          <button
            data-toc-id={item.id}
            aria-current={isActive ? 'location' : undefined}
            onClick={() => scrollToHeading(item.id)}
            className={`w-full text-left leading-6 transition-colors ${
              item.level === 1
                ? isActive
                  ? 'text-sm font-bold text-primary-600 dark:text-primary-400'
                  : 'text-sm font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400'
                : item.level === 2
                  ? isActive
                    ? 'text-[0.92rem] font-bold text-primary-600 dark:text-primary-400'
                    : 'text-[0.92rem] font-medium text-gray-800 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400'
                  : isActive
                    ? 'text-[0.84rem] font-bold text-primary-600 dark:text-primary-400'
                    : 'text-[0.84rem] text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            {item.text}
          </button>
          {children.length > 0 && (
            <ul className="ml-4 mt-1 space-y-1">{buildTOCTree(children)}</ul>
          )}
        </li>,
      );

      i = j;
    }

    return <>{result}</>;
  };

  if (items.length === 0) return null;

  return (
    <div className="sm:h-[calc(100vh-6rem)]">
      <div className="flex rounded-2xl border border-gray-200/80 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/70 sm:h-full sm:flex-col">
        <h2 className="mb-3 text-base font-semibold text-gray-900 dark:text-white">
          Table of Contents
        </h2>
        <nav
          ref={navRef}
          className="min-h-0 flex-1 overflow-y-auto pr-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          <ul className="space-y-0.5">{buildTOCTree(items)}</ul>
        </nav>
      </div>
    </div>
  );
};
