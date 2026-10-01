import type { PartOfSpeech } from '@englishbot/api-contracts';

/** Deterministic mock dictionary records; these are never live provider responses. */
export const WORD_FIXTURES: readonly {
  term: string;
  pos: PartOfSpeech;
  definition: string;
  example: string;
}[] = [
  {
    term: 'resilient',
    pos: 'adjective',
    definition: 'có khả năng nhanh chóng phục hồi sau khó khăn',
    example: 'The resilient team adapted after the setback.',
  },
  {
    term: 'adapt',
    pos: 'verb',
    definition: 'thay đổi để phù hợp với những điều kiện mới',
    example: 'Plants adapt to changes in their environment.',
  },
  {
    term: 'sustain',
    pos: 'verb',
    definition: 'duy trì để một điều gì đó tiếp tục trong thời gian dài',
    example: 'Good habits sustain steady progress.',
  },
  {
    term: 'antidisestablishmentarianism',
    pos: 'noun',
    definition:
      'quan điểm phản đối việc tách một giáo hội đã được nhà nước công nhận khỏi sự bảo trợ chính thức của nhà nước',
    example:
      'His essay explained antidisestablishmentarianism as opposition to ending the established church’s relationship with the state.',
  },
];

export const PHRASE_FIXTURES: readonly { text: string; definition: string }[] = [
  {
    text: 'Learning takes time.\nSmall habits help us adapt.\nSteady practice helps us sustain progress.',
    definition:
      'Việc học cần có thời gian.\nNhững thói quen nhỏ giúp chúng ta thích nghi với điều kiện mới.\nLuyện tập đều đặn giúp chúng ta duy trì tiến bộ, ngay cả khi không thể nhìn thấy kết quả ngay lập tức. Đây là dữ liệu mẫu nhiều dòng để kiểm tra cách xuống dòng, cuộn nội dung và vị trí nút đóng trên một viewport hẹp.',
  },
  { text: 'Learning takes time.', definition: 'Việc học cần có thời gian.' },
  { text: 'Well-being matters', definition: 'Sức khỏe và trạng thái hạnh phúc đều quan trọng.' },
];
