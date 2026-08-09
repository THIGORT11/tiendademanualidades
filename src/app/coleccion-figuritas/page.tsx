import { Header, Footer, Navigation } from "@/components/layout-components";
import { ProductCard, Product } from "@/components/product-card";

const products: Product[] = [
  {
    name: "Figuras sorpresa (2 figuras)",
    price: "15 €",
    imageUrl: "https://i.imgur.com/rcfMcLC.jpeg",
    dataAiHint: "surprise figures"
  }
];

export default function ColeccionFiguritas() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-12 px-4 text-center bg-background">
          <Navigation />
        </section>
        <section className="py-12 px-4 md:px-8 bg-card">
          <h2 className="text-4xl font-bold text-primary mb-12 font-headline text-center">Colección figuritas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
