import { Header, Footer, Navigation } from "@/components/layout-components";
import { ProductCard, Product } from "@/components/product-card";

const products: Product[] = [
    {
        name: "Kittydoo",
        price: "2 €",
        imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512923600.jpg",
        dataAiHint: "cat toy"
    },
    {
        name: "Animal surprise",
        price: "4 €",
        imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512923608.jpg",
        dataAiHint: "surprise egg"
    },
    {
        name: "Título de lettering",
        price: "3 €",
        imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512956979.jpg",
        dataAiHint: "lettering art",
        customization: {
            type: 'text',
            label: 'Personalízalo como quieras'
        }
    },
    {
        name: "Squishy",
        price: "1 €",
        imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512964138.jpg",
        dataAiHint: "squishy toy"
    }
];

export default function Seccion3() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-12 px-4 text-center bg-background">
          <Navigation />
        </section>
        <section className="py-12 px-4 md:px-8 bg-background">
          <h2 className="text-4xl font-bold text-primary mb-12 font-headline text-center">Sección 3</h2>
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