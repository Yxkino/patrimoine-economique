import Possession from "./Possession.js";
const TYPE_ARGENT = { // Changement de var à const
  Courant: "Courant",
  Epargne: "Epargne",
  Espece: "Espece"
};

export default class Argent extends Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement, type) {
    super(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement);
    this.type = type; // Suppression du try-catch si type est toujours valide
  }
}