import { Facebook, Instagram, Search, Twitter } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Tienda de Manualidades | Calidad y Creatividad",
  description: "Descubre materiales de manualidades de calidad premium y kits inspiradores para transformar tus ideas en realidad.",
  openGraph: {
    title: "Tienda de Manualidades Premium",
    description: "Descubre un mundo de creatividad con nuestra exclusiva selección de materiales y kits de manualidades. Calidad premium para tus proyectos.",
    images: [{ url: "https://placehold.co/1200x630" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tienda de Manualidades Premium",
    description: "Descubre un mundo de creatividad con nuestra exclusiva selección de materiales y kits de manualidades. Calidad premium para tus proyectos.",
    images: ["https://placehold.co/1200x675"],
  },
};

const HeroSection = () => (
    <header className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-16 bg-background relative">
      <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
        <Image 
          src="https://i.imgur.com/CWsII5N.png" 
          alt="Logo de la Tienda de Manualidades" 
          width={400} 
          height={400} 
          className="mb-8"
          priority
        />
        <h1 className="text-5xl font-bold text-primary mb-4 font-headline">Tu Laboratorio Creativo</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl">Descubre un universo de posibilidades con nuestra selección exclusiva de materiales y kits para manualidades.</p>
        
        <div className="flex w-full max-w-xl mx-auto items-center space-x-2 border border-primary rounded-full p-2 mb-8 bg-card shadow-lg">
          <Input type="search" placeholder="Buscar hilos, pinturas, kits..." className="border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 flex-grow" />
          <Button type="submit" size="icon" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
            <Search className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex flex-wrap justify-center gap-4">
          <Button variant="link" asChild><a href="#diy-kits">DIY Kits</a></Button>
          <Button variant="link" asChild><a href="#materials">Materiales</a></Button>
          <Button variant="link" asChild><a href="#inspiration">Inspiración</a></Button>
          <Button variant="link" asChild><a href="#new-products">Novedades</a></Button>
          <Button variant="link" asChild><a href="#contact">Contacto</a></Button>
        </nav>
      </div>
    </header>
  );

const Section = ({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-20 px-4 text-center ${className}`}>
    <h2 className="text-4xl font-bold text-primary mb-8 font-headline">{title}</h2>
    <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
      {children}
    </div>
  </section>
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
      <HeroSection />
      <main>
        <Section id="diy-kits" title="DIY Kits" className="bg-card">
          <p></p>
        </Section>
        <Section id="materials" title="Materiales" className="bg-background">
          <p></p>
        </Section>
        <Section id="inspiration" title="Inspiración" className="bg-card">
          <p></p>
        </Section>
        <Section id="new-products" title="Novedades" className="bg-background">
          <p></p>
        </Section>
        <Section id="contact" title="Contacto" className="bg-card">
          <p></p>
        </Section>
      </main>
      <Footer />
    </>
  );
}
