// variables.js
// Companion module for Livestream Studio 6


// ##########################
// #### Define Variables ####
// ##########################

exports.initVariables = function () {
    var self = this;
    self.log('debug', '[Livestream Studio] Setting variable definitions')

    var variables = []

    variables.push({ 
        label: 'Connection status of this Recorder instance', name: 'status' 
    })

    for (let i = 0; i < self.data.numberOfInputs; i++) {

        variables.push({ label: `Input ${i + 1} Name`, name: `input_${i + 1}_name` });

    }

    variables.push({
        name: 'pvwSource', label: 'Preview bus Source'
    })
    variables.push({
        name: 'pgmSource', label: 'Program bus Source'
    })
    variables.push({
        name: 'GFX_1_active', label: 'GFX-1 Active'
    })
    variables.push({
        name: 'GFX_1_state', label: 'GFX-1 State'
    })
    variables.push({
        name: 'GFX_2_active', label: 'GFX-2 Active'
    })
    variables.push({
        name: 'GFX_2_state', label: 'GFX-2 State'
    })
    variables.push({
        name: 'GFX_3_active', label: 'GFX-3 Active'
    })
    variables.push({
        name: 'GFX_3_state', label: 'GFX-3 State'
    })
    
    self.data.media.forEach((media) => {
        variables.push({
            name: `Media_${media.id}_state`, label: `Media ${media.id} state`
        })
    })

    variables.push({
        name: 'streaming', label: 'Is Livestream Studio Streaming'
    })
    variables.push({
        name: 'recording', label: 'Is Livestream Studio Recording'
    })

    return variables;

}
