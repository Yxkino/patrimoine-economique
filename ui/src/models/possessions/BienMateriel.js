import Possession from "./Possession.js";

export default class BienMateriel extends Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    super(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement);
  }

  getValeur(date) {
    return super.getValeur(date); // Retourne la valeur de la méthode parente
  }
}