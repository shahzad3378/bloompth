import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChoose from "@/components/WhyChoose";

export default function Home() {
  return (
    <>
      {/* Hero Banner */}
      <Hero />

      {/* Product Categories */}
      <Categories />

      {/* Featured / Trending Products */}
      <FeaturedProducts />

      {/* BloomPath Fulfillment */}
      <WhyChoose />
    </>
  );
}