"use client";
import { useState } from "react";
import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

export default function LayoutHome() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-gray-600 text-xl font-bold">
          Klaus Medeiros Nascimento
        </h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          ☰
        </button>
        <ul className={`md:flex space-x-6 ${menuOpen ? "block" : "hidden"}`}>
          <li>
            <a href="#about" className="text-gray-600 hover:text-blue-500 ">
              Sobre Mim
            </a>
          </li>
          <li>
            <a href="#experience" className="text-gray-600 hover:text-blue-500">
              Experiência
            </a>
          </li>
          <li>
            <a href="#skills" className="text-gray-600 hover:text-blue-500">
              Habilidades
            </a>
          </li>
          <li>
            <a href="#education" className="text-gray-600 hover:text-blue-500">
              Educação
            </a>
          </li>
          <li>
            <a href="#contact" className="text-gray-600 hover:text-blue-500">
              Contato
            </a>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20 bg-blue-500 text-white">
        <h2 className="text-4xl font-bold">Desenvolvedor Full-Stack</h2>
        <p className="mt-4">
          Especialista em Web, Arquitetura de Software e DevOps
        </p>
      </header>

      {/* Seções */}
      <section
        id="about"
        className="p-10 bg-white shadow-md rounded-lg max-w-3xl mx-auto my-10"
      >
        <h3 className="text-gray-600 text-2xl font-semibold">Sobre Mim</h3>
        <p className="mt-2 text-gray-600">
          Desenvolvedor Full-Stack com ampla experiência...
        </p>
      </section>

      <section
        id="experience"
        className="p-10 bg-white shadow-md rounded-lg max-w-3xl mx-auto my-10"
      >
        <h3 className="text-gray-600 text-2xl font-semibold">
          Experiência Profissional
        </h3>
        <ul className="mt-2 text-gray-600">
          <li>⚡ Tribunal de Contas - Dez 2023 - Presente</li>
          <li>⚡ Ministério Público - Ago 2018 - Dez 2022</li>
          <li>
            ⚡ Instituto de Administração Penitenciária - Abr 2011 - Ago 2018
          </li>
        </ul>
      </section>

      <section
        id="skills"
        className="p-10 bg-white shadow-md rounded-lg max-w-3xl mx-auto my-10"
      >
        <h3 className="text-gray-600 text-2xl font-semibold">Habilidades</h3>
        <p className="mt-2 text-gray-600">
          React, Angular, Vue.js, Next.js, NestJS, Docker, SQL, NoSQL...
        </p>
      </section>

      <section
        id="education"
        className="p-10 bg-white shadow-md rounded-lg max-w-3xl mx-auto my-10"
      >
        <h3 className="text-gray-600 text-2xl font-semibold">Educação</h3>
        <ul className="mt-2 text-gray-600">
          <li>🎓 Pós-Graduação - FACULDADE META (2011)</li>
          <li>🎓 Graduação - FACULDADE ESTÁCIO SEAMA (2005)</li>
          <li>🎓 Rocketseat - DigitalHouse - Company (2024 - 2025)</li>
        </ul>
      </section>

      {/* Contato */}
      <footer id="contact" className="bg-gray-900 text-white text-center p-6">
        <h3 className="text-xl font-semibold">Contato</h3>
        <div className="flex justify-center space-x-6 mt-2">
          <a
            href="mailto:klausnascimento@gmail.com"
            className="hover:text-blue-400"
          >
            <FaEnvelope />
          </a>
          <a href="tel:+559681214909" className="hover:text-blue-400">
            <FaPhone />
          </a>
          <a href="#" className="hover:text-blue-400">
            <FaGithub />
          </a>
          <a href="#" className="hover:text-blue-400">
            <FaLinkedin />
          </a>
        </div>
      </footer>
    </div>
  );
}
