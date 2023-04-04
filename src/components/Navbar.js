import { useNavigate, Link } from "react-router-dom";
import "./style.css";

const Navbar = () => {
  return (
    <nav className="bg-blue-600 py-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
        <Link to="/" className="text-white font-bold text-xl ml-10">
          <img src="/images/logo_similar.png" alt="Logo" className="h-16 w-auto" />
        </Link>
        <div className="hidden md:flex items-center ml-10 space-x-8">
          <div className="ml-16 flex space-x-8">
            <Link to="/about" className="text-white underline-from-center">
              About
            </Link>
            <Link to="/similar" className="text-white underline-from-center">
              Similar+
            </Link>
            <Link to="/contact" className="text-white underline-from-center">
              Contact
            </Link>
            <Link to="/download" className="text-white underline-from-center">
              Download
            </Link>
          </div>
          <div className="ml-auto">
            <Link
              to="/signup"
              className="text-blue-600 bg-white px-4 py-2 rounded-full font-semibold transition-colors duration-300 ease-in-out hover:bg-white hover:text-blue-600 hover:border-blue-600 border-2 border-transparent"
            >
              Sign up
            </Link>
          </div>
        </div>
        <button className="md:hidden text-white">
          {/* Icône de menu pour les appareils mobiles */}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
