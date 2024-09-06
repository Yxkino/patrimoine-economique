import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Possession from '../../../models/possessions/Possession.js';
import Flux from '../../../models/possessions/Flux.js';

export default function ListPossession() {
    const { libelle } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);

    // Effect to close possession if a `libelle` is provided
    useEffect(() => {
        async function closePossession() {
            if (libelle) {
                try {
                    let response = await fetch(`http://localhost:5000/possession/${libelle}/close`, {
                        method: 'PUT',
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Réponse serveur : ", data);
                        navigate('/possession');
                    } else {
                        const data = await response.json();
                        console.log("Erreur : ", data);
                    }
                } catch (error) {
                    console.error("Erreur sur le transfert de données :", error);
                }
            }
        }

        closePossession();
    }, [libelle, navigate]);

    // Effect to fetch data from the API
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

    // Handler to close a possession
    const handleClose = async (libelle) => {
        if (window.confirm("Êtes-vous sûr de vouloir clôturer cette possession ?")) {
            try {
                const response = await axios.put(`http://localhost:5000/possession/${libelle}/close`);
                if (response.status === 200) {
                    setData(prevData => ({
                        ...prevData,
                        possessions: prevData.possessions.map(p => 
                            p.libelle === libelle ? { ...p, closed: true } : p
                        )
                    }));
                    console.log("Possession clôturée avec succès");
                } else {
                    console.error("Erreur lors de la clôture : ", response.data);
                }
            } catch (error) {
                console.error("Erreur lors de la clôture de la possession:", error);
            }
        }
    };

    // Render loading state if no data is available
    if (!data) {
        return <div>Aucune donnée trouvée</div>;
    }

    // Process possessions and flux
    const LesPossessions = data.possessions.filter(element => element.valeur !== 0);
    const newPossession = LesPossessions.map(element => new Possession(
        element.possesseur, 
        element.libelle, 
        element.valeur, 
        new Date(element.dateDebut), 
        element.dateFin === null ? "..." : new Date(element.dateFin), 
        element.tauxAmortissement
    ));
    const LesFlux = data.possessions.filter(element => element.valeur == 0);
    const newFlux = LesFlux.map(element => new Flux(
        element.possesseur, 
        element.libelle, 
        element.valeurConstante, 
        new Date(element.dateDebut), 
        element.dateFin === null ? "..." : new Date(element.dateFin), 
        element.tauxAmortissement, 
        element.jour
    ));
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
            
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="py-3 px-4 border-b text-left">Libelle</th>
                        <th className="py-3 px-4 border-b text-left">Valeur</th>
                        <th className="py-3 px-4 border-b text-left">Début</th>
                        <th className="py-3 px-4 border-b text-left">Fin</th>
                        <th className="py-3 px-4 border-b text-left">Taux d'amortissement</th>
                        <th className="py-3 px-4 border-b text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {possessions.map((possession, index) => (
                        <tr key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                            <td className="py-2 px-4 border-b">{possession.libelle}</td>
                            <td className="py-2 px-4 border-b">{Math.abs(possession.valeur) || Math.abs(possession.valeurConstante)} €</td>
                            <td className="py-2 px-4 border-b">{new Date(possession.dateDebut).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">{possession.dateFin === "..." ? "En cours" : new Date(possession.dateFin).toLocaleDateString()}</td>
                            <td className="py-2 px-4 border-b">{possession.tauxAmortissement !== null ? `${possession.tauxAmortissement}%` : '0%'}</td>
                            <td className="py-2 px-4 border-b">
                                <Link to={`/possession/${possession.libelle}/update`} className="text-blue-600 hover:text-blue-800">
                                    <i className="fa-solid fa-pen-to-square mr-2"></i>Modifier
                                </Link>
                                <button 
                                    onClick={() => handleClose(possession.libelle)} 
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <i className="fa-solid fa-lock mr-2"></i>Clôturer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
