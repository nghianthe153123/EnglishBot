/* global document, window, getComputedStyle */
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';

const packageRoot = process.env.ENGLISHBOT_QA_NODE_MODULES;
if (!packageRoot)
  throw new Error(
    'Cần ENGLISHBOT_QA_NODE_MODULES trỏ tới runtime có Playwright; không tự tải dependency.',
  );
const require = createRequire(resolve(packageRoot, '../package.json'));
const { chromium } = require('playwright');
const origin = process.env.ENGLISHBOT_QA_URL ?? 'http://127.0.0.1:4173';
const output = resolve('docs/evidence/P1-103/screenshots');
await mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.ENGLISHBOT_QA_CHROME ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const checks = [];
const errors = [];
const external = [];
const context = await browser.newContext({
  viewport: { width: 360, height: 760 },
  reducedMotion: 'reduce',
});
context.setDefaultTimeout(10000);
await context.route('**/*', async (route) => {
  const url = route.request().url();
  if (!url.startsWith(`${origin}/`) && !url.startsWith('data:')) {
    external.push(url);
    await route.abort();
  } else await route.continue();
});
const page = await context.newPage();
page.on('pageerror', (error) => errors.push(error.message));
const popup = () => page.getByTestId('popup');
async function start({ key = true } = {}) {
  await page.goto(origin);
  await page.getByTestId('manager-toggle').click();
  await page.getByTestId('activate').click();
  await page.getByRole('button', { name: 'Cài đặt', exact: true }).click();
  assert.equal(await page.getByTestId('threshold').inputValue(), '');
  assert.equal(await page.getByRole('radio', { name: 'Google', exact: true }).isChecked(), false);
  await page.getByRole('radio', { name: 'Google', exact: true }).check();
  await page.getByRole('button', { name: 'Đóng cài đặt', exact: true }).click();
  await page.locator('summary').click();
  if (key) await page.getByTestId('mock-key').check();
  await page.getByTestId('manager-toggle').click();
}
async function select(text, point) {
  await page.getByTestId(`select-${text}`).click(point ? { position: point } : undefined);
  assert.equal(await popup().count(), 0);
  await page.getByTestId('translate').click();
  await page.getByTestId('popup-close').waitFor();
}
async function word(text = 'resilient') {
  await select(text);
  await page.getByTestId('add-word').waitFor();
}
async function nativeSelection(text, point) {
  await page.evaluate(
    ({ text, point }) => {
      const element = document.querySelector(`[data-word="${text}"]`);
      if (!element) throw new Error('Thiếu DOM fixture');
      if (point) {
        element.style.position = 'fixed';
        element.style.left = `${point.x}px`;
        element.style.top = `${point.y}px`;
        element.style.zIndex = '10';
      }
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    },
    { text, point },
  );
  await page.getByTestId('translate').waitFor();
}
function contrast(a, b) {
  const luminance = (color) => {
    const channels = color
      .match(/\d+/gu)
      .slice(0, 3)
      .map((value) => {
        const n = Number(value) / 255;
        return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };
  const la = luminance(a),
    lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
async function bounds() {
  await page.waitForFunction(
    () => {
      const rect = document.querySelector('[data-testid="popup"]')?.getBoundingClientRect();
      return (
        rect &&
        rect.x >= 7.5 &&
        rect.y >= 7.5 &&
        rect.right <= window.innerWidth - 7.5 &&
        rect.bottom <= window.innerHeight - 7.5
      );
    },
    null,
    { timeout: 3000 },
  );
  const rect = await popup().boundingBox();
  const viewport = page.viewportSize();
  assert.ok(rect && viewport);
  assert.ok(rect.x >= 7.5 && rect.y >= 7.5, `bounds start ${JSON.stringify(rect)}`);
  assert.ok(rect.x + rect.width <= viewport.width - 7.5, 'right clamp');
  assert.ok(rect.y + rect.height <= viewport.height - 7.5, 'bottom clamp');
  assert.equal(Math.round(rect.width), Math.min(320, viewport.width - 16));
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
    false,
    'no horizontal page overflow',
  );
  return rect;
}

try {
  await start();
  assert.equal(await page.getByTestId('trace').textContent(), 'Calls mô phỏng: 0');
  await page.getByTestId('select-resilient').click();
  assert.equal(await page.getByTestId('trace').textContent(), 'Calls mô phỏng: 0');
  await page.getByTestId('translate').click();
  await page.getByTestId('add-word').waitFor();
  assert.equal(
    await page.getByRole('dialog').count(),
    1,
    'one nonmodal dialog, not nested dialogs',
  );
  assert.equal(await popup().getAttribute('aria-modal'), null);
  assert.equal(
    await page.getByTestId('popup-close').evaluate((element) => element === document.activeElement),
    true,
  );
  await page.keyboard.press('Tab');
  assert.equal(
    await page.getByTestId('add-word').evaluate((element) => element === document.activeElement),
    true,
  );
  await page.keyboard.press('Tab');
  assert.equal(
    await popup().evaluate((element) => element.contains(document.activeElement)),
    false,
    'no focus trap',
  );
  await page.keyboard.press('Escape');
  assert.equal(await popup().count(), 0);
  assert.equal(
    await page
      .getByTestId('select-resilient')
      .evaluate((element) => element === document.activeElement),
    true,
  );
  checks.push('no pre-click lookup; single nonmodal dialog; close-focus/Tab exit/Escape return');

  await select('Learning takes time.');
  await popup().getByText('Việc học cần có thời gian.', { exact: true }).waitFor();
  assert.equal(await page.getByTestId('add-word').count(), 0);
  assert.equal(await popup().locator('.part-of-speech,.example').count(), 0);
  await page.getByTestId('popup-close').click();
  checks.push('phrase only meaning, no Add/POS/example');

  await word();
  await page.getByTestId('add-word').click();
  assert.equal(await page.getByTestId('add-word').isDisabled(), true);
  await page.getByTestId('popup-close').click();
  await page.getByRole('button', { name: 'Cài đặt', exact: true }).click();
  await page.getByTestId('threshold').fill('2');
  await page.getByTestId('save-options').click();
  await page.getByRole('button', { name: 'Đóng cài đặt', exact: true }).click();
  await word('adapt');
  await page.getByTestId('add-word').click();
  await page.getByTestId('popup-close').click();
  await page.getByTestId('manager-toggle').click();
  assert.equal(await page.locator('.batch').count(), 1);
  await page.screenshot({ path: resolve(output, 'queue-360-light-page.png'), fullPage: true });
  checks.push('Add idempotency, N no default, batch import');

  for (const width of [320, 360, 420]) {
    await page.setViewportSize({ width, height: 760 });
    for (const dark of [false, true]) {
      await start();
      if (dark) await page.getByLabel('Nền bài đọc tối').check();
      const toolbarButtonStyles = await page.getByTestId('manager-toggle').evaluate((element) => {
        const style = getComputedStyle(element);
        return { foreground: style.color, background: style.backgroundColor };
      });
      assert.ok(
        contrast(toolbarButtonStyles.foreground, toolbarButtonStyles.background) >= 4.5,
        'toolbar button readable on light/dark host',
      );
      assert.equal(
        await page
          .locator('.article')
          .evaluate((element) => getComputedStyle(element).backgroundColor),
        dark ? 'rgb(33, 18, 56)' : 'rgb(255, 255, 255)',
        'actual dark/light page fixture',
      );
      await word('antidisestablishmentarianism');
      const rect = await bounds();
      await page.screenshot({
        path: resolve(output, `word-${width}-${dark ? 'dark-page' : 'light-page'}.png`),
      });
      checks.push({ viewport: width, dark, word: rect });
      await page.getByTestId('popup-close').click();
      await select('Learning takes time.');
      await popup().getByText('Việc học cần có thời gian.', { exact: true }).waitFor();
      await bounds();
      await page.screenshot({
        path: resolve(output, `phrase-${width}-${dark ? 'dark-page' : 'light-page'}.png`),
      });
      await page.getByTestId('popup-close').click();
      await page.getByRole('button', { name: 'Cài đặt', exact: true }).click();
      await page.screenshot({
        path: resolve(output, `options-${width}-${dark ? 'dark-page' : 'light-page'}.png`),
        fullPage: true,
      });
    }
  }

  await page.setViewportSize({ width: 420, height: 640 });
  await start();
  await word();
  const originalTrace = await page.getByTestId('trace').textContent();
  await page.setViewportSize({ width: 320, height: 360 });
  await bounds();
  assert.equal(
    await page.getByTestId('trace').textContent(),
    originalTrace,
    'reflow never retranslate',
  );
  await page.getByTestId('add-word').click();
  await page.getByTestId('popup-close').click();
  checks.push('320x360 reflow: footer visible and Add reachable, no repeated lookup');

  await start();
  await page.getByTestId('select-resilient').click();
  await page.getByTestId('translate').click();
  await page.getByTestId('popup-close').click();
  await page.waitForTimeout(450);
  assert.equal(await popup().count(), 0);
  assert.equal(await page.getByTestId('trace').textContent(), 'Calls mô phỏng: 0');
  checks.push('close while loading invalidates old command');

  await start();
  await nativeSelection('resilient');
  await page.getByTestId('translate').click();
  await nativeSelection('adapt');
  assert.equal(await popup().count(), 0);
  await page.waitForTimeout(450);
  assert.equal(await page.getByTestId('trace').textContent(), 'Calls mô phỏng: 0');
  await page.getByTestId('translate').click();
  await page.getByTestId('add-word').waitFor();
  assert.equal(await popup().locator('.popup-term').textContent(), 'adapt');
  await page.getByTestId('mock-key').click();
  assert.equal(await popup().count(), 0);
  assert.equal(
    await page.getByTestId('mock-key').evaluate((element) => element === document.activeElement),
    true,
  );
  checks.push(
    'native DOM selection change invalidates old response; outside click preserves target focus',
  );

  for (const width of [320, 360, 420]) {
    await page.setViewportSize({ width, height: 640 });
    for (const point of [
      { x: 0, y: 0 },
      { x: width - 80, y: 0 },
      { x: 0, y: 614 },
      { x: width - 80, y: 614 },
      { x: width / 2, y: 0 },
      { x: 0, y: 320 },
      { x: width - 80, y: 320 },
      { x: width / 2, y: 614 },
    ]) {
      await start();
      await nativeSelection('resilient', point);
      await page.getByTestId('translate').click();
      await page.getByTestId('add-word').waitFor();
      const rect = await bounds();
      checks.push({ nativeSelectionEdge: point, viewport: width, popup: rect });
      await page.getByTestId('popup-close').click();
    }
  }

  await start();
  await word();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  const focusBounds = await page.getByTestId('popup-close').boundingBox(),
    dialogBounds = await popup().boundingBox();
  assert.ok(
    focusBounds.x >= dialogBounds.x + 6 &&
      focusBounds.y >= dialogBounds.y + 6 &&
      focusBounds.x + focusBounds.width <= dialogBounds.x + dialogBounds.width - 6,
    'focus ring is not clipped by popup',
  );
  const styles = await popup().evaluate((element) => {
    const root = getComputedStyle(element),
      body = getComputedStyle(element.querySelector('.popup-body')),
      caption = getComputedStyle(element.querySelector('.text-muted')),
      cta = getComputedStyle(element.querySelector('[data-testid="add-word"]'));
    const focus = element.querySelector('[data-testid="popup-close"]');
    focus.focus();
    const focusStyle = getComputedStyle(focus);
    return {
      background: root.backgroundColor,
      text: body.color,
      muted: caption.color,
      cta: { foreground: cta.color, background: cta.backgroundColor },
      focus: {
        color: focusStyle.outlineColor,
        width: focusStyle.outlineWidth,
        offset: focusStyle.outlineOffset,
      },
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    };
  });
  const contrastResults = {
    body: contrast(styles.text, styles.background),
    muted: contrast(styles.muted, styles.background),
    cta: contrast(styles.cta.foreground, styles.cta.background),
    focus: contrast(styles.focus.color, styles.background),
  };
  assert.ok(
    contrastResults.body >= 4.5 &&
      contrastResults.muted >= 4.5 &&
      contrastResults.cta >= 4.5 &&
      contrastResults.focus >= 3,
  );
  assert.equal(styles.focus.width, '3px');
  assert.equal(styles.reducedMotion, true);
  await page.screenshot({ path: resolve(output, 'focus-420-light-page.png') });
  checks.push({ computedStyles: styles, contrast: contrastResults });

  for (const scenario of ['quizlet-unavailable', 'quizlet-unknown', 'quizlet-verified-mock']) {
    await start();
    await page.getByTestId('scenario').selectOption(scenario);
    await page.getByRole('button', { name: 'Cài đặt', exact: true }).click();
    await page.getByTestId('threshold').fill('1');
    await page.getByTestId('save-options').click();
    await page.getByRole('button', { name: 'Đóng cài đặt', exact: true }).click();
    await word();
    await page.getByTestId('add-word').click();
    await page.getByTestId('popup-close').click();
    await page.getByTestId('manager-toggle').click();
    assert.equal(await page.locator('.batch').count(), 1);
    assert.equal(await page.locator('.batch button').count(), 0);
    await page.screenshot({ path: resolve(output, `queue-420-${scenario}.png`), fullPage: true });
    checks.push(`immutable batch UI ${scenario}: no blind create/retry control`);
  }
  for (const width of [320, 360, 420]) {
    await page.setViewportSize({ width, height: 640 });
    for (const dark of [false, true]) {
      await start({ key: false });
      if (dark) await page.getByLabel('Nền bài đọc tối').check();
      const text =
        'Learning takes time.\nSmall habits help us adapt.\nSteady practice helps us sustain progress.';
      await select(text);
      await popup()
        .getByText(/Những thói quen nhỏ/u)
        .waitFor();
      await bounds();
      assert.equal(await page.getByTestId('add-word').count(), 0);
      assert.equal(await popup().locator('.part-of-speech,.example').count(), 0);
      await page.screenshot({
        path: resolve(output, `long-phrase-${width}-${dark ? 'dark-page' : 'light-page'}.png`),
      });
      checks.push({ longPhrase: true, width, dark, noAiKey: true });
    }
  }

  assert.deepEqual(errors, []);
  assert.deepEqual(external, []);
  const result = {
    status: 'PASS',
    browser: browser.version(),
    checks,
    externalRequests: external,
    pageErrors: errors,
    limits: [
      'Chưa xác minh quyền Chrome thật (P1-105).',
      'Browser zoom 125%/200% cần walkthrough riêng; CSS viewport reflow không thay zoom thật.',
    ],
  };
  await writeFile(
    resolve(output, '../browser-results.json'),
    JSON.stringify(result, null, 2) + '\n',
  );
  console.log(JSON.stringify(result, null, 2));
} catch (error) {
  await writeFile(
    resolve(output, '../browser-results.json'),
    JSON.stringify(
      {
        status: 'FAIL',
        browser: browser.version(),
        checks,
        message: error.message,
        externalRequests: external,
        pageErrors: errors,
      },
      null,
      2,
    ) + '\n',
  );
  await page
    .screenshot({ path: resolve(output, 'failure.png'), fullPage: true, timeout: 5000 })
    .catch((captureError) => console.error(`Không chụp được ảnh lỗi: ${captureError.message}`));
  throw error;
} finally {
  await browser.close();
}
