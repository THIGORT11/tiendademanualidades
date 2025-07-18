import { Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";

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

export default function Seccion3() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-20 px-4 text-center bg-background">
          <h2 className="text-4xl font-bold text-primary mb-8 font-headline">Sección 3</h2>
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <p>Contenido para la sección 3.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
