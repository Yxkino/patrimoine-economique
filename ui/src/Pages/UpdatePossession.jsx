import React, { useState } from 'react'
import Button from '../Components/Button'
import { useParams } from 'react-router-dom'
// import axios from 'axios';

export default function UpdatePossession() {
  const { libelle } = useParams();

  let vide = "";

  const libellePrev = libelle.split('').slice(1, libelle.length);
  for (let index = 0; index < libellePrev.length; index++) {
    const element = libellePrev[index];
    vide += element;
  }

  const [newData, setNewData] = useState({
    "libelle": "",
    "dateFin": "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response = await fetch(`http://localhost:5000/possession/${libelle}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Réponse du serveur:', data);
        alert("Possession update successfully")
      } else {
        throw new Error(`Erreur HTTP! statut: ${response}`);
      }
    } catch (error) {
      console.error('Il y a eu une erreur lors de la mise à jour:', error);
      alert("Erreur, Veuiller ressayer");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
  <h1 className="text-3xl font-bold mb-6">Mettre à jour la possession</h1>
  <form className="space-y-6" onSubmit={handleSubmit}>
    <div>
      <label htmlFor="libelle" className="block text-sm font-medium text-gray-700 mb-1">
        Libellé :
      </label>
      <input
        type="text"
        id="libelle"
        name="libelle"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        placeholder={vide}
        value={newData.libelle}
        onChange={handleChange}
        required
      />
    </div>
    <div>
      <label htmlFor="dateFin" className="block text-sm font-medium text-gray-700 mb-1">
        Date de fin :
      </label>
      <input
        type="date"
        id="dateFin"
        name="dateFin"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        value={newData.dateFin}
        onChange={handleChange}
        required
      />
    </div>
    <div className="flex items-center justify-between">
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Mettre à jour
      </button>
      <Button print="Retour" target="/possession" className="text-blue-600 hover:text-blue-800" />
    </div>
  </form>
</div>
  )
}