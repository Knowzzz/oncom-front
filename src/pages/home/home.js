import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'aos/dist/aos.css';
import AOS from 'aos';


import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "./home.css";

function isAuthenticated() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) return false;
  return false;
}

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/main");
    }
    AOS.init({
      duration: 1000,
    });
  }, []);

  return (
    <div className="page-container">
      <div className="rectangle">
        <Navbar />
        <div className="content-container flex flex-col md:flex-row items-center p-8">
          <div className="text-container w-full md:w-1/2">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 text-left">
              Empowering DAOs, Uniting Communities
            </h1>
            <p className="text-white text-xl md:text-2xl text-left">
              Similar streamlines DAO governance and collaboration. Discover the
              platform that brings communities together, driving projects
              forward.
            </p>
            <div className="mt-8">
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

      <div className="flex flex-col md:flex-row items-start my-8  md:justify-center " data-aos="fade-up" >
        <img
          className="w-full md:w-2/6 md:ml-auto md:mr-8 mb-8 md:mb-0"
          src="/images/screen_similar1.png"
          alt="Image"
        />
        <div className="w-full md:w-3/6 pb-20 flex flex-col items-start mt-8 md:mt-20 md:items-center md:mb-0">
          <h2 className="text-3xl md:text-4xl font-bold mb-5 md:items-center">Web3 Aspects</h2>
          <p className="text-lg text-gray-700 w-full md:w-3/6">
            Experience seamless DAO integration with Similar's cutting-edge Web3
            features. From secure transactions to NFT minting and on-chain
            governance, our platform is designed to empower your decentralized
            organization. Unlock the potential of your DAO with a user-friendly
            interface and comprehensive tools tailored for the Web3 ecosystem.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center my-8 bg-gray-100" data-aos="fade-up">
        <div className="w-full md:w-3/6 flex flex-col items-center pb-20 mt-20">
          <h2 className="text-4xl font-bold mb-5">
            Community Aspects
          </h2>
          <p className="text-lg text-gray-700 md:w-3/6">
            Foster meaningful connections and collaboration with Similar's
            comprehensive community tools. Create customizable DAO servers,
            establish roles, and engage in private messaging to drive your
            project towards success. Leverage our robust tagging system and
            access controls to build a thriving community around your Web3
            project.
          </p>
        </div>
        <img
          className="w-full md:w-2/6 lg:w-1.5/3 mr-20"
          src="/images/screen_similar2.png"
          alt="Image"
        />
      </div>
      <div className="flex flex-col items-center m-20" data-aos="fade-up">
        <h2 className="text-4xl font-bold mb-5">The Team</h2>
        <p className="text-lg text-gray-700 mb-8">
          Meet the team behind our vision, dedicated to empowering communities
          and driving innovation forward
        </p>

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
        <div className="bg-gray-100 w-screen h-screen flex items-center justify-center" data-aos="fade-up">
          <div className="w-full md:w-1/2 rounded-lg p-8">
            <h2 className="text-3xl font-bold mb-4">
              Decentralized governance with Similar
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Similar is a decentralized governance platform that allows
              communities to communities to collaborate and make decisions in a
              transparent seamlessly. Discover now an innovative solution for
              collaborative projects.
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
          <h3 className="text-2xl font-bold mb-4">Create your DAO now!</h3>
          <a
            href="/signup"
            className="inline-block px-6 py-3 font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors duration-300"
          >
            Start now!
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
