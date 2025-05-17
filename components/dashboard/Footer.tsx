import { FaGithub, FaLinkedin, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Footer() {
  return (
    <>
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
    </>
  );
}
