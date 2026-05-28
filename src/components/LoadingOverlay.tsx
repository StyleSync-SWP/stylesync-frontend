import React from "react";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-12 h-12 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
    </div>
  );
}
