export default async function RootLayout({
  params,
  children,
}: {
  params: { slug: string };
  children: React.ReactNode;
}) {
  const { slug } = params;

  return (
    <div>
      <h1>{slug}</h1>
      {children}
    </div>
  );
}
