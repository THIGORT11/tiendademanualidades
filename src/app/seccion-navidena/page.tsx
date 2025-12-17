import { Header, Footer, Navigation } from "@/components/layout-components";
import { ProductCard, Product } from "@/components/product-card";

const products: Product[] = [
    {
        name: "Carta para papa Noel (sobre incluido)",
        price: "1,50 €",
        imageUrl: "https://i.imgur.com/H91RMJK.jpeg",
        dataAiHint: "christmas letter"
    },
    {
        name: "Reno para colgar",
        price: "1 €",
        imageUrl: "https://i.imgur.com/GL2i7QD.jpeg",
        dataAiHint: "hanging reindeer"
    },
    {
        name: "Papa Noel para colgar",
        price: "1 €",
        imageUrl: "https://i.imgur.com/YSdIF9y.jpeg",
        dataAiHint: "hanging santa"
    },
];

export default function SeccionNavidena() {
    return (
        <>
            <Header />
            <main className="flex-grow">
                <section className="py-12 px-4 text-center bg-background">
                    <Navigation />
                </section>
                <section className="py-12 px-4 md:px-8 bg-background">
                    <h2 className="text-4xl font-bold text-primary mb-12 font-headline text-center">Sección Navideña</h2>
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
