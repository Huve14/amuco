import "./globals.css";

export const metadata = {
  title: "Amuco — What does your SA smell like?",
  description: "Pick the scent that hits different.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
