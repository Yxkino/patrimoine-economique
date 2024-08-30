import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../Components/Button';

export default function Menu() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/possession');
        setData(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return <div className="text-center text-xl py-4 text-gray-600">Chargement en cours...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full">
        <h1 className="text-center text-4xl font-extrabold mb-8 text-gray-800">
          Bienvenue, {data.possesseur.nom} !
        </h1>
        <div className="flex flex-col space-y-12 w-full max-w-md"> {/* Ajusté avec max-w-md pour étirer les boutons */}
          <Button 
            print="Patrimoine" 
            target="patrimoine" 
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md" 
          />
          <Button 
            print="Possessions" 
            target="possession" 
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md" 
          />
        </div>
      </div>
    </div>
  );
}
