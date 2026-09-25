"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { calculateTierPrice } from "@/shared/lib/pricing";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Cart state
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Wishlist state
  const [wishlist, setWishlist] = useState([]);

  // Modals state
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);
  const [isQuickQuoteOpen, setIsQuickQuoteOpen] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [customizerProduct, setCustomizerProduct] = useState(null);

  // Active product category (shared between Header dropdown & Catalog section)
  const [activeCategory, setActiveCategory] = useState("all");

  // Discount voucher
  const [voucherCode, setVoucherCode] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState(null);

  // Orders stored locally for tracking
  const [orders, setOrders] = useState([]);

  // Toast notifications
  const [toast, setToast] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("huni_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("huni_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));

      const savedOrders = localStorage.getItem("huni_orders");
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("huni_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Error saving cart", e);
    }
  }, [cart]);

  // Sync wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("huni_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.error("Error saving wishlist", e);
    }
  }, [wishlist]);

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("huni_orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Error saving orders", e);
    }
  }, [orders]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Add item to cart
  const addToCart = (product, quantity = 10, options = {}) => {
    const {
      color = product.colors?.[0]?.name || "Tiêu chuẩn",
      size = product.sizes?.[0] || "L",
      customLogo = null
    } = options;

    const unitPrice = calculateTierPrice(product, quantity);
    const cartItemId = `${product.id}-${color}-${size}-${customLogo ? "custom" : "standard"}`;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        const newUnitPrice = calculateTierPrice(product, newQty);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          unitPrice: newUnitPrice
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            cartItemId,
            product,
            quantity,
            color,
            size,
            customLogo,
            unitPrice
          }
        ];
      }
    });

    showToast(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.cartItemId === cartItemId) {
          const newUnitPrice = calculateTierPrice(item.product, newQty);
          return {
            ...item,
            quantity: newQty,
            unitPrice: newUnitPrice
          };
        }
        return item;
      })
    );
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => prevCart.filter((item) => item.cartItemId !== cartItemId));
    showToast("Đã xóa khỏi giỏ hàng", "info");
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist toggle
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Đã bỏ khỏi danh sách yêu thích", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Đã lưu vào danh sách yêu thích");
        return [...prev, productId];
      }
    });
  };

  // Apply discount code
  const applyVoucher = (code) => {
    const trimmed = (code || "").trim().toUpperCase();
    if (trimmed === "HUNI2026") {
      setAppliedVoucher({
        code: "HUNI2026",
        discountPercent: 5,
        label: "Giảm 5% toàn bộ đơn hàng"
      });
      showToast("Áp dụng mã HUNI2026 (-5%) thành công");
      return true;
    } else if (trimmed === "DOANHNGHIEP") {
      setAppliedVoucher({
        code: "DOANHNGHIEP",
        discountAmount: 200000,
        label: "Tặng 200.000đ may mẫu thử"
      });
      showToast("Áp dụng mã DOANHNGHIEP (-200k) thành công");
      return true;
    } else {
      showToast("Mã ưu đãi không hợp lệ", "error");
      return false;
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode("");
    showToast("Đã xóa mã ưu đãi", "info");
  };

  // Cart Subtotal Calculation
  const cartSubtotal = cart.reduce((total, item) => {
    const logoCost = item.customLogo ? 15000 : 0;
    return total + (item.unitPrice + logoCost) * item.quantity;
  }, 0);

  let discountValue = 0;
  if (appliedVoucher) {
    if (appliedVoucher.discountPercent) {
      discountValue = Math.round((cartSubtotal * appliedVoucher.discountPercent) / 100);
    } else if (appliedVoucher.discountAmount) {
      discountValue = Math.min(cartSubtotal, appliedVoucher.discountAmount);
    }
  }

  const cartTotal = Math.max(0, cartSubtotal - discountValue);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }
  };

  // Add placed order
  const saveOrder = (orderData) => {
    const newOrder = {
      id: `HN-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountValue,
      total: cartTotal,
      voucher: appliedVoucher,
      status: "Đã tiếp nhận - Chờ duyệt mẫu 3D",
      ...orderData
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setAppliedVoucher(null);
    triggerConfetti();
    return newOrder;
  };

  return (
    <ShopContext.Provider
      value={{
        activeCategory,
        setActiveCategory,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartTotal,
        discountValue,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isOrderTrackingOpen,
        setIsOrderTrackingOpen,
        isQuickQuoteOpen,
        setIsQuickQuoteOpen,
        isCustomizerOpen,
        setIsCustomizerOpen,
        customizerProduct,
        setCustomizerProduct,
        voucherCode,
        setVoucherCode,
        appliedVoucher,
        applyVoucher,
        removeVoucher,
        orders,
        saveOrder,
        showToast,
        getProductTierPrice: calculateTierPrice,
        triggerConfetti
      }}
    >
      {children}

      {/* Clean Minimalist Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-200">
          <div
            className={`px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2.5 text-xs font-semibold border ${
              toast.type === "error"
                ? "bg-red-50 text-red-900 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-900"
                : toast.type === "info"
                ? "bg-neutral-100 text-neutral-900 border-neutral-300 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800"
                : "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-900 dark:border-white"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}