import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Search, Twitter } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "CraftLab | Desata tu Creatividad",
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
  <header className="min-h-screen flex items-center justify-center text-center px-4 py-16 bg-card relative">
    <div className="max-w-4xl mx-auto z-10">
      <div className="flex flex-col md:flex-row items-center justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-muted p-3 rounded-xl shadow-inner inline-flex items-center justify-center mb-4 md:mb-0 md:mr-6">
          <span className="text-3xl font-extrabold text-muted-foreground tracking-tight font-headline">CRAFT</span>
          <span className="text-3xl font-extrabold text-blue-600 tracking-tight font-headline">LAB</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-foreground font-headline">
          Desata tu <span className="text-blue-600">Creatividad</span>
        </h1>
      </div>

      <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        Descubre materiales de manualidades de calidad premium y kits inspiradores para transformar tus ideas en realidad.
      </p>

      <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <div className="relative max-w-md mx-auto">
          <Input 
            type="text" 
            placeholder="Buscar productos (ej. 'pinturas acrílicas')"
            className="w-full py-3 pl-12 pr-4 h-12 rounded-xl border-border bg-background text-foreground placeholder-muted-foreground focus:ring-ring focus-visible:ring-2"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.7s' }}>
        <Button asChild size="lg" className="rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:-translate-y-0.5">
          <a href="#kits">Kits DIY</a>
        </Button>
        <Button asChild size="lg" className="rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:-translate-y-0.5">
          <a href="#materials">Materiales</a>
        </Button>
        <Button asChild size="lg" className="rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:-translate-y-0.5">
          <a href="#inspiration">Inspiración</a>
        </Button>
        <Button asChild size="lg" className="rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:-translate-y-0.5">
          <a href="#new">Nuevos Productos</a>
        </Button>
        <Button asChild size="lg" className="rounded-full px-8 py-3 text-lg font-semibold transition-transform hover:-translate-y-0.5">
          <a href="#contact">Contacto</a>
        </Button>
      </div>
    </div>
  </header>
);

const Section = ({ id, title, children, className }: { id: string; title: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`py-20 px-4 text-center ${className}`}>
    <h2 className="text-4xl font-bold text-foreground mb-8 font-headline">{title}</h2>
    <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
      {children}
    </div>
  </section>
);

const Footer = () => (
    <footer className="bg-muted py-12 px-4 text-center text-muted-foreground border-t">
        <div className="max-w-4xl mx-auto">
            <p className="mb-4">&copy; 2025 CraftLab. Todos los derechos reservados.</p>
            <div className="flex justify-center space-x-6">
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300" aria-label="Facebook">
                    <Facebook />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300" aria-label="Twitter">
                    <Twitter />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-300" aria-label="Instagram">
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
        <Section id="kits" title="Nuestros Kits DIY" className="bg-muted">
          <p>Explora nuestra colección curada de kits "Hazlo Tú Mismo", perfectos para principiantes y expertos.</p>
        </Section>
        <Section id="materials" title="Materiales de Calidad Superior" className="bg-background">
          <p>Desde pinturas hasta hilos, encuentra los mejores materiales para tus proyectos más ambiciosos.</p>
        </Section>
        <Section id="inspiration" title="Inspírate y Crea" className="bg-muted">
          <p>Ideas, tutoriales y una comunidad vibrante para encender tu chispa creativa.</p>
        </Section>
        <Section id="new" title="Lo Último en Manualidades" className="bg-background">
          <p>Descubre las novedades y tendencias que están marcando el ritmo en el mundo de las manualidades.</p>
        </Section>
        <Section id="contact" title="Contáctanos" className="bg-muted">
          <p className="mb-8">¿Tienes preguntas o necesitas ayuda? Estamos aquí para asistirte.</p>
          <ContactForm />
        </Section>
      </main>
      <Footer />
    </>
  );
}
