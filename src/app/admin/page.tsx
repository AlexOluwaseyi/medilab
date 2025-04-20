import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboards";

export const metadata = {
  title: "Dashboard",
  description: "Admin dashboard for MediLab.",
};

export default function BookTest() {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100dvh-(64px+56px))] md:min-h-[calc(100dvh-(64px+113px))] py-4 px-4 max-w-7xl mx-auto">
        <Dashboard />
      </div>
      <Footer />
    </>
  );
}
