import "./globals.css";

export const metadata = {
  title: "CausalFunnel Analytics",
  description: "Session tracking and user behavior analytics dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}