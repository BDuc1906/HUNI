import SubCategoryView from "@/features/catalog/components/SubCategoryView";
import { SITE_TREE } from "@/shared/data/siteArchitecture";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/dong-phuc-may-do/${slug.join("/")}`;
  const item = SITE_TREE.find((t) => t.path === fullPath);

  const title = item
    ? `${item.label} May Đo Bespoke Cao Cấp | HDC FASHION`
    : "Đồng Phục May Đo | HDC FASHION";
  const description = item
    ? `${item.desc}. May đo chuẩn xác từng nhân sự, thiết kế phong cách Ý sang trọng.`
    : "Đồng phục may đo bespoke cao cấp từ HDC FASHION.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://hdcfashion.vn${fullPath}`,
      images: ["/images/uniform_corporate_suits.jpg"],
    },
    alternates: {
      canonical: `https://hdcfashion.vn${fullPath}`,
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/dong-phuc-may-do/${slug.join("/")}`;

  return (
    <SubCategoryView
      fullPath={fullPath}
      hubSlug="/dong-phuc-may-do"
      hubTitle="Đồng Phục May Đo"
      initialCategory="bespoke_suit"
    />
  );
}
