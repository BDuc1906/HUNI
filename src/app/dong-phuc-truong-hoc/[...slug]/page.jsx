import SubCategoryView from "@/features/catalog/components/SubCategoryView";
import { SITE_TREE } from "@/shared/data/siteArchitecture";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/dong-phuc-truong-hoc/${slug.join("/")}`;
  const item = SITE_TREE.find((t) => t.path === fullPath);

  const title = item
    ? `${item.label} Chuẩn Mực Thanh Lịch 2026 | HDC FASHION`
    : "Đồng Phục Trường Học | HDC FASHION";
  const description = item
    ? `${item.desc}. Đồng phục học sinh, sinh viên, giáo viên an toàn cho làn da, bền màu.`
    : "Đồng phục học sinh và giáo viên chuẩn nề nếp từ HDC FASHION.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://hdcfashion.vn${fullPath}`,
      images: ["/images/uniform_school_students.jpg"],
    },
    alternates: {
      canonical: `https://hdcfashion.vn${fullPath}`,
    },
  };
}

export default async function Page({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const fullPath = `/dong-phuc-truong-hoc/${slug.join("/")}`;

  return (
    <SubCategoryView
      fullPath={fullPath}
      hubSlug="/dong-phuc-truong-hoc"
      hubTitle="Đồng Phục Trường Học"
      initialCategory="school"
    />
  );
}
