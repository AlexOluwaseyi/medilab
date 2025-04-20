import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TestDetails from "@/components/TestDetails";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return (
    <>
      <Header />
      <TestDetails id={id} />
      <Footer />
    </>
  );
};
export default Page;
