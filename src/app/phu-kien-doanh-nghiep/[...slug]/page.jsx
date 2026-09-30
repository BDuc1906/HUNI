// ==================================================
// src/app/phu-kien-doanh-nghiep/[...slug]/page.jsx
// Sub-category routing cho Phụ Kiện Doanh Nghiệp (mu-non, cap-da, ca-vat)
// ==================================================

import { notFound } from "next/navigation";
import { SITE_HIERARCHY } from "@/shared/data/siteHierarchy";
import CategorySubPage from "@/features/catalog/components/CategorySubPage";

const SUB_SLUGS = [
  ["mu-non"],
  ["cap-da"],
  ["ca-vat"],
];

export function generateStaticParams() {
  return SUB_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  const catKey = `phu-kien-doanh-nghiep/${slugPath}`;
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

export default async function PhuKienDoanhNghiepSubPage({ params }) {
  const { slug } = await params;
  const slugPath = Array.isArray(slug) ? slug.join("/") : slug;
  const catKey = `phu-kien-doanh-nghiep/${slugPath}`;
  const catInfo = SITE_HIERARCHY.categories[catKey];

  if (!catInfo) {
    notFound();
  }

  return <CategorySubPage categoryInfo={catInfo} slugArray={slug} />;
}
