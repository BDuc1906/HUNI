import SubCategoryView from "@/features/catalog/components/SubCategoryView";
import { SITE_TREE } from "@/shared/data/siteArchitecture";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/dong-phuc-doanh-nghiep/${slug.join("/")}`;
  const item = SITE_TREE.find((t) => t.path === fullPath);

  const title = item
    ? `${item.label} Cao Cấp 2026 | HDC FASHION`
    : "Đồng Phục Doanh Nghiệp | HDC FASHION";
  const description = item
    ? `${item.desc}. May trực tiếp tại xưởng HDC 2.500m², thiết kế 3D và may mẫu 0đ.`
    : "Đồng phục doanh nghiệp cao cấp từ HDC FASHION.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://hdcfashion.vn${fullPath}`,
      images: ["/images/uniform_polo_corporate.jpg"],
    },
    alternates: {
      canonical: `https://hdcfashion.vn${fullPath}`,
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/dong-phuc-doanh-nghiep/${slug.join("/")}`;

  return (
    <SubCategoryView
      fullPath={fullPath}
      hubSlug="/dong-phuc-doanh-nghiep"
      hubTitle="Đồng Phục Doanh Nghiệp"
      initialCategory="corporate"
    />
  );
}
