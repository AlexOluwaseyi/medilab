import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Doctors from "@/components/Doctors";

export const metadata = {
  title: "Doctors",
  description: "Manage doctors.",
};

export default function BookTest() {
  return (
    <>
      <Header />
      <Doctors />
      <Footer />
    </>
  );
}
