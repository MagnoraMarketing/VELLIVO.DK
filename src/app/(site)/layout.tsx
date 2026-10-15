import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="indhold" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
