import React from "react";
import Image from "next/image";

const AboutPage = () => {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-10 bg-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full poppins mb-4">
            Our Story
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground poppins mb-6">
            About Softzy
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground poppins leading-relaxed max-w-2xl mx-auto">
            We believe in bringing you the finest products that blend quality, style, and affordability. 
            Every item in our collection is handpicked to ensure it meets our high standards.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-muted">
              <Image
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1170&auto=format&fit=crop"
                alt="Our Mission"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full poppins mb-4">
                Our Mission
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground poppins mb-5">
                Quality Products, Happy Customers
              </h2>
              <p className="text-muted-foreground poppins leading-relaxed mb-4">
                At Softzy, our mission is simple — to make premium quality products accessible to everyone. 
                We work directly with trusted manufacturers to bring you authentic products at the best prices.
              </p>
              <p className="text-muted-foreground poppins leading-relaxed">
                From fashion accessories to home essentials, we curate only the best. 
                Every product goes through our quality check to ensure you receive nothing but the finest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full poppins mb-4">
              What We Stand For
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground poppins">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-background border border-border/40 rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground poppins mb-3">
                Quality First
              </h3>
              <p className="text-sm text-muted-foreground poppins leading-relaxed">
                We never compromise on quality. Every product is carefully selected and checked before reaching you.
              </p>
            </div>

            <div className="bg-background border border-border/40 rounded-2xl p-6 sm:p-8">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                <span className="text-2xl">💝</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground poppins mb-3">
                Customer Love
              </h3>
              <p className="text-sm text-muted-foreground poppins leading-relaxed">
                Your satisfaction is our priority. We&apos;re here to help with any questions or concerns you may have.
              </p>
            </div>

            <div className="bg-background border border-border/40 rounded-2xl p-6 sm:p-8 sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground poppins mb-3">
                Trust & Transparency
              </h3>
              <p className="text-sm text-muted-foreground poppins leading-relaxed">
                We believe in honest business. What you see is what you get — no hidden costs, no surprises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-16 sm:py-20 ">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-3 py-1 bg-secondary/10 text-secondary text-xs font-medium rounded-full poppins mb-4">
            Our Promise
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground poppins mb-6">
            Why Shop With Us?
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-secondary poppins mb-2">100%</p>
              <p className="text-sm text-muted-foreground poppins">Authentic Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-secondary poppins mb-2">24/7</p>
              <p className="text-sm text-muted-foreground poppins">Customer Support</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-secondary poppins mb-2">Fast</p>
              <p className="text-sm text-muted-foreground poppins">Delivery</p>
            </div>
            <div className="text-center">
              <p className="text-3xl sm:text-4xl font-bold text-secondary poppins mb-2">Easy</p>
              <p className="text-sm text-muted-foreground poppins">Returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-secondary/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground poppins mb-4">
            Start Shopping Today
          </h2>
          <p className="text-muted-foreground poppins mb-8">
            Discover our collection of premium products curated just for you.
          </p>
          <a
            href="/shop"
            className="inline-flex px-8 py-3 bg-secondary text-white text-sm font-medium rounded-xl poppins"
          >
            Explore Products
          </a>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;