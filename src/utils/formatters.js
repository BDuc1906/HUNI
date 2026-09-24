// Format tiền tệ Việt Nam (VNĐ)
export function formatCurrency(amount) {
  if (typeof amount !== "number") return "0 đ";
  return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
}

// Format số lượng
export function formatNumber(num) {
  if (typeof num !== "number") return "0";
  return new Intl.NumberFormat("vi-VN").format(num);
}
