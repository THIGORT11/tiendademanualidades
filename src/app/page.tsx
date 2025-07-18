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
