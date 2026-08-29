import type { Metadata } from "next";
import { BookOpen, Compass } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/lib/blogs";

export const metadata: Metadata = {
  title: "UAE E-commerce & Fulfillment Blog",
  description:
    "Practical UAE seller guides covering dropshipping, product sourcing, COD operations, warehousing and e-commerce fulfillment.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  return (
    <main className="bg-white">
      <section className="relative overflow-hidden bg-brand-950 py-16 text-white sm:py-24">
        <div className="bp-grid-pattern pointer-events-none absolute inset-0 opacity-60" />
        <div className="bp-container relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-2 text-xs font-black text-brand-100">
              <Compass size={15} className="text-brand-500" />
              UAE seller knowledge centre
            </div>
            <h1 className="bp-display mt-6 text-5xl sm:text-6xl">
              Build the operation behind the advertisement.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/65 sm:text-lg">
              Clear, practical articles for UAE online sellers making decisions
              about products, COD, inventory and fulfillment.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="bp-container">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
            <div>
              <p className="bp-eyebrow text-brand-900">All guides</p>
              <h2 className="mt-3 text-2xl font-black text-ink">
                Latest from BloomPath
              </h2>
            </div>
            <div className="hidden items-center gap-2 text-sm font-bold text-muted sm:flex">
              <BookOpen size={17} />
              {blogPosts.length} practical articles
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
