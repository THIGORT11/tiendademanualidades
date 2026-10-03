import { CategoryPage } from '@/components/category-page';

export default async function StoreCategoryRoute({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;

  return <CategoryPage categoryId={categoryId} />;
}
