export interface Vec2 {
  x: number;
  y: number;
}

export function normalize(v: Vec2): Vec2 {
  const len = Math.hypot(v.x, v.y);
  return len === 0 ? { x: 0, y: 0 } : { x: v.x / len, y: v.y / len };
}

export function dot(a: Vec2, b: Vec2) {
  return a.x * b.x + a.y * b.y;
}

export function angleBetween(a: Vec2, b: Vec2): number {
  const na = normalize(a);
  const nb = normalize(b);
  const cos = dot(na, nb);
  const clamped = Math.max(-1, Math.min(1, cos));
  return (Math.acos(clamped) * 180) / Math.PI;
}
