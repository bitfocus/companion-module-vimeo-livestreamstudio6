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
        description: 'Chanage colors if source is in Preview Bus',
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
        description: 'Chanage colors if source is in Program Bus',
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
        }],
        callback: function (feedback) {
            if (self.data.gfx[parseInt(feedback.options.gfx)].canPush) {
                return true
            }
            return false
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
            color  : self.rgb(200,200,0)
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
            color  : self.rgb(0,200,0)
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
            if (self.data.media[parseInt(feedback.options.media)].media === 'playingInOut') {
                return true
            }
            return false
        }
    }

    feedbacks['mediaPlayingFull'] = {
        type       : 'boolean',
        label      : 'Media Playing Full Clip',
        description: 'Change colors if a Media source is playing full clip',
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
            if (self.data.media[parseInt(feedback.options.media)].media === 'playingFull') {
                return true
            }
            return false
        }
    }

    feedbacks['mediaPaused'] = {
        type       : 'boolean',
        label      : 'Media Paused',
        description: 'Change colors if a Media source is paused',
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
            if (self.data.media[parseInt(feedback.options.media)].media === 'paused') {
                return true
            }
            return false
        }
    }

    feedbacks['fadeToBlack'] = {
        type       : 'boolean',
        label      : 'Fade to Black State',
        description: 'Change colors if Fade to Black is active',
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
    feedbacks['inputAudioVolume'] = {
        type       : 'boolean',
        label      : 'Audio Input: Volume',
        description: 'Change colors based on input audio volume',
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
        type       : 'advanced',
        label      : 'Audio Input: Mute',
        description: 'Change colors based on input audio mute',
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
                return {
                    bgcolor: self.rgb(150, 0, 0),
                    png64  : self.ICON_SPEAKER_OFF
                }
            } else if (self.data.inputs[parseInt(feedback.options.input)].audioMute === 0) {
                return {
                   // bgcolor: self.rgb(0, 0, 150),
                    png64  : self.ICON_SPEAKER_ON
                }
            }
        }
    }

    feedbacks['inputAudioHeadphones'] = {
        type       : 'advanced',
        label      : 'Audio Input: Headphones',
        description: 'Change colors based on input audio to headphones state',
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
                return {
                    bgcolor: self.rgb(0, 225, 0),
                    png64  : self.ICON_HEADPHONES_OFF
                }
            } else if (self.data.inputs[parseInt(feedback.options.input)].audioHeadphones === 0) {
                return {
                   bgcolor: self.rgb(0, 100, 0),
                    png64  : self.ICON_HEADPHONES_ON 
                }
            }
        }
    }




    return feedbacks;
   
}

// ###########################
// #### Execute Feedbacks ####
// ###########################

exports.executeFeedback = function (feedback, bank) {


}