// feedback.js
// Companion module for Livestream Studio 6


// ##########################
// #### Define Feedbacks ####
// ##########################

exports.initFeedbacks = function() {
    var self = this;
    self.log('info', '[Livestream Studio] Setting feedback definitions')

    var feedbacks = {};


    
    feedbacks['previewSource'] = {
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
    
    feedbacks['programSource'] = {
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

    feedbacks['gfxActive'] = {
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

    feedbacks['gfxCanPush'] = {
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
    
    feedbacks['gfxPushed'] = {
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

    feedbacks['gfxPulled'] = {
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

    feedbacks['gfxPreview'] = {
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

    feedbacks['mediaPlayingInOut'] = {
        type       : 'boolean',
        label      : 'Media Playing In/Out',
        description: 'Change colors if a Media source is playing from in to out points',
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
        }],
        callback: function (feedback) {
            let mediaElement =  self.data.media.find(m => m.id === parseInt(feedback.options.media))
            if (mediaElement.media === 'playingInOut') {
                return true
            }
            return false
        }
    }

    feedbacks['mediaPlayingFull'] = {
        type       : 'boolean',
        label      : 'Media Playing Full Clip',
        description: 'Change style if a Media source is playing full clip',
        style      : {
            bgcolor: self.rgb(0,0,204)
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
            if (mediaElement.media === 'playingFull') {
                return true
            }
            return false
        }
    }

    feedbacks['mediaPaused'] = {
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

    feedbacks['fadeToBlack'] = {
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





    // Volume options for volume level feedback
    const volumeOptions = [{
        type   : 'dropdown',
        label  : 'Select Input',
        id     : 'input',
        tooltip: 'Select the Input this feedback monitors',
        default: 0,
        choices: self.data.inputs
    },
    {
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

    // Volume level feedback
    feedbacks['inputAudioVolume'] = {
        type       : 'advanced',
        label      : 'Audio Input: Volume',
        description: 'Change colors based on input audio volume',
        options    : volumeOptions
    }

    feedbacks['streamAudioVolume'] = {
        type       : 'advanced',
        label      : 'Master Input:Stream Volume',
        description: 'Change colors based on master stream audio volume',
        options    : volumeOptions
    }

    feedbacks['recordAudioVolume'] = {
        type       : 'advanced',
        label      : 'Master Input:Record Volume',
        description: 'Change colors based on master record audio volume',
        options    : volumeOptions
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
         
        case 'streamAudioVolume':
            level = parseFloat(self.data.streamMaster.level);
            break;

        case 'recordAudioVolume':
            level = parseFloat(self.data.recordMaster.level);
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
            if (bank.text != '') {
                txt = bank.text + `\\n ${dBLevel} dB`
            } else {
                txt = bank.text + `${dBLevel} dB`
            }
        } else {
            txt = bank.text
        }

        if (feedback.options.colortxt == true) {
            colorfg = color()
        } else {
            colorfg = feedback.options.colorbase
        }

        if (feedback.options.colorbg == true) {
            colorbg = color()
        }
        return { color: colorfg, bgcolor: colorbg, text: txt }
    }

}
