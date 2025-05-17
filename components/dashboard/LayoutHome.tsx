"use client";
import Sobre from "./Sobre";
import Experiencia from "./Experiencia";
import Habilidades from "./Habilidades";
import Educacao from "./Educacao";
import NavBar from "./NavBar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";

export default function LayoutHome() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <HeroSection />
      <Sobre />
      <Experiencia />
      <Habilidades />
      <Educacao />
      <Footer />
    </div>
  );
}
