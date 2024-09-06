export default class Possession {
  constructor(possesseur, libelle, valeur, dateDebut, dateFin, tauxAmortissement) {
    this.possesseur = possesseur;
    this.libelle = libelle;
    this.valeur = valeur;
    this.dateDebut = dateDebut;
    this.dateFin = dateFin;
    this.tauxAmortissement = tauxAmortissement;
  }

  getValeur(date) {
    return this.getValeurApresAmortissement(date);
  }

  getValeurApresAmortissement(dateActuelle) {
    if (dateActuelle < this.dateDebut) {
      return 0;
    }

    const differenceDate = this.calculateDateDifference(dateActuelle);
    const raison = differenceDate.year + differenceDate.month / 12 + differenceDate.day / 365;

    return this.valeur * (1 - (raison * this.tauxAmortissement / 100));
  }

  calculateDateDifference(dateActuelle) {
    return {
      year: dateActuelle.getFullYear() - this.dateDebut.getFullYear(),
      month: dateActuelle.getMonth() - this.dateDebut.getMonth(),
      day: dateActuelle.getDate() - this.dateDebut.getDate(),
    };
  }
}