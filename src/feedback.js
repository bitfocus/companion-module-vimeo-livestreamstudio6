// feedback.js
// Companion module for Livestream Studio 6


// #########################
// #### Setup Feedbacks ####
// #########################

exports.initFeedbacks = function() {
    var self = this;
    self.log('info', '[Livestream Studio] Setting feedback definitions')

    var feedbacks = {};

     // Volume options for volume level feedback
     const volumeOptions = [{
        type   : 'checkbox',
        label  : 'Show the actual dB Value',
        id     : 'value',
        default: false,
    },
    {
        type   : 'checkbox',
        label  : 'Color Text',
        id     : 'colortxt',
        default: true,
    },
    {
        type   : 'checkbox',
        label  : 'Color Background',
        id     : 'colorbg',
        default: false,
    },
    {
        type   : 'colorpicker',
        label  : 'Base Text Color',
        id     : 'colorbase',
        default: self.rgb(255, 255, 255),
    },
    {
        type   : 'colorpicker',
        label  : 'Text color above -1 dB',
        id     : 'color',
        default: self.rgb(255, 0, 0),
    },
    {
        type   : 'colorpicker',
        label  : 'Text color below -1 dB',
        id     : 'color1',
        default: self.rgb(255, 255, 0),
    },
    {
        type   : 'colorpicker',
        label  : 'Text color below -6 dB',
        id     : 'color6',
        default: self.rgb(0, 255, 0),
    },
    {
        type   : 'colorpicker',
        label  : 'Text color below -18 dB',
        id     : 'color18',
        default: self.rgb(0, 192, 0),
    },
    {
        type   : 'colorpicker',
        label  : 'Text color below -36 dB',
        id     : 'color36',
        default: self.rgb(0, 128, 0),
    }]

    let inputVolOptions = [{
        type   : 'dropdown',
        label  : 'Select Input',
        id     : 'input',
        tooltip: 'Select the Input this feedback monitors',
        default: 0,
        choices: self.data.inputs
    }]

    let masterVolOptions = [{
        type   : 'dropdown',
        label  : 'Select Master',
        id     : 'master',
        tooltip: 'Select which Master channel this feedback monitors',
        default: 0,
        choices: self.masterAudioChoices
    }]

    for (const opt in volumeOptions) {
        if (Object.hasOwnProperty.call(volumeOptions, opt)) {
            const element = volumeOptions[opt];
            
            inputVolOptions.push(element);
            masterVolOptions.push(element);
        }
    }


// ##########################
// #### Define Feedbacks ####
// ##########################

    feedbacks.previewSource = {
        type       : 'boolean',
        label      : 'Preview Source',
        description: 'Change colors if source is in Preview Bus',
        style      : {
            color  : self.rgb(255,255,255),
            bgcolor: self.rgb(0, 175, 0)
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select Input',
                id          : 'input',
                tooltip     : 'Select the input this feedback monitors',
                default     : 0,
                choices     : self.data.inputs
        }],
        callback: function (feedback) {
            if (self.data.preview === parseInt(feedback.options.input)) {
                return true
            }
            return false
        }
    }
    
    feedbacks.programSource = {
        type       : 'boolean',
        label      : 'Program Source',
        description: 'Change colors if source is in Program Bus',
        style      : {
            color  : self.rgb(255,255,255),
            bgcolor: self.rgb(200, 0, 0)
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select Input',
                id          : 'input',
                tooltip     : 'Select the input this feedback monitors',
                default     : 0,
                choices     : self.data.inputs
        }],
        callback: function (feedback) {
            if (self.data.program === parseInt(feedback.options.input)) {
                return true
            }
            return false
        }
    }

    feedbacks.gfxActive = {
        type       : 'boolean',
        label      : 'GFX Not Active',
        description: 'Change colors if a GFX stack is Not Active (Off)',
        style      : {
            color  : self.rgb(60,60,60)
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select GFX stack',
                id          : 'gfx',
                tooltip     : 'Select the GFX Stack this feedback monitors',
                default     : 0,
                choices     : self.data.gfx
        }],
        callback: function (feedback) {
            if (self.data.gfx[parseInt(feedback.options.gfx)].state === 'Off') {
                return true
            }
            return false
        }
    }

    feedbacks.gfxCanPush = {
        type       : 'boolean',
        label      : 'GFX Push Enabled',
        description: 'Change colors if a GFX stack is able to be pushed',
        style      : {
            color  : self.rgb(200,200,0)
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select GFX stack',
                id          : 'gfx',
                tooltip     : 'Select the GFX Stack this feedback monitors',
                default     : 0,
                choices     : self.data.gfx
        },
        {
                type        : 'checkbox',
                label       : 'Blink?',
                id          : 'blink',
                tooltip     : 'Enable flashing between this feedback state and the previous state',
                default     : 1
        }],
        callback: function (feedback, bank) {
            var opt = feedback.options;

            if (self.data.gfx[parseInt(opt.gfx)].canPush) {
                let fbkNameId = feedback.type + ':' + feedback.id
                if (opt.blink) {		// wants blink
                    if (self.blinkingFB[fbkNameId]) {
                        self.blinkingFB[fbkNameId] = false;
                        // blink off
                        return false;
                    } else {
                        self.blinkingFB[fbkNameId] = true;
                        return true
                    }
                } else if (self.blinkingFB[fbkNameId]) {
                    delete self.blinkingFB[fbkNameId];
                }
            } else {
                return false
            }
        }
        
    }
    
    feedbacks.gfxPushed = {
        type       : 'boolean',
        label      : 'GFX Pushed',
        description: 'Change colors if a GFX stack is Pushed',
        style      : {
            color  : self.rgb(255,255,255),
            bgcolor: self.rgb(200,0,0)
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select GFX stack',
                id          : 'gfx',
                tooltip     : 'Select the GFX Stack this feedback monitors',
                default     : 0,
                choices     : self.data.gfx
        }],
        callback: function (feedback) {
            if (self.data.gfx[parseInt(feedback.options.gfx)].pushed) {
                return true
            }
            return false
        }
    }

    feedbacks.gfxPulled = {
        type       : 'boolean',
        label      : 'GFX Pulled',
        description: 'Change colors if a GFX stack is Pulled',
        style      : {
            color  : self.rgb(200,200,0),
            png64  : self.ICON_PULL
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select GFX stack',
                id          : 'gfx',
                tooltip     : 'Select the GFX Stack this feedback monitors',
                default     : 0,
                choices     : self.data.gfx
        }],
        callback: function (feedback) {
            if (self.data.gfx[parseInt(feedback.options.gfx)].pulled) {
                return true
            }
            return false
        }
    }

    feedbacks.gfxPreview = {
        type       : 'boolean',
        label      : 'GFX In Preview',
        description: 'Change colors if a GFX stack is in Preview',
        style      : {
            color  : self.rgb(0,200,0),
            png64  : self.ICON_PREVIEW_COLOR
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select GFX stack',
                id          : 'gfx',
                tooltip     : 'Select the GFX Stack this feedback monitors',
                default     : 0,
                choices     : self.data.gfx
        }],
        callback: function (feedback) {
            if (self.data.gfx[parseInt(feedback.options.gfx)].preview) {
                return true
            }
            return false
        }
    }

    feedbacks.mediaState = {
        type       : 'boolean',
        label      : 'Media state',
        description: 'Change style based on Media input state',
        style      : {
            bgcolor: self.rgb(0,122,204)
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select Media Source',
                id          : 'media',
                tooltip     : 'Select the Media source this feedback monitors',
                default     : 0,
                choices     : self.data.media
        },
        {
                type        : 'dropdown',
                label       : 'Media State',
                id          : 'mediaAction',
                tooltip     : 'Select which state to include in this feedback',
                choices     : [
                    { id: 'playFull', label: 'Play Full Clip' },
                    { id: 'playInOut', label: 'Play In to Out Point'},
                    { id: 'pause', label: 'Pause' }
                ]
        }],
        callback: function (feedback) {
            let mediaElement =  self.data.media.find(m => m.id === parseInt(feedback.options.media))
            if (mediaElement.media == feedback.options.mediaAction) {
                return true
            }
            return false
        }
    }

    feedbacks.mediaPaused = {
        type       : 'boolean',
        label      : 'Media Paused',
        description: 'Change style if a Media source is paused',
        style      : {
            bgcolor: self.rgb(50,50,50)
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select Media Source',
                id          : 'media',
                tooltip     : 'Select the Media source this feedback monitors',
                default     : 0,
                choices     : self.data.media
        }],
        callback: function (feedback) {
            let mediaElement =  self.data.media.find(m => m.id === parseInt(feedback.options.media))
            if (mediaElement.media === 'paused') {
                return true
            }
            return false
        }
    }

    feedbacks.fadeToBlack = {
        type       : 'boolean',
        label      : 'Fade to Black State',
        description: 'Change style if Fade to Black is active',
        style      : {
            bgcolor: self.rgb(200,0,0)
        },
        options    : [{
                type        : 'text',
                label       : 'No options for this feedback'
        }],
        callback: function (feedback) {
            if (self.data.status.fadeToBlack) {
                return true
            }
            return false
        }
    }

    // TO DO
    feedbacks['inputAudioGain'] = {
        type       : 'boolean',
        label      : 'Audio Input: Gain',
        description: 'Change colors based on input audio gain',
        style      : {
            bgcolor: self.rgb(50,50,50)
        },
        options    : [{
                type        : 'dropdown',
                label       : 'Select Input',
                id          : 'input',
                tooltip     : 'Select the Input this feedback monitors',
                default     : 0,
                choices     : self.data.inputs
        }],
        callback: function (feedback) {
            if (true) {
                return true
            }
            return false
        }
    }

    feedbacks['inputAudioVolume'] = {
        type       : 'advanced',
        label      : 'Audio Input: Volume',
        description: 'Change colors based on input audio volume',
        options    : inputVolOptions
    }

    feedbacks['inputAudioMute'] = {
        type       : 'boolean',
        label      : 'Audio Input: Mute',
        description: 'Change style based on input audio mute',
        style      : {
                bgcolor : self.rgb(150,0,0)
        },
        options    : [{
            type   : 'dropdown',
            label  : 'Select Input',
            id     : 'input',
            tooltip: 'Select the Input this feedback monitors',
            default: 0,
            choices: self.data.inputs
        }],
        callback: function (feedback) {
            if (self.data.inputs[parseInt(feedback.options.input)].audioMute === 1) {
                return true
            } else if (self.data.inputs[parseInt(feedback.options.input)].audioMute === 0) {
                return false
            }
        }
    }

    feedbacks['inputAudioHeadphones'] = {
        type       : 'boolean',
        label      : 'Audio Input: Headphones',
        description: 'Change style based on input audio to headphones state',
        style      : {
                bgcolor : self.rgb(0,0,150)
        },
        options    : [{
            type   : 'dropdown',
            label  : 'Select Input',
            id     : 'input',
            tooltip: 'Select the Input this feedback monitors',
            default: 0,
            choices: self.data.inputs
        }],
        callback: function (feedback) {
            if (self.data.inputs[parseInt(feedback.options.input)].audioHeadphones === 1) {
                return true
            } else if (self.data.inputs[parseInt(feedback.options.input)].audioHeadphones === 0) {
                return false
            }
        }
    }

    feedbacks['inputAudioToPgm'] = {
        type       : 'boolean',
        label      : 'Audio Input: Audio to Program',
        description: 'Change style based on an input\'s Audio to Program state',
        style      : {
                bgcolor : self.rgb(200,0,0)
        },
        options    : [{
            type   : 'dropdown',
            label  : 'Select Input',
            id     : 'input',
            tooltip: 'Select the Input this feedback monitors',
            default: 0,
            choices: self.data.inputs
        },
        {
            type   : 'dropdown',
            label  : 'Select Audio to Program state',
            id     : 'audioToPgmState',
            tooltip: 'Select which audio to program state this feedback contols',
            choices: [
                { id: '0', label: 'Not Routed to Program (Grey Audio)' },
                { id: '1', label: 'Always Routed (Red Audio)' },
                { id: '2', label: 'When Source is live (Yellow Audio)' }
            ]
        }],
        callback: function (feedback) {
            let newState = self.data.inputs[parseInt(feedback.options.input)].audioToPgm;
            switch (feedback.options.audioToPgmState) {
                case '0':
                    return (newState === 0) ? true : false;
                    break;

                case '1':
                    return (newState === 1) ? true : false;
                    break;

                case '2':
                    return (newState === 2) ? true : false;
                    break;
            }
        }
    }

    feedbacks['masterAudioVolume'] = {
        type       : 'advanced',
        label      : 'Audio Master: Volume',
        description: 'Change colors based on master stream audio volume',
        options    : masterVolOptions
    }

    feedbacks['masterAudioMute'] = {
        type       : 'boolean',
        label      : 'Audio Master: Mute',
        description: 'Change style based on master audio mute state',
        style      : {
                bgcolor : self.rgb(150,0,0)
        },
        options    : [{
            type   : 'dropdown',
            label  : 'Select Master',
            id     : 'master',
            tooltip: 'Select which Master channel this feedback monitors',
            default: 0,
            choices: self.masterAudioChoices
        }],
        callback: function (feedback) {
            if (feedback.options.master === 'str') {
                if (self.data.streamMaster.mute === 1) {
                    return true
                } else if (self.data.streamMaster.mute === 0) {
                    return false
                }
            } else if (feedback.options.master === 'rec') {
                if (self.data.recordMaster.mute === 1) {
                    return true
                } else if (self.data.recordMaster.mute === 0) {
                    return false
                }
            }
        }
    }

    feedbacks['masterAudioHeadphones'] = {
        type       : 'boolean',
        label      : 'Audio Master: Headphones',
        description: 'Change style based on master audio to headphones state',
        style      : {
                bgcolor : self.rgb(0,0,150)
        },
        options    : [{
            type   : 'dropdown',
            label  : 'Select Master',
            id     : 'master',
            tooltip: 'Select which Master channel this feedback monitors',
            default: 0,
            choices: self.masterAudioChoices
        }],
        callback: function (feedback) {
            if (feedback.options.master === 'str') {
                if (self.data.streamMaster.headphones === 1) {
                    return true
                } else if (self.data.streamMaster.headphones === 0) {
                    return false
                }
            } else if (feedback.options.master === 'rec') {
                if (self.data.recordMaster.headphones === 1) {
                    return true
                } else if (self.data.recordMaster.headphones === 0) {
                    return false
                }
            }
        }
    }

    feedbacks.streamState = {
        type       : 'boolean',
        label      : 'Streaming State',
        description: 'Change style based on streaming state',
        style      : {
                bgcolor : self.rgb(200,0,0)
        },
        options    : [{
            type   : 'dropdown',
            label  : 'Select Streaming state',
            id     : 'stateStream',
            tooltip: 'Select which Streaming state this feedback contols',
            choices: [
                { id: 'started', label: 'Streaming Started' },
                { id: 'transitioning', label: 'Transitioning States' },
                { id: 'stopped', label: 'Streaming Stopped' }
            ]
        }],
        callback: function (feedback) {
            return (feedback.options.stateStream == self.data.status.streaming) ? true : false;
        }
    }

    feedbacks.recordState = {
        type       : 'boolean',
        label      : 'Recording State',
        description: 'Change style based on recording state',
        style      : {
                bgcolor : self.rgb(200,0,0)
        },
        options    : [{
            type   : 'dropdown',
            label  : 'Select Record state',
            id     : 'stateRecord',
            tooltip: 'Select which Recording state this feedback contols',
            choices: [
                { id: 'started', label: 'Recording Started' },
                { id: 'transitioning', label: 'Transitioning States' },
                { id: 'stopped', label: 'Recording Stopped' }
            ]
        }],
        callback: function (feedback) {
            return (feedback.options.stateRecord == self.data.status.recording) ? true : false;
        }
    }

    feedbacks.fadeToBlack = {
        type       : 'boolean',
        label      : 'Fade to Black State',
        description: 'Change style based on Fade to Black state',
        style      : {
                olor    : self.rgb(255,255,255),
                bgcolor : self.rgb(200,0,0)
        },
        options    : [{
            type   : 'text',
            label  : 'No options for this feedback'
        }],
        callback: function (feedback) {
            return (self.data.status.fadeToBlack) ? false : true;
        }
    }

    return feedbacks;
   
}

// ###########################
// #### Execute Feedbacks ####
// ###########################

exports.executeAdvFeedback = function (feedback, bank) {
    var self = this;

    let level;
    switch (feedback.type) {
        case 'inputAudioVolume':
            level = parseFloat(self.data.inputs[feedback.options.input].audioVolume);
            break;
         
        case 'masterAudioVolume':
            if (feedback.options.master ==='str') {
                level = parseFloat(self.data.streamMaster.level);
            } else if (feedback.options.master === 'rec') {
                level = parseFloat(self.data.recordMaster.level);
            }
            break;    
    }
    
    if (level !== '') {

        var rawLevel = parseFloat(level) + 60000

        var volLinear = (rawLevel * 100) / 70000
           
        //var dBLevel = Math.round(Math.pow(volLinear / 100, 0.25) * 100)

        var dBLevel = (10 * Math.log(volLinear)) / Math.LN10
        
        dBLevel = (+dBLevel - 38.7).toFixed(1)

        const color = () => {
            if (dBLevel > -1) {
                return feedback.options.color
            } else if (dBLevel > -6) {
                return feedback.options.color1
            } else if (dBLevel > -18) {
                return feedback.options.color6
            } else if (dBLevel > -36) {
                return feedback.options.color18
            }
            return feedback.options.color36
        }

        let txt = ''
        let colorfg = ''
        let colorbg = ''

        if (feedback.options.value == true) {
            txt = bank.text != '' ? `${bank.text}\\n ${dBLevel} dB` : `${bank.text}${dBLevel} dB`;
        } else {
            txt = bank.text
        }

        colorfg = feedback.options.colortxt == true ? color() : feedback.options.colorbase;

        if (feedback.options.colorbg == true) {
            colorbg = color()
        }
        return { color: colorfg, bgcolor: colorbg, text: txt }
    }

}
