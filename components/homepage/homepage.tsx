import React from "react";
import CategoryLists from "./categoryLists";
import CategoryWithImage from "./categoryWithImage";
import ProductByTitle from "./productByTitle";
import ProductListOne from "./productListOne";
import ProductListTwo from "./productListTwo";
import ProductListThree from "./productListThree";
import ReviewsSection from "./reviews";
import FAQSection from "./faqSection";

const Homepage = () => {
  return (
    <div>
      <CategoryLists />
      <CategoryWithImage />
      <ProductByTitle />
      <ProductListOne
        badge="Trending"
        title="Trending Now"
        description="Most popular products this week"
      />
      <ProductListTwo
        badge="Featured Products"
        title="Must Try Items"
        description="Most popular products this week"
      />
      <ProductListThree
        badge="Most Selling"
        title="Most Selling Products"
        description="Most popular products this week"
      />
      <ReviewsSection/>
      <FAQSection/>
    </div>
  );
};

export default Homepage;
