import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import WhyChoose from "@/components/WhyChoose";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedProducts />
        <WhyChoose />
      </main>
      <Footer />
    </>
  );
}