// ==================================================
// src/shared/utils/accountLockManager.js
// Quản lý trạng thái khóa tài khoản tập trung thời gian thực.
// Đảm bảo: Khi khóa -> không vào được nữa, đang sử dụng -> bị out ngay lập tức.
// ==================================================

const STORAGE_KEY = "hdc_locked_accounts";

// Danh sách tài khoản bị khóa ban đầu (mặc định nhân viên cũ)
export const DEFAULT_LOCKED_ACCOUNTS = [
  {
    email: "trongvd@cu-nhanvien.vn",
    reason: "Đã chấm dứt hợp đồng lao động, thu hồi quyền truy cập.",
    lockedAt: "2025-08-15 14:10",
  },
];

export function getLockedAccounts() {
  if (typeof window === "undefined") return DEFAULT_LOCKED_ACCOUNTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_LOCKED_ACCOUNTS));
      return DEFAULT_LOCKED_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return DEFAULT_LOCKED_ACCOUNTS;
  }
}

export function isAccountLocked(email) {
  if (!email) return false;
  const list = getLockedAccounts();
  const normalized = email.toLowerCase().trim();
  return list.some((item) => item.email.toLowerCase().trim() === normalized);
}

export function lockAccount(email, reason = "Tài khoản bị khóa bởi Quản trị viên.") {
  if (!email || typeof window === "undefined") return;
  const normalized = email.toLowerCase().trim();
  const list = getLockedAccounts().filter(
    (item) => item.email.toLowerCase().trim() !== normalized
  );

  const updated = [
    ...list,
    {
      email: normalized,
      reason,
      lockedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
    },
  ];

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

  // Phát tín hiệu thời gian thực cho tất cả tab / component
  window.dispatchEvent(
    new CustomEvent("hdc_account_lock_changed", {
      detail: { email: normalized, locked: true, reason },
    })
  );
}

export function unlockAccount(email) {
  if (!email || typeof window === "undefined") return;
  const normalized = email.toLowerCase().trim();
  const list = getLockedAccounts().filter(
    (item) => item.email.toLowerCase().trim() !== normalized
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));

  window.dispatchEvent(
    new CustomEvent("hdc_account_lock_changed", {
      detail: { email: normalized, locked: false },
    })
  );
}
