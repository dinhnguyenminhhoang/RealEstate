// Chuyển object address thành chuỗi string đầy đủ
function formatAddress({ street, ward, district, city }) {
  const parts = [street, ward, district, city].filter(Boolean);
  return parts.join(", ");
}
export { formatAddress };
