
import { Header, Footer, Navigation } from "@/components/layout-components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tienda de Manualidades | Calidad y Creatividad",
  description: "Descubre materiales de manualidades de calidad premium y kits inspiradores para transformar tus ideas en realidad.",
  openGraph: {
    title: "Tienda de Manualidades Premium",
    description: "Descubre un mundo de creatividad con nuestra exclusiva selección de materiales y kits de manualidades. Calidad premium para tus proyectos.",
    images: [{ url: "https://i.imgur.com/WaDyt2D.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda de Manualidades Premium",
    description: "Descubre un mundo de creatividad con nuestra exclusiva selección de materiales y kits de manualidades. Calidad premium para tus proyectos.",
    images: ["https://i.imgur.com/WaDyt2D.png"],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center text-center px-4 py-16 bg-background">
          <Navigation />
        </section>
      </main>
      <Footer />
    </>
  );
}
