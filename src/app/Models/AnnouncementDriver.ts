
    export interface AnnouncementDriver {
        collaboratorId: number | undefined;
        annonceID: number;
        aller_Retour: Boolean;
        heureDepart: string;
        heureRetour: string;
        nbrPlaces: number;
        dateCovoiturage: Date;
        bagage: Boolean;
        datePublication: Date;
        rayon : string;
        routeID : number;
        music: Boolean;
        fumer: Boolean; 
        departure: string;
        destination: string;
        prix : number;
        userId: number;
        assemblyPointsID: number;
        eventID : number;
        climatiseur: Boolean; 
        description : string;

        
    }
    
    