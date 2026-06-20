export function stripJsonc(raw) {
  let out = '';
  let inString = false;
  let stringChar = '';
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (ch === '\\') { out += ch + raw[++i]; continue; }
      out += ch;
      if (ch === stringChar) inString = false;
    } else {
      if (ch === '"' || ch === "'") { inString = true; stringChar = ch; out += ch; continue; }
      if (ch === '/' && raw[i + 1] === '/') { while (i < raw.length && raw[i] !== '\n') i++; continue; }
      if (ch === '/' && raw[i + 1] === '*') { i += 2; while (i < raw.length && !(raw[i] === '*' && raw[i + 1] === '/')) i++; i += 2; continue; }
      out += ch;
    }
  }
  return out;
}

export function parseJsonc(raw) {
  return JSON.parse(stripJsonc(raw));
}
