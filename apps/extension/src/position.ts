export interface Point {
  x: number;
  y: number;
}
export interface Viewport {
  width: number;
  height: number;
  offsetLeft: number;
  offsetTop: number;
}
export function positionPopup(
  anchor: Point,
  size: { width: number; height: number },
  viewport: Viewport,
): Point {
  const left = viewport.offsetLeft + 8;
  const top = viewport.offsetTop + 8;
  const right = viewport.offsetLeft + viewport.width - 8;
  const bottom = viewport.offsetTop + viewport.height - 8;
  let x = anchor.x + 8;
  let y = anchor.y + 8;
  if (x + size.width > right) x = anchor.x - 8 - size.width;
  if (y + size.height > bottom) y = anchor.y - 8 - size.height;
  return {
    x: Math.max(left, Math.min(x, right - size.width)),
    y: Math.max(top, Math.min(y, bottom - size.height)),
  };
}
