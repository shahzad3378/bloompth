import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AttributionTracker from "@/components/AttributionTracker";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AttributionTracker />

      <Header />

      <main className="flex-1">{children}</main>

      <Footer />
    </>
  );
}
