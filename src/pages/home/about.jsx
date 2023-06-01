// Importations
import React from "react";
import { motion } from "framer-motion";
import {
  FaReact,
  FaUsers,
  FaRocket,
  FaRegLightbulb,
  FaMobileAlt,
  FaCode,
} from "react-icons/fa";
import Navbar from "../../components/Navbar";
import ProgressBar from "react-scroll-progress-bar";

// Composants individuels pour chaque section
const sections = [
  {
    Icon: FaReact,
    text: "Nous utilisons React pour construire des applications web modernes. Notre équipe est composée de développeurs experts qui sont passionnés par la création de produits de qualité. Nous travaillons constamment à l'amélioration de nos compétences et de nos connaissances pour rester à la pointe de la technologie.",
  },
  {
    Icon: FaUsers,
    text: "Notre équipe est composée de développeurs experts qui sont passionnés par la création de produits de qualité. Nous valorisons la collaboration et l'esprit d'équipe, car nous croyons que c'est la clé pour créer des produits exceptionnels.",
  },
  {
    Icon: FaRocket,
    text: "Nous nous efforçons de créer des applications ultra-rapides pour un web moderne. Nous croyons en l'importance de la performance et de l'optimisation pour offrir la meilleure expérience utilisateur possible.",
  },
  {
    Icon: FaRegLightbulb,
    text: "Nous innovons constamment et cherchons à repousser les limites de ce qui est possible. Nous sommes toujours à la recherche de nouvelles idées et de nouvelles approches pour résoudre les problèmes de manière créative.",
  },
  {
    Icon: FaMobileAlt,
    text: "Nous créons également des applications mobiles impressionnantes avec React Native. Nous nous efforçons de créer des applications qui sont non seulement fonctionnelles, mais aussi belles et agréables à utiliser.",
  },
  {
    Icon: FaCode,
    text: "Notre code est propre, maintenable et optimisé pour les performances. Nous prenons soin de notre code comme si c'était notre propre maison - en le gardant propre, organisé et libre de bugs.",
  },
];

const Section = ({ Icon, text, index }) => (
  <motion.div
    className="w-full sm:w-full md:w-1/2 lg:w-1/3 p-8 bg-zinc-600 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-500 m-4 sm:m-4 md:m-6 lg:m-8"
    initial={{ y: -50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: 0.2 + index * 0.2 }}
  >
    <Icon className="text-4xl mb-4" />
    <p className="text-lg sm:text-xl md:text-xl lg:text-xl">{text}</p>{" "}
  </motion.div>
);

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-zinc-800 text-white flex flex-col items-center justify-center overflow-auto">
      {" "}
      <Navbar />
      <ProgressBar color="#ED8936" height="5px" />
      <motion.div
        className="w-full bg-zinc-900 p-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 self-center text-white text-center p-16">
          About
        </motion.h1>
      </motion.div>
      <div className="w-full p-4 sm:p-8 md:p-12 lg:p-32">
        {" "}
        {sections.map((section, index) => (
          <Section key={index} {...section} index={index} />
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
