import "./globals.css";

export const metadata = {
  title: "Amuco 600 — Capture the Vibe",
  description: "Pick the scent that hits different.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="cache-control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="pragma" content="no-cache" />
        <meta httpEquiv="expires" content="0" />
        {/* Auto-correct browser zoom so the page always fills the screen */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var zoom = window.outerWidth / window.innerWidth;
              if (zoom && zoom < 0.98) {
                document.documentElement.style.zoom = zoom;
              }
            } catch(e) {}
          })();
        `}} />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,700;0,800;1,800&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
