import fs from 'node:fs/promises';

async function readFile(path) {
  try {
    const data = await fs.readFile(path, { encoding: 'utf8' });
    return {
      status: "OK",
      data: JSON.parse(data),
    };
  } catch (err) {
    return {
      status: "ERROR",
      error: `Erreur de lecture du fichier: ${err.message}`,
    };
  }
}

async function writeFile(path, data) {
  try {
    await fs.writeFile(path, JSON.stringify(data, null, 2), {
      encoding: 'utf8',
    });
    return {
      status: "OK",
    };
  } catch (err) {
    return {
      status: "ERROR",
      error: `Erreur d'écriture dans le fichier: ${err.message}`,
    };
  }
}

export { readFile, writeFile };