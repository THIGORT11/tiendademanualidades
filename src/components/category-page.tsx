import { notFound } from 'next/navigation';
import { categories, products } from '@/content/catalog';
import { Footer, Header, Navigation } from '@/components/layout-components';
import { ProductCard } from '@/components/product-card';

export function CategoryPage({ categoryId, muted = false }: { categoryId: string; muted?: boolean }) {
  const category = categories.find((item) => item.id === categoryId);
  if (!category) notFound();
  const categoryProducts = products.filter((product) => product.categoryId === category.id);

  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="bg-background px-4 py-12 text-center">
          <Navigation />
        </section>
        <section className={`px-4 py-12 md:px-8 ${muted ? 'bg-card' : 'bg-background'}`}>
          <h2 className="mb-12 text-center font-headline text-4xl font-bold text-primary">{category.name}</h2>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
