// Tính đơn giá theo mốc số lượng bán sỉ cho sản phẩm
export function calculateTierPrice(product, quantity) {
  if (!product || !product.wholesaleTiers || product.wholesaleTiers.length === 0) {
    return product ? product.price : 0;
  }
  const matchedTier = product.wholesaleTiers.find(
    (tier) => quantity >= tier.min && quantity <= tier.max
  );
  return matchedTier ? matchedTier.price : product.price;
}

// Tính tiền tiết kiệm được so với giá bán lẻ
export function calculateSavings(product, quantity) {
  if (!product) return 0;
  const regularTotal = product.price * quantity;
  const tieredUnitPrice = calculateTierPrice(product, quantity);
  const tieredTotal = tieredUnitPrice * quantity;
  return Math.max(0, regularTotal - tieredTotal);
}