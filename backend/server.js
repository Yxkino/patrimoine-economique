import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { readFile, writeFile } from '../data/index.js';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const getFilePath = () => {
  const fileData = fileURLToPath(import.meta.url);
  const dirname = path.dirname(fileData);
  return path.join(dirname, '../data/data.json');
};

const readData = async () => {
  const filePath = getFilePath();
  return await readFile(filePath, 'utf8');
};

const writeData = async (data) => {
  const filePath = getFilePath();
  await writeFile(filePath, data);
};

app.get('/possession', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.status === 'OK' ? data.data : { message: 'Error' });
  } catch (error) {
    res.status(500).send('Erreur lors de la lecture des données : ' + error);
  }
});

app.post('/possession/create', async (req, res) => {
  try {
    const data = await readData();
    const { libelle, valeur, dateDebut, tauxAmortissement } = req.body;
    const possesseur = data.data.possesseur;

    const newPossession = {
      possesseur,
      libelle,
      valeur: parseInt(valeur),
      dateDebut: new Date(dateDebut),
      dateFin: null,
      tauxAmortissement: parseInt(tauxAmortissement),
    };

    data.data.possessions.push(newPossession);
    await writeData({ possesseur, possessions: data.data.possessions });

    res.status(201).send('Nouvelle possession ajoutée avec succès.');
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/possession/:libelle/update', async (req, res) => {
  try {
    const data = await readData();
    const { libelle } = req.params;
    const donnes = req.body;

    const possession = data.data.possessions.find(p => p.libelle === libelle);
    if (possession) {
      possession.libelle = donnes.libelle;
      possession.dateFin = new Date(donnes.dateFin);
      await writeData(data.data);
      res.status(200).json({ message: "Update successfully" });
    } else {
      res.status(404).json({ message: "Possession non trouvée" });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'analyse du fichier JSON.' });
  }
});

app.put('/possession/:libelle/close', async (req, res) => {
  try {
    const data = await readData();
    const { libelle } = req.params;

    const possession = data.data.possessions.find(p => p.libelle === libelle);
    if (possession) {
      possession.dateFin = new Date();
      await writeData(data.data);
      res.status(200).json({ message: "Possession Closing" });
    } else {
      res.status(404).json({ message: "Possession non trouvée" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.get('/patrimoine', async (req, res) => {
  try {
    const data = await readData();
    res.status(200).json(data.status === 'OK' ? { data: data.data } : { message: 'Erreur sur la lecture de donne' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

app.delete('/possession/:libelle', async (req, res) => {
  try {
    const data = await readData();
    const { libelle } = req.params;

    const index = data.data.possessions.findIndex(p => p.libelle === libelle);
    if (index !== -1) {
      data.data.possessions.splice(index, 1);
      await writeData(data.data);
      res.status(200).json({ message: "Possession supprimée avec succès" });
    } else {
      res.status(404).json({ message: "Possession non trouvée" });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la possession', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});