/// <reference path="../../typings/tsd.d.ts"/>

module objects {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    export class Control { 
        //PUBLIC INSTANCE VARIABLES +++++++++++++++++++++++++++
        public rotationSpeedx:number;
         public rotationSpeedy:number;
          public rotationSpeedz:number;
       public ambientColour:string;
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        constructor(rotationSpeed:number , ambientColour:string) {
           this.rotationSpeedx = rotationSpeed;
           this.rotationSpeedy = rotationSpeed;
           this.rotationSpeedz = rotationSpeed;
           this.ambientColour = ambientColour;
  
        }
        
        //PUBLIC METHODS +++++++++++++++++++++++++++++++++++++++
       
    }
}
