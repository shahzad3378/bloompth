import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/lib/blogs";

export default function BlogPreview() {
  return (
    <section className="bg-sand-100 py-16 sm:py-24">
      <div className="bp-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="bp-eyebrow text-brand-900">BloomPath seller guides</p>
            <h2 className="bp-display mt-4 text-4xl text-ink sm:text-5xl">
              Better decisions before the next order.
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">
              Practical UAE guidance on products, COD, warehousing and e-commerce
              operations—written for sellers, not software teams.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex w-fit cursor-pointer items-center gap-2 text-sm font-black text-brand-900 transition hover:gap-3"
          >
            View all guides <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
