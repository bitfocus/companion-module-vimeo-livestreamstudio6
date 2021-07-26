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

    for (let i = 0; i < self.data.numberOfInputs; i++) {
          
        variables.push({ label: `Input ${i + 1} Name`, name: `input_${i + 1}_name` });

    }

    return variables;
    
}
