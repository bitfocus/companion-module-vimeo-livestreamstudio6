// variables.js
// Companion module for Livestream Studio 6


// ##########################
// #### Define Variables ####
// ##########################

exports.initVariables = function () {
    var self = this;
    self.log('info', '[Livestream Studio] Setting variable definitions')

    var variables = []

    variables.push({ 
        label: 'Connection status of this Studio instance', name: 'status' 
    })

    for (let i = 0; i < self.data.numberOfInputs; i++) {
        variables.push({ 
            name: `input_${i + 1}_name`, label: `Input ${i + 1} Name`
        })
        variables.push({
            name: `input_${i + 1}_volume`, label: `Input ${i + 1} Volume`
        })
        variables.push({
            name: `input_${i + 1}_gain`, label: `Input ${i + 1} Input Gain`
        })
    }

    variables.push({
        name: 'pvwSource', label: 'Preview bus Source'
    })
    variables.push({
        name: 'pgmSource', label: 'Program bus Source'
    })
    
    for (let i = 0; i <= 2; i++) {
        variables.push({
            name: `GFX_${i + 1}_active`, label: `GFX-${i + 1} Active`
        })
        variables.push({
            name: `GFX_${i + 1}_state`, label: `GFX-${i + 1} State`
        })
        variables.push({
            name: `GFX_${i + 1}_preview`, label: `GFX-${i + 1} Preview`
        })
    }
    
    self.data.media.forEach((media) => {
        variables.push({
            name: `media_${media.id}_state`, label: `Media ${media.label} state`
        })
    })

    variables.push({
        name: 'streamVolume', label: 'Master stream volume level'
    })
    
    variables.push({
        name: 'recordVolume', label: 'Master record volume level'
    })

    variables.push({
        name: 'streaming', label: 'Livestream Studio Streaming state'
    })
    variables.push({
        name: 'recording', label: 'Livestream Studio Recording state'
    })

    return variables;

}
