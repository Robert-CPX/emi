import EmiProvider from "@/context/EmiProvider";
import { Toaster } from "@/components/ui/toaster"
import BackgroundMusic from '@/components/shared/sound/BackgroundMusic';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="relative h-full">
      <BackgroundMusic />
      <EmiProvider>{children}</EmiProvider>
      <Toaster />
    </main>
  );
}

export default RootLayout;