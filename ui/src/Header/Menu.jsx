import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '../Components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faBuilding } from '@fortawesome/free-solid-svg-icons';

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
    <div className="min-h-screen bg-cover bg-center flex flex-col justify-center items-center" style={{backgroundImage: "url('/path/to/background-image.jpg')"}}>
      <div className="bg-white bg-opacity-90 rounded-2xl shadow-2xl p-10 max-w-4xl w-full">
        <h1 className="text-center text-4xl font-extrabold mb-8 text-gray-800">
          Bienvenue, {data.possesseur.nom} !
        </h1>
        <div className="flex justify-center space-x-8">
          <div className="flex flex-col items-center">
            <div className="w-72 h-72 mb-4 flex items-center justify-center bg-blue-100 rounded-2xl shadow-lg">
              <FontAwesomeIcon icon={faHome} className="text-8xl text-blue-500" />
            </div>
            <Button 
              print="Patrimoine" 
              target="patrimoine" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md text-lg" 
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="w-72 h-72 mb-4 flex items-center justify-center bg-green-100 rounded-2xl shadow-lg">
              <FontAwesomeIcon icon={faBuilding} className="text-8xl text-green-500" />
            </div>
            <Button 
              print="Possessions" 
              target="possession" 
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 shadow-md text-lg" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}