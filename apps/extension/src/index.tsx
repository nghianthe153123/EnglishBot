import type { ReactElement } from 'react';

/** Điểm gắn tạm thời; giao diện sản phẩm sẽ được thiết kế ở Phase 1 và dựng ở Phase 2. */
export function ExtensionRoot(): ReactElement {
  return <div data-englishbot-surface="extension" />;
}
