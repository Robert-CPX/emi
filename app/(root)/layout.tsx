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
      <EmiProvider>
        <BackgroundMusic />
        {children}
      </EmiProvider>
      <Toaster />
    </main>
  );
}

export default RootLayout;