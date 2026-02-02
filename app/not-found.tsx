import React from "react";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <main className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-7xl sm:text-9xl font-bold text-secondary poppins mb-4">
          404
        </h1>
        <p className="text-lg sm:text-xl text-foreground poppins mb-2">
          Page Not Found
        </p>
        <p className="text-sm text-muted-foreground poppins mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/"
          className="inline-flex px-6 py-3 bg-secondary text-white text-sm font-medium rounded-xl poppins"
        >
          Go Home
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;