import Appointments from "@/components/Appointments";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata = {
  title: "Appointments",
  description: "Manage appointments.",
};

export default function BookTest() {
  return (
    <>
      <Header />
      <Appointments />
      <Footer />
    </>
  );
}
