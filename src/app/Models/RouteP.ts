export interface RouteP { 
     routeID: number;
     departure: string;
     destination: string;
     duration :string;
     assemblyPoints: AssemblyPoint[]; 
   }
   
   export interface AssemblyPoint {
     assemblyPointsID: number;
     points: string;
   }