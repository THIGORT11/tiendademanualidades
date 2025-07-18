import { Facebook, Instagram, Search, Twitter } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tienda de Manualidades | Calidad y Creatividad",
  description: "Descubre materiales de manualidades de calidad premium y kits inspiradores para transformar tus ideas en realidad.",
  openGraph: {
    title: "Tienda de Manualidades Premium",
    description: "Descubre un mundo de creatividad con nuestra exclusiva selección de materiales y kits de manualidades. Calidad premium para tus proyectos.",
    images: [{ url: "https://i.imgur.com/CWsII5N.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda de Manualidades Premium",
    description: "Descubre un mundo de creatividad con nuestra exclusiva selección de materiales y kits de manualidades. Calidad premium para tus proyectos.",
    images: ["https://i.imgur.com/CWsII5N.png"],
  },
};

const Header = () => (
  <header className="py-4 px-4 bg-background border-b">
    <div className="max-w-4xl mx-auto flex justify-center">
      <Image 
        src="https://i.imgur.com/CWsII5N.png" 
        alt="Logo de la Tienda de Manualidades" 
        width={200} 
        height={200}
        priority
      />
    </div>
  </header>
);

const Footer = () => (
    <footer className="bg-card py-8 px-4 text-muted-foreground border-t">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <Image 
                  src="https://i.imgur.com/CWsII5N.png" 
                  alt="Logo de la Tienda de Manualidades en el pie de página" 
                  width={50} 
                  height={50}
                  className="rounded-full"
                />
                <p className="text-sm">&copy; 2025 Tienda de Manualidades. <br /> Todos los derechos reservados.</p>
            </div>
            <div className="flex justify-center space-x-6">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Facebook">
                    <Facebook />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Twitter">
                    <Twitter />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-300" aria-label="Instagram">
                    <Instagram />
                </a>
            </div>
        </div>
    </footer>
);

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="flex flex-col items-center justify-center text-center px-4 py-16 bg-background">
          <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
            <div className="flex w-full max-w-xl mx-auto items-center space-x-2 border border-primary rounded-full p-2 mb-8 bg-card shadow-lg">
              <Input type="search" placeholder="Buscar hilos, pinturas, kits..." className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow" />
              <Button type="submit" size="icon" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex flex-wrap justify-center gap-4">
              <Button variant="link" asChild size="lg"><Link href="/seccion-1">Sección 1</Link></Button>
              <Button variant="link" asChild size="lg"><Link href="/seccion-2">Sección 2</Link></Button>
              <Button variant="link" asChild size="lg"><Link href="/seccion-3">Sección 3</Link></Button>
              <Button variant="link" asChild size="lg"><Link href="/seccion-4">Sección 4</Link></Button>
              <Button variant="link" asChild size="lg"><Link href="/seccion-5">Sección 5</Link></Button>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
