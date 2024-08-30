import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom'

import Possession from '../../../models/possessions/Possession.js';
import Flux from '../../../models/possessions/Flux.js';

export default function ListPossession() {
    const { libelle } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    useEffect(() => {
        async function closePossession() {
            try {
                let response = await fetch(`http://localhost:5000/possession/${libelle}/close`, {
                    method: 'PUT',
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Réponse serveur : ", data);
                    navigate('/possession');
                } else {
                    const data = await response.json()
                    console.log("Erreur : ", data);
                }
            } catch (error) {
                console.error("Erreur sur le transfert de données :", error);
            }
        }

        if (libelle) {
            closePossession();
        }
    }, [libelle, navigate]);

    useEffect(() => {
        async function getData() {
            try {
                const response = await axios.get('http://localhost:5000/possession');
                setData(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des données:", error);
            }
        }
        getData();
    }, []);

    const handleDelete = async (libelle) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette possession ?")) {
            try {
                const response = await axios.delete(`http://localhost:5000/possession/${libelle}`);
                if (response.status === 200) {
                    setData(prevData => ({
                        ...prevData,
                        possessions: prevData.possessions.filter(p => p.libelle !== libelle)
                    }));
                    console.log("Possession supprimée avec succès");
                }
            } catch (error) {
                console.error("Erreur lors de la suppression de la possession:", error);
            }
        }
    };

    if (!data) {
        return <div>Aucune donnée trouvée</div>;
    }

    const LesPossessions = data.possessions.filter(element => element.valeur !== 0);
    const newPossession = LesPossessions.map(element => new Possession(element.possesseur, element.libelle, element.valeur, new Date(element.dateDebut), element.dateFin === null ? "..." : new Date(element.dateFin), element.tauxAmortissement));
    const LesFlux = data.possessions.filter(element => element.valeur == 0);
    const newFlux = LesFlux.map(element => new Flux(element.possesseur, element.libelle, element.valeurConstante, new Date(element.dateDebut), element.dateFin === null ? "..." : new Date(element.dateFin), element.tauxAmortissement, element.jour));
    const possessions = newPossession.concat(newFlux);

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <div className="flex justify-between items-center mb-10">
                <h1 className='text-4xl font-bold text-gray-800'>Possessions de {data.possesseur.nom}</h1>
                <div className="space-x-4">
                    <Link to="/create-possession" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
                        Menu
                    </Link>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {possessions.map((possession, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        <div className="bg-blue-600 text-white p-4">
                            <h2 className="text-xl font-semibold">{possession.libelle}</h2>
                        </div>
                        <div className="p-6">
                            <p className="text-2xl font-bold text-gray-800 mb-4">
                                {Math.abs(possession.valeur) || Math.abs(possession.valeurConstante)} €
                            </p>
                            <div className="space-y-2 text-sm text-gray-600">
                                <p>Début : {new Date(possession.dateDebut).toLocaleDateString()}</p>
                                <p>Fin : {possession.dateFin === "..." ? "En cours" : new Date(possession.dateFin).toLocaleDateString()}</p>
                                <p>Taux d'amortissement : {possession.tauxAmortissement !== null ? `${possession.tauxAmortissement}%` : '0%'}</p>
                                <p className="text-lg font-semibold text-gray-800 mt-4">
                                    Valeur actuelle : {possession.getValeur(new Date()).toFixed(0)} €
                                </p>
                            </div>
                            <div className="mt-6 flex justify-end space-x-4">
                                <Link to={`:${possession.libelle}/update`} className="text-blue-600 hover:text-blue-800">
                                    <i className="fa-solid fa-pen-to-square mr-2"></i>Modifier
                                </Link>
                                <button 
                                    onClick={() => handleDelete(possession.libelle)} 
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <i className="fa-regular fa-circle-xmark mr-2"></i>Supprimer
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}