import EmiProvider from "@/context/EmiProvider";
import { Toaster } from "@/components/ui/toaster"
const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="relative h-full">
      <EmiProvider>{children}</EmiProvider>
      <Toaster />
    </main>
  );
}

export default RootLayout;