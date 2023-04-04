import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Parallax } from "react-parallax";

import Navbar from "../../components/Navbar";
import "./home.css";

function isAuthenticated() {
  // Vérifiez si l'utilisateur est connecté, par exemple en vérifiant l'existence d'un accessToken
  // Pour cet exemple, nous renvoyons simplement true ou false, mais vous devez implémenter la logique d'authentification appropriée
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
  }, []);

  return (
    <div className="page-container">
      <div className="rectangle">
        <Navbar />
        <div className="content-container flex items-center p-8">
          <div className="text-container w-1/2">
            <h1 className="text-white text-5xl font-bold mb-4 text-left">
              Empowering DAOs, Uniting Communities
            </h1>
            <p className="text-white text-2xl text-left">
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

      <div className="flex items-start my-8">
        <img
          className="w-2/6 ml-auto mr-8"
          src="/images/screen_similar1.png"
          alt="Image"
        />
        <div className="w-3/6 pb-20 flex flex-col items-start mt-20">
          <h2 className="text-4xl font-bold mb-5">Web3 Aspects</h2>
          <p className="text-lg text-gray-700 w-3/6">s
            Similar is a software capable of helping you create your communities
            running hzzzebhzehzhzhzbhzbehzebzhbegnzhzbnnhezzzbhebzh
            zuhdzhgdbzhgdbuhzghhduhzbgdhzbdhzbduhzbduhzbdhgzbdughzdbbzghdbbzhy
          </p>
        </div>

        
      </div>
      <Parallax bgImage="/images/parallax.jpg" strength={500}>
      <div style={{ height: "500px" }}>
        <h1 style={{ color: "#fff" }}>Hello, World!</h1>
      </div>
    </Parallax>
    </div>
  );
}

export default Home;
