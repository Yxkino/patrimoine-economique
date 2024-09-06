import React, { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form } from 'react-bootstrap';

const TableauPatrimoine = () => {
    const [patrimoines, setPatrimoines] = useState([]);
    const [dateFin, setDateFin] = useState({});
    const [valeursTotales, setValeursTotales] = useState({});

    useEffect(() => {
        fetch('/data.json')
            .then(response => {
                if (!response.ok) throw new Error('Erreur Application');
                return response.json();
            })
            .then(data => setPatrimoines(data.filter(objet => objet.model === "Patrimoine")))
            .catch(error => console.error("Fetch error", error));
    }, []);

    const handleDateChange = (event, index) => {
        setDateFin(prev => ({ ...prev, [index]: event.target.value }));
    };

    const handleSubmit = (index) => {
        const date = new Date(dateFin[index]);
        if (isNaN(date.getTime())) {
            alert("Date valide uniquement");
            return;
        }

        const total = patrimoines[index].data.possessions.reduce((sum, possession) => {
            const dateDebut = new Date(possession.dateDebut);
            const valeurActuelle = possession.valeur - (date - dateDebut) * (possession.tauxAmortissement || 0) / (100 * 365 * 24 * 60 * 60 * 1000);
            return sum + valeurActuelle;
        }, 0);

        setValeursTotales(prev => ({ ...prev, [index]: total }));
    };

    return (
        <div>
            {patrimoines.map((patrimoine, index) => (
                <div key={index} className="mt-4">
                    <h2 className="mb-7">{patrimoine.data.possesseur.nom}</h2>
                    <Table responsive bordered hover className='tableau_patrimoine'>
                        <thead>
                            <tr>
                                <th>libelle</th>
                                <th>valeur initiale</th>
                                <th>Date de Début</th>
                                <th>Taux de l'amortissement</th>
                                <th>Jour</th>
                                <th>Valeur Constante</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patrimoine.data.possessions.map((possession, possessionIndex) => (
                                <tr key={possessionIndex}>
                                    <td>{possession.libelle}</td>
                                    <td>{possession.valeur} MGA</td>
                                    <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                                    <td>{possession.tauxAmortissement ?? '0'}%</td>
                                    <td>{possession.jour ?? '0'}</td>
                                    <td>{Math.abs(possession.valeurConstante ?? 0)} MGA</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className='fw-bold'>Date fin</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateFin[index] || ''}
                                className='w-25 border border-black'
                                onChange={(e) => handleDateChange(e, index)}
                            />
                        </Form.Group>
                        <Button variant="success" onClick={() => handleSubmit(index)}>Valeur finale</Button>
                    </Form>
                    {valeursTotales[index] !== undefined && (
                        <div className="mt-4 d-flex justify-content-center align-items-center">
                            <h4 className='text-center valeur_retour fs-5'>Valeur Totale du patrimoine de {patrimoine.data.possesseur.nom} : {valeursTotales[index].toFixed(2)} MGA</h4>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default TableauPatrimoine;