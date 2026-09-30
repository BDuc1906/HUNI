// ==================================================
// src/app/dong-phuc-truong-hoc/[...slug]/page.jsx
// Sub-category routing cho Trường Học (hoc-sinh, giao-vien)
// ==================================================

import { notFound } from "next/navigation";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";
import CategorySubPage from "@/features/catalog/components/CategorySubPage";

const SUB_SLUGS = [
  ["hoc-sinh"],
  ["giao-vien"],
];

export function generateStaticParams() {
  return SUB_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  const catKey = `dong-phuc-truong-hoc/${slugPath}`;
  const catInfo = SITE_HIERARCHY.categories[catKey];

  if (!catInfo) {
    return {
      title: "Danh Mục Không Tồn Tại | HDC FASHION",
      description: "Không tìm thấy danh mục sản phẩm tương ứng.",
    };
  }

  return {
    title: catInfo.metaTitle,
    description: catInfo.metaDesc,
    openGraph: {
      title: catInfo.metaTitle,
      description: catInfo.metaDesc,
      type: "website",
    },
    alternates: {
      canonical: catInfo.url,
    },
  };
}

export default async function DongPhucTruongHocSubPage({ params }) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  const catKey = `dong-phuc-truong-hoc/${slugPath}`;
  const catInfo = SITE_HIERARCHY.categories[catKey];

  if (!catInfo) {
    notFound();
  }

  return <CategorySubPage categoryInfo={catInfo} slugArray={slug} />;
}
