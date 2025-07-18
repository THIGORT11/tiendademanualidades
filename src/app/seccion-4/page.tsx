import { Header, Footer, Navigation } from "@/components/layout-components";

export default function Seccion4() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-12 px-4 text-center bg-background">
          <Navigation />
        </section>
        <section className="py-20 px-4 text-center bg-card">
          <h2 className="text-4xl font-bold text-primary mb-8 font-headline">Sección 4</h2>
          <div className="text-lg text-muted-foreground max-w-2xl mx-auto">
            <p>Contenido para la sección 4.</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
