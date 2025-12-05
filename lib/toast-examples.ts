// ============================================
// 🎉 SONNER TOAST - Quick Reference
// ============================================

import { toast } from "@/lib/toast";

// ============================================
// BASIC USAGE
// ============================================

// Success
toast.success("Berhasil disimpan!");
toast.success("Berhasil", "Batch produksi telah dibuat");

// Error
toast.error("Gagal menyimpan!");
toast.error("Error", "Terjadi kesalahan pada server");

// Info
toast.info("Informasi penting");

// Warning
toast.warning("Peringatan!");

// ============================================
// LOADING & PROMISES
// ============================================

// Loading manual
const id = toast.loading("Menyimpan...");
// ... setelah selesai
toast.dismiss(id);
toast.success("Selesai!");

// Promise (RECOMMENDED)
toast.promise(
  fetch("/api/data").then((r) => r.json()),
  {
    loading: "Loading...",
    success: "Berhasil!",
    error: "Gagal!",
  }
);

// ============================================
// REAL WORLD EXAMPLES
// ============================================

// 1. Form Submit
const handleSubmit = async (data) => {
  toast.promise(saveData(data), {
    loading: "Menyimpan data...",
    success: (result) => `${result.name} berhasil dibuat!`,
    error: (err) => err.message,
  });
};

// 2. Delete Action
const handleDelete = async (id) => {
  const response = await fetch(`/api/items/${id}`, { method: "DELETE" });
  const result = await response.json();

  if (result.success) {
    toast.success("Terhapus", "Item berhasil dihapus");
  } else {
    toast.error("Gagal", result.error);
  }
};

// 3. With Undo Action
toast.custom("File dihapus", {
  action: {
    label: "Undo",
    onClick: () => restoreFile(),
  },
});

// 4. Long Duration for Important Messages
toast.custom("Baca dengan teliti", {
  description: "Ini pesan penting",
  duration: 10000, // 10 detik
});

// ============================================
// REPLACE OLD ALERTS
// ============================================

// OLD ❌
alert("Data berhasil disimpan!");
if (error) alert(error.message);

// NEW ✅
toast.success("Data berhasil disimpan!");
if (error) toast.error("Error", error.message);

// ============================================
// TIPS
// ============================================
// ✅ Gunakan promise toast untuk async ops
// ✅ Tambahkan description untuk konteks
// ✅ Action button untuk undo operations
// ✅ Loading toast untuk proses lama
// ✅ Dismiss manual dengan toast.dismiss(id)
