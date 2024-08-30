import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Legend, Title } from 'chart.js';
import Possession from '../../../models/possessions/Possession';
import Flux from '../../../models/possessions/Flux';
import InstancePatrimoine from '../../../models/Patrimoine.js';
import Personne from '../../../models/Personne.js'
import { useNavigate } from 'react-router-dom';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Title);

const LineChart = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const [valueDebut, setValueDebut] = useState("");
  const [dateDebut, setDateDebut] = useState("");

  const [valueFin, setValueFin] = useState("");
  const [dateFin, setDateFin] = useState("");
  
  const [valueJour, setValueJour] = useState("");
  const [jour, setJour] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setDateDebut(valueDebut);
    setDateFin(valueFin);
    setJour(valueJour);
    navigate("range");
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

  const obtenirMoisEntreDates = (dateDebut, dateFin, jour) => {
    let mois = [];
    let valeurPatrimoine = [];
    let dateActuelle = new Date(dateDebut);

    while (
      dateActuelle.getFullYear() < new Date(dateFin).getFullYear() || 
      (dateActuelle.getFullYear() === new Date(dateFin).getFullYear() && 
        (dateActuelle.getMonth() < new Date(dateFin).getMonth() ||
         (dateActuelle.getMonth() === new Date(dateFin).getMonth() && dateActuelle.getDate() <= new Date(dateFin).getDate())))
    ) {
      let dateToday = new Date(dateActuelle.getFullYear(), dateActuelle.getMonth(), jour);
      mois.push(dateToday.toLocaleString('fr-FR', { day:'numeric',month: 'numeric', year: 'numeric' }));
      valeurPatrimoine.push(patrimoine.getValeur(dateToday));

      dateActuelle.setMonth(dateActuelle.getMonth() + 1);
    }

    return {mois, valeurPatrimoine};
  }

  const value = obtenirMoisEntreDates(dateDebut, dateFin, jour); 

  const donne = {
    labels: value.mois,
    datasets: [
      {
        label: 'Patrimoine',
        data: value.valeurPatrimoine,
        fill: false,
        borderColor: 'rgb(20, 184, 166)',
        tension: 0.1,
      }
    ]
  }

  const graphColor = 'rgb(20, 184, 166)'; // Couleur teal pour le graphique

  return (
    <div className='p-8 bg-gray-100'>
      <form className='flex justify-start space-x-4 mb-8' onSubmit={handleSubmit}>
        <input type="date" className='border border-gray-300 py-2 px-4 rounded-lg bg-white' value={valueDebut} onChange={(ev) => setValueDebut(ev.target.value)} required />
        <input type="date" className='border border-gray-300 py-2 px-4 rounded-lg bg-white' value={valueFin} onChange={(ev) => setValueFin(ev.target.value)} required />
        <input type="number" className='border border-gray-300 py-2 px-4 rounded-lg w-20 bg-white' placeholder="Jour" value={valueJour} onChange={(ev) => setValueJour(ev.target.value)} required />
        <button className='bg-teal-500 hover:bg-teal-600 py-2 px-6 rounded-lg text-white transition duration-300' type='submit'>Appliquer</button>
      </form>
      
      <div className='flex space-x-8'>
        <div className='w-1/4 bg-white rounded-lg shadow-lg p-6'>
          <h2 className='text-2xl font-semibold mb-6 text-teal-700'>Détails</h2>
          <div className='space-y-4'>
            <div>
              <p className='text-sm text-gray-500'>Date début</p>
              <p className='font-medium'>{dateDebut || 'Non défini'}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Date fin</p>
              <p className='font-medium'>{dateFin || 'Non défini'}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Jour</p>
              <p className='font-medium'>{jour || 'Non défini'}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Nombre de points</p>
              <p className='font-medium'>{value.mois.length}</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Valeur initiale</p>
              <p className='font-medium'>{value.valeurPatrimoine[0]?.toFixed(2)} €</p>
            </div>
            <div>
              <p className='text-sm text-gray-500'>Valeur finale</p>
              <p className='font-medium'>{value.valeurPatrimoine[value.valeurPatrimoine.length - 1]?.toFixed(2)} €</p>
            </div>
          </div>
        </div>
        
        <div className='w-3/4 bg-white rounded-lg shadow-lg p-6' style={{height: '500px'}}>
          <Line 
            data={{
              ...donne,
              datasets: [{
                ...donne.datasets[0],
                borderColor: graphColor,
                backgroundColor: graphColor,
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                },
                title: {
                  display: true,
                  text: 'Évolution du Patrimoine',
                  font: {
                    size: 18,
                    weight: 'bold'
                  },
                  color: 'rgb(15, 118, 110)' 
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return value.toLocaleString() + ' €';
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LineChart;