import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Search, Twitter } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import Image from "next/image";

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
  <header className="min-h-screen flex items-center justify-center text-center px-4 py-16 bg-background relative">
    <div className="max-w-4xl mx-auto z-10 flex flex-col items-center">
      <Image 
        src="https://i.imgur.com/CWsII5N.png" 
        alt="Logo de la Tienda de Manualidades" 
        width={400} 
        height={400} 
        className="mb-8"
        priority
      />
      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        Descubre materiales de manualidades de calidad premium y kits inspiradores para transformar tus ideas en realidad.
      </p>

      <div className="mb-12 w-full max-w-md">
        <div className="relative">
          <Input 
            type="text" 
            placeholder="Buscar productos (ej. 'hilos de oro')"
            className="w-full py-3 pl-12 pr-4 h-12 rounded-xl border-border bg-card text-foreground placeholder-muted-foreground focus:ring-ring focus-visible:ring-2"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:-translate-y-0.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <a href="#kits">Kits DIY</a>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:-translate-y-0.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <a href="#materials">Materiales</a>
        </Button>
        <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:-translate-y-0.5 border-primary text-primary hover:bg-primary hover:text-primary-foreground">
          <a href="#contact">Contacto</a>
        </Button>
      </div>
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
    <footer className="bg-card py-12 px-4 text-center text-muted-foreground border-t">
        <div className="max-w-4xl mx-auto">
            <p className="mb-4">&copy; 2025 Tienda de Manualidades. Todos los derechos reservados.</p>
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
        <Section id="kits" title="Nuestros Kits DIY" className="bg-card">
          <p>Explora nuestra colección curada de kits "Hazlo Tú Mismo", perfectos para principiantes y expertos.</p>
        </Section>
        <Section id="materials" title="Materiales de Calidad Superior" className="bg-background">
          <p>Desde pinturas hasta hilos, encuentra los mejores materiales para tus proyectos más ambiciosos.</p>
        </Section>
        <Section id="contact" title="Contáctanos" className="bg-card">
          <p className="mb-8">¿Tienes preguntas o necesitas ayuda? Estamos aquí para asistirte.</p>
          <ContactForm />
        </Section>
      </main>
      <Footer />
    </>
  );
}
