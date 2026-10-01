import SubCategoryView from "@/features/catalog/components/SubCategoryView";
import { SITE_TREE } from "@/shared/data/siteArchitecture";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/phu-kien-doanh-nghiep/${slug.join("/")}`;
  const item = SITE_TREE.find((t) => t.path === fullPath);

  const title = item
    ? `${item.label} Doanh Nghiệp In Thêu Logo | HDC FASHION`
    : "Phụ Kiện Doanh Nghiệp | HDC FASHION";
  const description = item
    ? `${item.desc}. Mũ nón thêu 3D, cặp da doanh nhân, cà vạt quà tặng thương hiệu.`
    : "Phụ kiện nhận diện thương hiệu doanh nghiệp cao cấp từ HDC FASHION.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://hdcfashion.vn${fullPath}`,
      images: ["/images/uniform_accessories.jpg"],
    },
    alternates: {
      canonical: `https://hdcfashion.vn${fullPath}`,
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/phu-kien-doanh-nghiep/${slug.join("/")}`;

  return (
    <SubCategoryView
      fullPath={fullPath}
      hubSlug="/phu-kien-doanh-nghiep"
      hubTitle="Phụ Kiện Doanh Nghiệp"
      initialCategory="accessories"
    />
  );
}
