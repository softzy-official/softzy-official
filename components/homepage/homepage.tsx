import React from "react";
import CategoryLists from "./categoryLists";
import CategoryWithImage from "./categoryWithImage";
import ProductByTitle from "./productByTitle";
import ProductList from "./productList";
import ReviewsSection from "./reviews";
import FAQSection from "./faqSection";

const Homepage = () => {
  return (
    <div>
      <CategoryLists />
      <CategoryWithImage />
      {/* <ProductByTitle /> */}
      <ProductList
        badge="Trending"
        title="Trending Now"
        description="Most popular products this week"
        type="trending"
        background="muted"
      />
      <ProductList
        badge="Featured Products"
        title="Featured Products"
        description="Featured popular products this week"
        type="featured"
      />
      <ProductList
        badge="Most Selling"
        title="Most Selling Products"
        description="Most popular products this week"
        type="mustTry"
        background="muted"
      />
      <ReviewsSection />
      <FAQSection />
    </div>
  );
};

export default Homepage;
