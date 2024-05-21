//import { format, parse } from 'date-fns';

export interface Annonce {
    annonceID: number;
    aller_Retour: boolean;
    heureDepart: string; 
    heureRetour: string; 
    nbrPlaces: number;
    prix: number;
    dateCovoiturage: Date;
    bagage: boolean;
    datePublication: Date;
    rayon: string;
    routeID: number;
    departure: string;
    destination: string;
}

// Exemple d'utilisation avec date-fns pour parser et formater les heures
//const heureDepart: string = format(parse('08:30', 'HH:mm', new Date()), 'HH:mm');
//const heureRetour: string = format(parse('18:45', 'HH:mm', new Date()), 'HH:mm');
