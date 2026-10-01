import { describe, expect, it } from 'vitest';
import { positionPopup } from './position.js';
describe('popup layout CSS coordinates', () => {
  for (const width of [320, 360, 420]) {
    for (const height of [360, 640]) {
      for (const offset of [0, 20]) {
        for (const x of [0, width / 2, width]) {
          for (const y of [0, height / 2, height]) {
            it(`clamps ${width}/${height}/${offset}/${x}/${y}`, () => {
              const size = { width: Math.min(320, width - 16), height: Math.min(400, height - 16) };
              const result = positionPopup({ x: x + offset, y: y + offset }, size, {
                width,
                height,
                offsetLeft: offset,
                offsetTop: offset,
              });
              expect(result.x).toBeGreaterThanOrEqual(offset + 8);
              expect(result.y).toBeGreaterThanOrEqual(offset + 8);
              expect(result.x + size.width).toBeLessThanOrEqual(width + offset - 8);
              expect(result.y + size.height).toBeLessThanOrEqual(height + offset - 8);
            });
          }
        }
      }
    }
  }
});
