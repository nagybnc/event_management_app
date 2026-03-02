import { registerEnumType } from "type-graphql";

export enum Location {
  CORINTHIA_BUDAPEST = "Corinthia Budapest",
  HEMINGWAY_ETTEREM = "Hemingway étterem",
  BOSCOLO = "Boscolo",
  PESTI_VIGADO = "Pesti Vigadó",
  GUNDEL_ETTEREM = "Gundel Étterem",
  VAJDAHUNYAD_VAR = "Vajdahunyad Vár",
  BALATONFURED_KONGRESSZUSI_KOZPONT = "Balatonfüred Kongresszusi Központ",
  OBOLHAZ_RENDEZVENYKOZPONT = "ÖbölHáz Rendezvényközpont",
}

registerEnumType(Location, {
  name: "Location",
  description: "Available event locations",
});
