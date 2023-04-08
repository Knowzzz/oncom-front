import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Modal from "react-modal";
import "aos/dist/aos.css";
import AOS from "aos";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ModalContent from "../../components/ModalContent";
import "./home.css";

function isAuthenticated() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return false;
  return false;
}

function Home({ modalIsOpen, setModalIsOpen, modalContent, setModalContent }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const toggleModal = () => {
    setModalIsOpen(!modalIsOpen);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/main");
    }
    AOS.init({
      duration: 1000,
    });
    if (location.pathname === "/cookies") {
      setModalContent("cookies");
      setModalIsOpen(true);
    } else if (location.pathname === "/confidentiality") {
      setModalContent("confidentiality");
      setModalIsOpen(true);
    } else {
      setModalContent(null);
      setModalIsOpen(false);
    }
  }, [location.pathname, setModalContent, setModalIsOpen]);

  const closeModal = () => {
    toggleModal(null);
    navigate("/");
  };

  return (
    <div className="page-container">
      <div className="rectangle">
        <Navbar />
        <div className="content-container flex flex-col md:flex-row items-center p-8">
          <div className="text-container w-full md:w-1/2">
            <h1
              className="text-white text-3xl md:text-5xl font-bold mb-4 text-left"
              data-aos="fade-left"
            >
              {t("empowering_daos")}
            </h1>
            <p
              className="text-white text-xl md:text-2xl text-left"
              data-aos="fade-left"
            >
              {t("similar_streamlines")}
            </p>
            <div className="mt-8" data-aos="fade-right">
              <Link
                to="/signup"
                className="text-blue-600 bg-white px-6 py-2 text-lg rounded-full font-semibold transition-colors duration-300 hover:bg-blue-600 hover:text-white hover:border-white border"
              >
                Start!
              </Link>
            </div>
          </div>
          <img
            className="image-container w-96 h-auto hidden md:block ml-auto mt-18"
            src="/images/dao_reu.png"
            alt="Image descriptive"
          />
        </div>
      </div>

      <div
        className="flex flex-col md:flex-row items-start my-8"
        data-aos="fade-up"
      >
        <img
          className="w-full md:w-2/6 md:ml-auto md:mr-8 mb-8 md:mb-0"
          src="/images/screen_similar1.png"
          alt="Image"
        />
        <div className="w-full md:w-3/6 pb-20 flex flex-col items-center md:items-start mt-8 md:mt-20 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            {t("web3_aspects")}
          </h2>
          <p className="text-lg text-gray-700 w-full md:w-3/6">
            {t("web3_aspects_desc")}
          </p>
        </div>
      </div>

      <div
        className="flex flex-col md:flex-row justify-center items-center my-8 bg-gray-100"
        data-aos="fade-up"
      >
        <div className="w-full md:w-3/6 flex flex-col items-center pb-20 mt-20 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-5">{t("community_aspects")}</h2>
          <p className="text-lg text-gray-700 md:w-3/6">
            {t("community_aspects_desc")}
          </p>
        </div>
        <img
          className="w-full md:w-2/6 lg:w-1.5/3 mr-20"
          src="/images/screen_similar2.png"
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-center m-20" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-5"> {t("team")} </h2>
        <p className="text-lg text-gray-700 mb-8">{t("team_desc")}</p>

        <div className="flex flex-wrap justify-center">
          <div className="flex items-center m-4">
            <div className="w-32 h-32 border-2 border-white rounded-full overflow-hidden">
              <a href="https://twitter.com/0xKnowz" target="_blank">
                <img
                  src="/images/FFF.jpg"
                  alt="Founder & Developer"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
            <div className="ml-8">
              <h3 className="text-lg font-bold">Knowz</h3>
              <p className="text-gray-500">Founder & Developer</p>
            </div>
          </div>
          <div className="flex items-center m-4">
            <div className="w-32 h-32 border-2 border-white rounded-full overflow-hidden">
              <a href="https://twitter.com/Rurubg31" target="_blank">
                <img
                  src="/images/primate.jpg"
                  alt="Founder & Designer"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
            <div className="ml-8">
              <h3 className="text-lg font-bold">SkymoZ</h3>
              <p className="text-gray-500">Founder & Designer</p>
            </div>
          </div>
          <div className="flex items-center m-4">
            <div className="w-32 h-32 border-2 border-white rounded-full overflow-hidden">
              <a href="https://twitter.com/LiBledar" target="_blank">
                <img
                  src="/images/primate.jpg"
                  alt="Founder & Designer"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>
            <div className="ml-8">
              <h3 className="text-lg font-bold">NeYkoz</h3>
              <p className="text-gray-500">Founder & Designer</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <div
          className="bg-gray-100 w-full h-screen flex items-center justify-center"
          data-aos="fade-up"
        >
          <div className="w-full md:w-1/2 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">
              {t("similar_decentralized")}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {t("similar_decentralized_desc")}
            </p>
            <img
              src="/images/screen_similar3.png"
              alt="Image descriptive"
              className="w-full md:w-90 h-auto"
            />
          </div>
        </div>
      </div>

      <div className="bg-white py-8">
        <div className="flex flex-col items-center">
          <h3 className="text-2xl font-bold mb-4"> {t("create_dao")} </h3>
          <a
            href="/signup"
            className="inline-block px-6 py-3 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
            data-aos="fade-left"
          >
            Start now!
          </a>
        </div>
      </div>

      <Footer />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="relative bg-white p-5 rounded-lg w-full max-w-md mx-auto max-h-[90%] overflow-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
        contentLabel="Confidentiality and Cookies"
      >
        <button
          onClick={closeModal}
          className="absolute top-2 right-2 bg-transparent border-none text-2xl cursor-pointer"
        >
          &times;
        </button>
        <ModalContent contentType={modalContent} />
      </Modal>
    </div>
  );
}

export default Home;
