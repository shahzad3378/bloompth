import Link from "next/link";
import { ArrowUpRight, BookOpen, CalendarDays } from "lucide-react";
import type { BlogPost } from "@/lib/blogs";

const toneClasses = {
  forest: "bg-brand-900 text-white",
  mint: "bg-brand-100 text-brand-950",
  sand: "bg-sand-100 text-ink",
};

export default function BlogCard({ post }: { post: BlogPost }) {
  const published = new Intl.DateTimeFormat("en-AE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(post.publishedAt + "T00:00:00"));

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link
        href={"/blog/" + post.slug}
        className={
          toneClasses[post.tone] +
          " bp-dot-pattern relative flex min-h-[190px] cursor-pointer flex-col justify-between overflow-hidden p-6"
        }
      >
        <div className="flex items-start justify-between gap-4">
          <span className="rounded-full border border-current/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em]">
            {post.category}
          </span>
          <BookOpen size={22} />
        </div>
        <p className="bp-display max-w-sm text-2xl leading-[1.08]">{post.title}</p>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm leading-7 text-muted">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-muted">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {published}
          </span>
          <span>{post.readTime}</span>
        </div>
        <Link
          href={"/blog/" + post.slug}
          className="mt-auto inline-flex w-fit cursor-pointer items-center gap-2 pt-6 text-sm font-black text-brand-900 transition group-hover:gap-3"
        >
          Read guide <ArrowUpRight size={17} />
        </Link>
      </div>
    </article>
  );
}
