import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import "./style.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useTranslation();

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="bg-blue-600 py-4">
      <div className="container mx-auto flex flex-wrap justify-between items-center px-4">
        <Link to="/" className="text-white font-bold text-xl ml-10">
          <img
            src="/images/logo_similar.png"
            alt="Logo"
            className="h-16 w-auto"
          />
        </Link>
        <div
          className={`nav-menu md:flex items-center ml-10 space-x-8 ${
            menuOpen ? "sidebar open" : "sidebar"
          }`}
        >
          <div className="ml-16 flex flex-col space-y-8 md:space-y-0 md:flex-row md:space-x-8">
            <Link to="/about" className="text-white underline-from-center">
              {t("about")}
            </Link>
            <Link to="/similar" className="text-white underline-from-center">
              Similar+
            </Link>
            <Link to="/contact" className="text-white underline-from-center">
              Contact
            </Link>
            <Link to="/download" className="text-white underline-from-center">
              {t("download")}
            </Link>
          </div>
          <div className="ml-auto mt-4 md:mt-0">
            <Link
              to="/signup"
              className="text-blue-600 bg-white px-4 py-2 rounded-full font-semibold transition-colors duration-300 ease-in-out hover:bg-white hover:text-blue-600 hover:border-blue-600 border-2 border-transparent"
            >
              {t("signup")}
            </Link>
          </div>
        </div>
        <button
          className={`md:hidden text-white ${menuOpen ? "close-icon" : ""}`}
          onClick={handleMenuClick}
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
