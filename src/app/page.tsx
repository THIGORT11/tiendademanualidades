
import { Header, Footer, Navigation } from "@/components/layout-components";
import type { Metadata } from "next";
import { storeConfig } from "@/content/store";

export const metadata: Metadata = {
  title: storeConfig.metadata.home.title,
  description: storeConfig.metadata.home.description,
  openGraph: {
    title: storeConfig.metadata.home.socialTitle,
    description: storeConfig.metadata.home.socialDescription,
    images: [{ url: storeConfig.metadata.home.socialImageUrl }],
  },
  twitter: {
    card: "summary_large_image",
    title: storeConfig.metadata.home.socialTitle,
    description: storeConfig.metadata.home.socialDescription,
    images: [storeConfig.metadata.home.socialImageUrl],
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
