import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Schedule from "@/components/Schedule";

export const metadata = {
  title: "Schedule an Appointment",
  description: "Book your laboratory test appointment",
};

export default function BookTest() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))] py-12 px-4 max-w-3xl mx-auto">
        <Schedule />
      </div>
      <Footer />
    </>
  );
}
