import React, { useState } from "react";

const InformationsGenerales = () => {
  const [infos, setInfos] = useState({
    etablissement: "YKA Académie",
    classe: "4e B",
    trimestre: "1",
    eleves: 20,
    presents: 18,
    retards: 1,
    absents: 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfos((prev) => ({
      ...prev,
      [name]: name === "eleves" || name === "presents" || name === "retards" || name === "absents"
        ? parseInt(value)
        : value,
    }));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="text-sm text-gray-500">Établissement</label>
        <input
          type="text"
          name="etablissement"
          value={infos.etablissement}
          onChange={handleChange}
          className="w-full mt-1 text-center border-b border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="text-sm text-gray-500">Classe</label>
        <select
          name="classe"
          value={infos.classe}
          onChange={handleChange}
          className="w-full mt-1 text-center border-b border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="6e A">6e A</option>
          <option value="6e B">6e B</option>
          <option value="5e A">5e A</option>
          <option value="4e B">4e B</option>
          <option value="3e">3e</option>
        </select>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="text-sm text-gray-500">Trimestre</label>
        <select
          name="trimestre"
          value={infos.trimestre}
          onChange={handleChange}
          className="w-full mt-1 text-center border-b border-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="1">Trimestre 1</option>
          <option value="2">Trimestre 2</option>
          <option value="3">Trimestre 3</option>
        </select>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="text-sm text-gray-500">Élèves</label>
        <input
          type="number"
          name="eleves"
          value={infos.eleves}
          onChange={handleChange}
          className="w-full mt-1 text-center border-b border-gray-300 focus:outline-none focus:border-blue-500"
        />
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <label className="text-sm text-gray-500">Présents / Retards / Absents</label>
        <div className="flex justify-center items-center gap-2 mt-1">
          <input
            type="number"
            name="presents"
            value={infos.presents}
            onChange={handleChange}
            className="w-1/3 text-center border-b border-gray-300 focus:outline-none focus:border-green-500"
          />
          <input
            type="number"
            name="retards"
            value={infos.retards}
            onChange={handleChange}
            className="w-1/3 text-center border-b border-gray-300 focus:outline-none focus:border-yellow-500"
          />
          <input
            type="number"
            name="absents"
            value={infos.absents}
            onChange={handleChange}
            className="w-1/3 text-center border-b border-gray-300 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default InformationsGenerales;
