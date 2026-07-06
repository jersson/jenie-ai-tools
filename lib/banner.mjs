import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bannerPath = resolve(__dirname, '..', 'banner.txt');

const BORDER_COLOR = [165, 80, 170];
const GLYPH_COLOR = [255, 200, 80];

function colorFor(ch) {
  if (ch === ' ') return null;
  return ch === '=' ? BORDER_COLOR : GLYPH_COLOR;
}

function colorizeLine(line) {
  let out = '';
  let run = '';
  let runColor;
  const flush = () => {
    if (!run) return;
    out += runColor
      ? `\x1b[38;2;${runColor[0]};${runColor[1]};${runColor[2]}m${run}\x1b[0m`
      : run;
    run = '';
  };
  for (const ch of line) {
    const color = colorFor(ch);
    if (color !== runColor) {
      flush();
      runColor = color;
    }
    run += ch;
  }
  flush();
  return out;
}

export const BORDER = '='.repeat(29);

export function getBanner({ color = process.stdout.isTTY && !process.env.NO_COLOR } = {}) {
  const raw = readFileSync(bannerPath, 'utf8').replace(/\n$/, '');
  return color ? raw.split('\n').map(colorizeLine).join('\n') : raw;
}

export function printBanner(options) {
  console.log(getBanner(options));
}

export function getFooter({ color = process.stdout.isTTY && !process.env.NO_COLOR } = {}) {
  return color ? colorizeLine(BORDER) : BORDER;
}

export function printFooter(options) {
  console.log(getFooter(options));
}
