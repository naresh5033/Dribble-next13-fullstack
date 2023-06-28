import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Flexibble",
  description: "Showcase and discover remarkable developer projects",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <Navbar />
        <main>
          {/* this children represent the page.tsx and its a good practise to wrap the child in the main tag */}
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
