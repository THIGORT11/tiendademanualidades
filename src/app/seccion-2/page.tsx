import { Header, Footer, Navigation } from "@/components/layout-components";
import { ProductCard, Product } from "@/components/product-card";

const products: Product[] = [
  {
    name: "Marcapáginas",
    price: "1 €",
    imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512822724.jpg",
    dataAiHint: "bookmark"
  },
  {
    name: "Libro de leer",
    price: "2 €",
    imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512870153.jpg",
    dataAiHint: "book"
  },
  {
    name: "Libro El paradón",
    price: "5 €",
    imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4529400273.jpg",
    dataAiHint: "book cover"
  },
  {
    name: "Libro Salvando partidos",
    price: "5 €",
    imageUrl: "https://i.imgur.com/MYAhDpJ.jpeg",
    dataAiHint: "sports book"
  },
  {
    name: "Libro La mejor parada",
    price: "5 €",
    imageUrl: "https://i.imgur.com/SGcu25m.jpeg",
    dataAiHint: "soccer book"
  },
  {
    name: "Libro Todo lo que hay detrás del torneo de bebes",
    price: "5 €",
    imageUrl: "https://placehold.co/400x600?text=Torneo+Bebes",
    dataAiHint: "book"
  },
];

export default function Seccion2() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-12 px-4 text-center bg-background">
          <Navigation />
        </section>
        <section className="py-12 px-4 md:px-8 bg-card">
          <h2 className="text-4xl font-bold text-primary mb-12 font-headline text-center">Sección 2</h2>
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