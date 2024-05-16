import EmiTimeProvider from "@/context/EmiTimeProvider";
import BackgroundMusic from '@/components/shared/BackgroundMusic';

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <BackgroundMusic />
      <EmiTimeProvider>{children}</EmiTimeProvider>
    </>
  );
}

export default HomeLayout;