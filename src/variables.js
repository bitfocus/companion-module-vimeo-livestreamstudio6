// variables.js
// Companion module for Livestream Studio 6


// ##########################
// #### Define Variables ####
// ##########################

exports.initVariables = function() {
    var self = this;

    var variables = [ 
        { label: 'Connection status of this Recorder instance', name: 'status'}

    ];

    for (let index in self.data.numberOfInputs) {

            variables.push({ label: `Input ${index}: Name`, name: `input_${index}_name` });

    };

    return variables;
    
}
