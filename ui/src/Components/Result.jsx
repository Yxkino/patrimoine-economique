import React from 'react';
import Patrimoine from "./../../../models/Patrimoine.js";
import Personne from "./../../../models/Personne.js";
import Flux from "./../../../models/possessions/Flux.js";
import Possession from "./../../../models/possessions/Possession.js";
import BienMateriel from "./../../../models/possessions/BienMateriel.js";

const john = new Personne("John Doe");
const dateToday = new Date();

const possessions = [
  new Possession(john, "Asus TUF", 4000000, new Date("2023-12-25"), null, 5),
  new Flux(john, "Stage Payé", 500_000, new Date("2022-12-31"), null, null, 1),
  new Flux(john, "Nouriture", -300_000, new Date("2022-12-31"), null, null, 2),
  new BienMateriel(john, "Vestimentaire et mode", 1_000_000, new Date("2022-12-31"), null, 20)
];

const johnPatrimoine = new Patrimoine(john, possessions);

export default function Result({ value }) {
  const valeurPatrimoine = isNaN(new Date(value).getTime()) ? 0 : johnPatrimoine.getValeur(new Date(value)).toFixed(0);

  return (
    <div>
      <h4>Patrimoine de {john.nom} le {value || "..."} est : {valeurPatrimoine}</h4>
    </div>
  );
}