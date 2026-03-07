export interface HeadingPosition {
  id: string;
  top: number;
}

export function getActiveHeadingId(
  headings: HeadingPosition[],
  scrollY: number,
  offset: number,
): string {
  if (headings.length === 0) return '';

  const threshold = scrollY + offset;
  let activeId = headings[0].id;

  for (const heading of headings) {
    if (heading.top <= threshold) {
      activeId = heading.id;
      continue;
    }

    break;
  }

  return activeId;
}
