import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
} from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { blogPosts, getBlogPost } from "@/lib/blogs";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

const toneClasses = {
  forest: "bg-brand-900 text-white",
  mint: "bg-brand-100 text-brand-950",
  sand: "bg-sand-100 text-ink",
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "Guide not found",
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: "/blog/" + post.slug,
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      url: "/blog/" + post.slug,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const published = new Intl.DateTimeFormat("en-AE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(post.publishedAt + "T00:00:00"));

  const relatedPosts = blogPosts
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 3);

  const whatsappUrl =
    "https://wa.me/971507297900?text=Hello%20BloomPath%2C%20I%20read%20one%20of%20your%20UAE%20seller%20guides%20and%20want%20to%20discuss%20my%20business.";

  return (
    <main className="bg-white">
      <article>
        <header
          className={
            toneClasses[post.tone] +
            " bp-dot-pattern relative overflow-hidden py-14 sm:py-20"
          }
        >
          <div className="bp-container relative">
            <Link
              href="/blog"
              className="inline-flex cursor-pointer items-center gap-2 text-sm font-black opacity-75 transition hover:gap-3 hover:opacity-100"
            >
              <ArrowLeft size={17} />
              Back to all guides
            </Link>

            <div className="mt-10 max-w-4xl">
              <span className="inline-flex rounded-full border border-current/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em]">
                {post.category}
              </span>
              <h1 className="bp-display mt-6 text-[2.65rem] sm:text-6xl">
                {post.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 opacity-72 sm:text-lg">
                {post.excerpt}
              </p>
              <div className="mt-7 flex flex-wrap gap-5 text-sm font-bold opacity-70">
                <span className="flex items-center gap-2">
                  <CalendarDays size={17} />
                  {published}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 size={17} />
                  {post.readTime}
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="bp-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <div className="mx-auto w-full max-w-[760px]">
            <div className="space-y-12">
              {post.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-2xl font-black tracking-tight text-ink sm:text-3xl">
                    {section.heading}
                  </h2>
                  <div className="mt-5 space-y-5">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-base leading-8 text-muted sm:text-[1.06rem]"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {section.bullets && (
                    <ul className="mt-6 space-y-3 rounded-2xl border border-line bg-sand-100 p-5 sm:p-6">
                      {section.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-start gap-3 text-sm font-bold leading-7 text-ink/80"
                        >
                          <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-900">
                            <Check size={12} strokeWidth={3} />
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-14 border-t border-line pt-8 text-sm leading-7 text-muted">
              <p>
                This guide provides general operational information, not legal,
                tax or product-compliance advice. Confirm requirements that
                apply to your company and products with the relevant UAE
                authority or a qualified adviser.
              </p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-[1.35rem] bg-brand-950 p-6 text-white">
              <p className="bp-eyebrow text-brand-500">Need a practical answer?</p>
              <h2 className="mt-4 text-xl font-black">
                Discuss your UAE selling model with BloomPath.
              </h2>
              <p className="mt-3 text-sm leading-7 text-white/58">
                Share your product type, order volume and current sales channel.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand-500 px-5 py-3.5 text-sm font-black text-brand-950 transition hover:bg-white"
              >
                <MessageCircle size={18} />
                Ask on WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </article>

      <section className="border-t border-line bg-sand-100 py-16 sm:py-20">
        <div className="bp-container">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="bp-eyebrow text-brand-900">Continue learning</p>
              <h2 className="mt-3 text-3xl font-black text-ink">
                More seller guides
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden cursor-pointer items-center gap-2 text-sm font-black text-brand-900 sm:inline-flex"
            >
              All guides <ArrowRight size={17} />
            </Link>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
