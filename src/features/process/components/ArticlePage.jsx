import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, List, Sparkles } from "lucide-react";
import ModuleBreadcrumb from "./ModuleBreadcrumb";

export default function ArticlePage({ article }) {
  const { title, subtitle, heroImage, heroAlt, intro, topics, ctaTitle, ctaDescription, ctaLabel } = article;

  return (
    <>
      <ModuleBreadcrumb current={title} />

      <article className="bg-white">
        <header className="border-y border-slate-200 bg-[#f6f8ff]">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_.95fr] lg:items-center">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-brand-700"><Sparkles className="h-3.5 w-3.5" aria-hidden="true" />Góc tư vấn HDC Fashion</span>
              <h1 className="mt-5 text-3xl font-black leading-tight text-[#004f5e] sm:text-4xl">{title}</h1>
              <p className="mt-5 text-base leading-7 text-slate-600">{subtitle}</p>
              <p className="mt-4 text-sm leading-6 text-slate-500">{intro}</p>
            </div>
            <div className="relative min-h-64 overflow-hidden rounded-3xl bg-brand-900 shadow-xl sm:min-h-80">
              <Image src={heroImage} alt={heroAlt} fill priority sizes="(max-width: 1024px) 100vw, 45vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#00222a]/35 via-transparent" aria-hidden="true" />
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[16rem_minmax(0,1fr)]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:sticky lg:top-36">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.14em] text-[#004f5e]"><List className="h-4 w-4 text-brand-600" aria-hidden="true" />Nội dung bài viết</p>
            <ol className="mt-4 space-y-3 text-sm">
              {topics.map((topic, index) => <li key={topic.title}><a href={`#topic-${index + 1}`} className="group flex gap-2 text-slate-600 transition hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"><span className="font-black text-brand-600">{String(index + 1).padStart(2, "0")}</span><span className="leading-5 group-hover:underline">{topic.title}</span></a></li>)}
            </ol>
          </aside>

          <div className="min-w-0">
            <div className="mb-10 border-l-4 border-brand-500 bg-brand-50 px-5 py-4 text-sm leading-7 text-brand-950">{intro}</div>
            <div className="space-y-12">
              {topics.map((topic, index) => (
                <section id={`topic-${index + 1}`} key={topic.title} className="scroll-mt-36">
                  <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_13rem] md:items-start">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-brand-600">{String(index + 1).padStart(2, "0")}</p>
                      <h2 className="mt-2 text-2xl font-black leading-tight text-[#004f5e]">{topic.title}</h2>
                      {topic.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">{paragraph}</p>)}
                      {topic.bullets?.length > 0 && <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700">{topic.bullets.map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" /><span>{item}</span></li>)}</ul>}
                    </div>
                    {topic.image && <div className="relative min-h-44 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 md:min-h-52"><Image src={topic.image} alt={topic.imageAlt || topic.title} fill sizes="(max-width: 768px) 100vw, 208px" className="object-cover" /></div>}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>

        <section className="bg-[#003843] py-14 text-white sm:py-16">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-black sm:text-3xl">{ctaTitle}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">{ctaDescription}</p>
            <Link href="/bao-gia-dong-phuc-cong-ty" className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-400 px-5 py-3 text-sm font-extrabold text-[#003843] transition hover:bg-brand-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{ctaLabel}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>
      </article>
    </>
  );
}
