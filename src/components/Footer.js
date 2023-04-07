import React, { useState } from "react";
import { FaTwitter, FaGithub, FaEthereum } from "react-icons/fa";
import { US, FR, ES } from "country-flag-icons/react/3x2";
import Select from "react-select";

const Footer = () => {
  const languageOptions = [
    {
      value: "en",
      label: (
        <>
          <US title="English" className="w-6 h-4 inline mr-2" />
          English
        </>
      ),
    },
    {
      value: "fr",
      label: (
        <>
          <FR title="Français" className="w-6 h-4 inline mr-2" />
          Français
        </>
      ),
    },
    {
      value: "es",
      label: (
        <>
          <ES title="Español" className="w-6 h-4 inline mr-2" />
          Español
        </>
      ),
    },
  ];

  const [selectedOption, setSelectedOption] = useState(languageOptions[0]);

  const handleLanguageChange = (option) => {
    setSelectedOption(option);
  };

  return (
    <footer className="bg-[#213B74] text-white py-6 px-8">
      <div className="container mx-auto flex flex-col md:flex-row items-start justify-around">
        <div className="flex flex-col mb-6 md:mb-0">
          <h2 className="text-3xl mb-3">Similar</h2>
          <Select
      value={selectedOption}
      onChange={handleLanguageChange}
      options={languageOptions}
      className="text-black"
      styles={{
        control: (provided) => ({
          ...provided,
          backgroundColor: "#213B74",
          borderColor: "#213B74",
          minHeight: "48px",
          borderRadius: "4px",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "white",
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 1000,
          marginTop: 0,
          backgroundColor: "#213B74",
        }),
        menuList: (provided) => ({
          ...provided,
          paddingTop: 0,
          paddingBottom: "1rem",
          backgroundColor: "#213B74",
        }),
        option: (provided, state) => ({
          ...provided,
          color: state.isSelected || state.isFocused ? "black" : "white",
          backgroundColor: state.isFocused ? "#5360A6" : "#213B74",
        }),
      }}
      menuPlacement="top"
    />

          <div className="flex mt-4 space-x-4">
            <FaTwitter />
            <FaEthereum />
            <FaGithub />
          </div>
        </div>

        <div className="flex flex-col mb-6 md:mb-0">
          <h3 className="text-xl mb-3 font-bold">Entreprise</h3>
          <ul>
            <li>
              <a href="/about" className="block mb-2">
                About
              </a>
            </li>
            <li>
              <a href="/help" className="block">
                Help
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col mb-6 md:mb-0">
          <h3 className="text-xl mb-3 font-bold">Charters</h3>
          <ul>
            <li>
              <a href="/confidentiality" className="block mb-2">
                Confidentiality
              </a>
            </li>
            <li>
              <a href="/conditions" className="block mb-2">
                Conditions
              </a>
            </li>
            <li>
              <a href="/cookies" className="block">
                Cookies
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col mb-6 md:mb-0">
          <h3 className="text-xl mb-3 font-bold">Produces</h3>
          <ul>
            <li>
              <a href="/download" className="block mb-2">
                Download
              </a>
            </li>
            <li>
              <a href="/similar-plus" className="block">
                Similar+
              </a>
            </li>
          </ul>
        </div>
        <div className="mt-4 flex flex-col">
          <img
            src="/images/logo_similar.png"
            alt="Similar logo"
            className="w-28"
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
