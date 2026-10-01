import SubCategoryView from "@/features/catalog/components/SubCategoryView";
import { SITE_TREE } from "@/shared/data/siteArchitecture";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/dong-phuc-the-thao/${slug.join("/")}`;
  const item = SITE_TREE.find((t) => t.path === fullPath);

  const title = item
    ? `${item.label} Cao Cấp Thoáng Khí 2026 | HDC FASHION`
    : "Đồng Phục Thể Thao & Golf | HDC FASHION";
  const description = item
    ? `${item.desc}. Vải Dry-fit kháng khuẩn, chống tia UV50+, co giãn 4 chiều.`
    : "Đồng phục thể thao golf, pickleball, marathon cao cấp từ HDC FASHION.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://hdcfashion.vn${fullPath}`,
      images: ["/images/uniform_sport_golf.jpg"],
    },
    alternates: {
      canonical: `https://hdcfashion.vn${fullPath}`,
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/dong-phuc-the-thao/${slug.join("/")}`;

  return (
    <SubCategoryView
      fullPath={fullPath}
      hubSlug="/dong-phuc-the-thao"
      hubTitle="Đồng Phục Thể Thao"
      initialCategory="sport_golf"
    />
  );
}
