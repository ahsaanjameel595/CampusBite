export function formatPrice(value) {
  return `PKR ${Number(value || 0).toLocaleString('en-PK')}`;
}
