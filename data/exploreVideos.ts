export interface ExploreVideo {
  id: string;
  video: string;
  title: string;
  type: "Unboxing" | "Styling" | "Packing" | "Review";
  productLink: string;
}

export const exploreVideos: ExploreVideo[] = [
  {
    id: "v1",
    video: "https://www.pexels.com/download/video/6074185/",
    title: "Premium Leather Tote",
    type: "Unboxing",
    productLink: "/product/premium-leather-tote-bag",
  },
  {
    id: "v2",
    video: "https://www.pexels.com/download/video/9603569/",
    title: "Rainbow Wooden Blocks",
    type: "Review",
    productLink: "/product/rainbow-wooden-building-blocks",
  },
  {
    id: "v3",
    video: "https://www.pexels.com/download/video/7205515/",
    title: "SOFTZY Premium Packaging",
    type: "Packing",
    productLink: "/shop",
  },
  {
    id: "v4",
    video: "https://www.pexels.com/download/video/7205560/",
    title: "Mini Crossbody Sling",
    type: "Styling",
    productLink: "/product/mini-crossbody-sling-bag",
  },
  
];
