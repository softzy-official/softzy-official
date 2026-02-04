import React from "react";
import CategoryLists from "./categoryLists";
import CategoryWithImage from "./categoryWithImage";
import ProductByTitle from "./productByTitle";
import ProductList from "./productList";
import ReviewsSection from "./reviews";
import FAQSection from "./faqSection";
import HeroSection from "./heroSection";
import DividerMarquee from "../extras/dividerMarquee";
import DividerTwo from "../extras/dividerTwo";

const Homepage = () => {
  return (
    <div>
      <CategoryLists />
      <HeroSection/>
      <CategoryWithImage />
      {/* <ProductByTitle /> */}
      <ProductList
        badge="Trending"
        title="Trending Now"
        description="Most popular products this week"
        type="trending"
        background="white"
      />
      <DividerMarquee/>
      <ProductList
        badge="Featured Products"
        title="Featured Products"
        description="Featured popular products this week"
        type="featured"
        background="muted/5"
      />
      <ProductList
        badge="Most Selling"
        title="Most Selling Products"
        description="Most popular products this week"
        type="mustTry"
        background="white"
      />
      {/* <DividerTwo/> */}
      <ReviewsSection />
      <FAQSection />
    </div>
  );
};

export default Homepage;
