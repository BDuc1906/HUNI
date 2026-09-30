// ==================================================
// src/app/dong-phuc-doanh-nghiep/[...slug]/page.jsx
// Sub-category routing cho Đồng Phục Doanh Nghiệp (ao-polo, ao-so-mi, tay-ngan, tay-dai, seamless, ao-thun, dong-phuc-cong-so)
// ==================================================

import { notFound } from "next/navigation";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";
import CategorySubPage from "@/features/catalog/components/CategorySubPage";

const SUB_SLUGS = [
  ["ao-polo"],
  ["ao-so-mi"],
  ["ao-so-mi", "tay-ngan"],
  ["ao-so-mi", "tay-dai"],
  ["ao-so-mi", "seamless"],
  ["ao-thun"],
  ["dong-phuc-cong-so"],
];

export function generateStaticParams() {
  return SUB_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  const catKey = `dong-phuc-doanh-nghiep/${slugPath}`;
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

export default async function DongPhucDoanhNghiepSubPage({ params }) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  const catKey = `dong-phuc-doanh-nghiep/${slugPath}`;
  const catInfo = SITE_HIERARCHY.categories[catKey];

  if (!catInfo) {
    notFound();
  }

  return <CategorySubPage categoryInfo={catInfo} slugArray={slug} />;
}
