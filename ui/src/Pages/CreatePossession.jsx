import React, { useState } from 'react'
import Button from '../Components/Button';

export default function CreatePossession() {
    const [formData, setFormData] = useState({
        libelle: '',
        valeur: '',
        dateDebut: '',
        tauxAmortissement: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await fetch('http://localhost:5000/possession/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log("Possession ajouté");
                alert('Possession ajoutée avec succès !');
            } else {
                throw new Error('Erreur lors de l\'ajout du Possession')
            };
        } catch (error) {
            console.error('Erreur:', error);
            alert(error.message);
        }
    };

    return (
        <div className="bg-white p-10 rounded-xl shadow-md max-w-lg mx-auto">
    <h1 className="text-3xl font-bold mb-6 text-center">Créer une possession</h1>
    <form className='space-y-6' onSubmit={handleSubmit}>
        <div>
            <label htmlFor="libelle" className="block text-lg font-medium text-gray-700 mb-2">Libellé :</label>
            <input 
                type="text" 
                id="libelle" 
                name="libelle" 
                value={formData.libelle} 
                onChange={handleChange} 
                required 
                className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        </div>
        <div>
            <label htmlFor="valeur" className="block text-lg font-medium text-gray-700 mb-2">Valeur :</label>
            <input 
                type="number" 
                id="valeur" 
                name="valeur" 
                value={formData.valeur} 
                onChange={handleChange} 
                required 
                className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        </div>
        <div>
            <label htmlFor="dateDebut" className="block text-lg font-medium text-gray-700 mb-2">Date de début :</label>
            <input 
                type="date" 
                id="dateDebut" 
                name="dateDebut" 
                value={formData.dateDebut} 
                onChange={handleChange} 
                required 
                className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        </div>
        <div>
            <label htmlFor="tauxAmortissement" className="block text-lg font-medium text-gray-700 mb-2">Taux d'amortissement :</label>
            <input 
                type="number" 
                id="tauxAmortissement" 
                name="tauxAmortissement" 
                value={formData.tauxAmortissement} 
                onChange={handleChange} 
                required 
                className='w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        </div>
        <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
            Créer
        </button>
    </form>
    <div className="mt-6 text-center">
        <Button print={"Retour"} target={"/possession"} />
    </div>
</div>

    )
}