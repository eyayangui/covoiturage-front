export interface Annonce {
    annonceID: number;
    aller_Retour: Boolean;
    heureDepart: Date;
    heureRetour: Date;
    nbrPlaces: number;
    prix : number;
    dateCovoiturage: Date;
    bagage: Boolean;
    datePublication: Date;
    rayon : string
    routeID : number;
    departure: string;
    destination : string;

}
