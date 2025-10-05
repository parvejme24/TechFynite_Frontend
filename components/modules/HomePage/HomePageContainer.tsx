import React from "react";
import BuildWithUs from "./BuildWithUs/BuildWithUs";
import ResultAnalytics from "./ResultAnalytics/ResultAnalytics";
import Testimonial from "./Testimonial/Testimonial";
import WorkingProgress from "./WorkingProgress/WorkingProgress";
import NewProducts from "./NewProducts/NewProducts";
import PopularCategories from "./PopularCategories/PopularCategories";
import Banner from "./Banner/Banner";

export default function HomePageContainer() {
  return (
    <>
      <Banner />
      <PopularCategories />
      <NewProducts />
      <WorkingProgress />
      <ResultAnalytics />
      <BuildWithUs />
      <Testimonial />
    </>
  );
}
