import { Header, Footer, Navigation } from "@/components/layout-components";

export default function Seccion3() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-12 px-4 text-center bg-background">
          <Navigation />
        </section>
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
