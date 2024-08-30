import React, { useEffect, useState } from 'react';
import LineChart from '../Pages/LineChart';
import Possession from '../../../models/possessions/Possession';
import Flux from '../../../models/possessions/Flux';
import InstancePatrimoine from '../../../models/Patrimoine.js';
import Personne from '../../../models/Personne.js';
import { useNavigate } from 'react-router-dom';
import Button from '../Components/Button.jsx';

export default function Patrimoine() {
  const [data, setData] = useState(null);
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  function handleDate(event) {
    event.preventDefault();
    setValue("");
    setDate(value);
    navigate(`:${value}`);
  }

  useEffect(() => {
    async function getData() {
      try {
        let reponse = await fetch('http://localhost:5000/patrimoine', { method: 'GET' });

        if (reponse.ok) {
          const data = await reponse.json();
          setData(data.data);
        } else {
          console.log("Erreur : ", reponse);
        }
      } catch (error) {
        console.log(error);
      }
    }
    getData();
  }, []);

  if (!data) {
    return <div>Aucune donnée trouvée</div>;
  }

  const LesPossessions = data.possessions.filter(element => element.valeur !== 0);
  const newPossession = LesPossessions.map(element => new Possession(element.possesseur, element.libelle, element.valeur, new Date(element.dateDebut), element.dateFin === null ? "..." : new Date(element.dateFin), element.tauxAmortissement));
  const LesFlux = data.possessions.filter(element => element.valeur == 0);
  const newFlux = LesFlux.map(element => new Flux(element.possesseur, element.libelle, element.valeurConstante, new Date(element.dateDebut), element.dateFin === null ? "..." : new Date(element.dateFin), element.tauxAmortissement, element.jour));
  const possessions = newPossession.concat(newFlux);

  const personne = new Personne(data.possesseur.nom);
  const patrimoine = new InstancePatrimoine(personne, possessions);

  return (
    <>
      <div className='bg-gradient-to-r from-blue-500 to-purple-500 p-8 rounded-xl shadow-md'>
        <LineChart />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>
        <form onSubmit={handleDate} className="bg-white p-8 rounded-xl shadow-lg">
          <h1 className='text-2xl font-semibold mb-4'>Sélectionner la date :</h1>
          <input 
            type="date" 
            onChange={(event) => setValue(event.target.value)} 
            value={value} 
            className='border border-gray-300 py-2 px-4 rounded-lg mb-4 w-full focus:outline-none focus:border-blue-600 transition duration-300 ease-in-out' 
          />
          <button 
            className='bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105' 
            type='submit'>
            Valider
          </button>
          <p className='text-xl mt-6'>
            La valeur du patrimoine est :
            <span className='font-bold text-2xl text-blue-700 ml-2'>
              {patrimoine.getValeur(new Date(date)).toFixed(0)}
            </span>
          </p>
        </form>
        <div className='flex items-center justify-center'>
          <Button target={"/"} print={"Menu"} />
        </div>
      </div>
    </>
  );
}
