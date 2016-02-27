/// <reference path="../../typings/tsd.d.ts"/>
var objects;
(function (objects) {
    // CONTROL CLASS ++++++++++++++++++++++++++++++++++++++++++
    var Control = (function () {
        // CONSTRUCTOR ++++++++++++++++++++++++++++++++++++++++
        function Control(rotationSpeed, ambientColour) {
            this.rotationSpeedx = rotationSpeed;
            this.rotationSpeedy = rotationSpeed;
            this.rotationSpeedz = rotationSpeed;
            this.ambientColour = ambientColour;
        }
        return Control;
    })();
    objects.Control = Control;
})(objects || (objects = {}));
//# sourceMappingURL=control.js.map