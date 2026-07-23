import '@/public/global.css';

export const metadata = {
  title: "Simeon's Best Hit Songs",
  description: 'A list of my favorite Billboard Year-End Hot 100 hits',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="Norbert.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-linear-to-b from-lime-600 via-lime-500 to-lime-700 text-white antialiased">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
      </body>
    </html>
  );
}
