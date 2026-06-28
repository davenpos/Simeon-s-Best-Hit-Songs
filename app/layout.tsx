import '@/assets/global.css';

export const metadata = {
  title: "Simeon's Best Hit Songs",
  description: 'A list of my favorite Billboard Year-End Hot 100 hits',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="text-red-300">{children}</body>
    </html>
  );
}
