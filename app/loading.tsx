import React from "react";

const LoadingPage = () => {
  return (
    <main className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="w-10 h-10 border-3 border-muted border-t-secondary rounded-full animate-spin" />
      </div>
    </main>
  );
};

export default LoadingPage;