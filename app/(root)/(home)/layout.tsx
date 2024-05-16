import EmiTimeProvider from "@/context/EmiTimeProvider";

const HomeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <EmiTimeProvider>{children}</EmiTimeProvider>
    </>
  );
}

export default HomeLayout;