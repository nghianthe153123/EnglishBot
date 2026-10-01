import { describe, expect, it } from 'vitest';
import { PHRASE_FIXTURES, WORD_FIXTURES } from './fixtures.js';

describe('deterministic mock fixtures', () => {
  it('provides stable word values with the requested stress case', () => {
    expect(WORD_FIXTURES.map(({ term }) => term)).toEqual([
      'resilient',
      'adapt',
      'sustain',
      'antidisestablishmentarianism',
    ]);
    expect(
      WORD_FIXTURES.every(({ pos, definition, example }) =>
        Boolean(pos && definition.trim() && example.trim()),
      ),
    ).toBe(true);
  });

  it('provides stable phrase values', () => {
    expect(PHRASE_FIXTURES).toEqual([
      {
        text: 'Learning takes time.\nSmall habits help us adapt.\nSteady practice helps us sustain progress.',
        definition:
          'Việc học cần có thời gian.\nNhững thói quen nhỏ giúp chúng ta thích nghi với điều kiện mới.\nLuyện tập đều đặn giúp chúng ta duy trì tiến bộ, ngay cả khi không thể nhìn thấy kết quả ngay lập tức. Đây là dữ liệu mẫu nhiều dòng để kiểm tra cách xuống dòng, cuộn nội dung và vị trí nút đóng trên một viewport hẹp.',
      },
      { text: 'Learning takes time.', definition: 'Việc học cần có thời gian.' },
      {
        text: 'Well-being matters',
        definition: 'Sức khỏe và trạng thái hạnh phúc đều quan trọng.',
      },
    ]);
  });
});
