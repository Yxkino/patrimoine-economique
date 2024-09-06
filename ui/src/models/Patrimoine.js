export default class Patrimoine {
  constructor(possesseur, possessions) {
    this.possesseur = possesseur;
    this.possessions = [...possessions];
  }

  getValeur(date) {
    return this.possessions.reduce((total, item) => total + item.getValeur(date), 0);
  }

  addPossession(possession) {
    if (possession.possesseur !== this.possesseur) {
      console.log(`${possession.libelle} n'appartient pas à ${this.possesseur}`);
    } else {
      this.possessions.push(possession);
    }
  }

  removePossession(possession) {
    this.possessions = this.possessions.filter(p => p.libelle !== possession.libelle);
  }
}