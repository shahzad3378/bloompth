import Hero from "@/components/Hero";
import Categories from "@/components/Categories";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChoose from "@/components/WhyChoose";
import UaeServices from "@/components/UaeServices";
import FulfillmentProcess from "@/components/FulfillmentProcess";
import SellerPlatforms from "@/components/SellerPlatforms";
import BlogPreview from "@/components/BlogPreview";
import ConversionCta from "@/components/ConversionCta";

export default function Home() {
  return (
    <>
      <Hero />
      <SellerPlatforms />
      <UaeServices />
      <Categories />
      <FeaturedProducts />
      <FulfillmentProcess />
      <WhyChoose />
      <BlogPreview />
      <ConversionCta />
    </>
  );
}
