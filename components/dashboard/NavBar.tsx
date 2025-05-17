import { useState } from "react";
import { MenuTop } from "./MenuTop";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <h1 className="text-gray-600 text-xl font-bold">
          Klaus Medeiros Nascimento
        </h1>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          ☰
        </button>
        <ul className={`md:flex space-x-6 ${menuOpen ? "block" : "hidden"}`}>
          <li>
            <MenuTop />
          </li>
        </ul>
      </nav>
    </>
  );
}
