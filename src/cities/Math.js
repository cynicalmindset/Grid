export function floors(repos) {
  return Math.ceil(repos / 2);
}
export function gridS(n) {
  return Math.ceil(Math.sqrt(n));
}
export function blockpos(index, gridSize, spacing) {
  const xindex = index % gridSize;
  const zindex = Math.floor(index / gridSize);
  const offset = (gridSize * spacing) / 2;
  const x = xindex * spacing - offset;
  const z = zindex * spacing - offset;
  return [x, 0, z];
}
export function lcoalpos(i, spacing, cols = 2) {
  const x = (i % cols) * spacing - spacing;
  const z = Math.floor(i / cols) * spacing - spacing;
  return [x, z];
}
