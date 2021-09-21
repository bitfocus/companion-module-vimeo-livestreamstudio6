// presets.js
// Companion module for Livestream Studio 6


// ########################
// #### Define Presets ####
// ########################

exports.initPresets = function () {
    var self = this;
    self.log('info', '[Livestream Studio] Setting preset definitions')
    
    var presets = [];
  
    // Iterate inputs to create program/preview buses
    for (const input in self.data.inputs) {
        if (Object.hasOwnProperty.call(self.data.inputs, input)) {
            const element = self.data.inputs[input];
            
            // Preview Bus
            presets.push({
                category: 'Pgm/Pvw Bus',
                label   : 'setPreviewSource' + element.id,
                bank    : {
                    style    : 'text',
                    text     : `PVW\\n\$(studio:input_${element.id + 1}_name)`,  //'PVW ' + element.label.split(/:/)[0] + '\\n' + element.label.split(/:/)[1],
                    size     : '14',
                    alignment: 'center:top',
                    color    : self.rgb(255,255,255),
                    bgcolor  : self.rgb(50,50,50)
                },
                actions: [{
                    action : 'setPreviewSrc',
                    options: {
                        input: [parseInt(element.id)]
                    }
                }],
                feedbacks: [{
                    type: 'previewSource',
                    options: {
                        input: parseInt(element.id)
                    },
                    style : {
                        color  : self.rgb(255,255,255),
                        bgcolor: self.rgb(0, 175, 0)
                    }
                }]
            });
            
            
             // Program Bus
             presets.push({
                category: 'Pgm/Pvw Bus',
                label   : 'setProgramSource' + element.id,
                bank    : {
                    style  : 'text',
                    text   : `PGM\\n\$(studio:input_${element.id + 1}_name)`, //'PGM ' + element.label.split(/:/)[0] + '\\n' + element.label.split(/:/)[1],
                    size   : '14',
                    color  : self.rgb(255,255,255)
                },
                actions: [{
                    action : 'setProgramSrc',
                    options: {
                        input: [parseInt(element.id)]
                    }
                }],
                feedbacks: [{
                    type: 'programSource',
                    options: {
                        input: parseInt(element.id)
                    },
                    style : {
                        color  : self.rgb(255,255,255),
                        bgcolor: self.rgb(200, 0, 0)
                    }
                }]
            });

            // Audio: Mute Toggle
            presets.push({
                category: 'Audio',
                label   : `audioMute${element.id}`,
                bank    : {
                    style    : 'text',
                    text     : `\$(studio:input_${element.id + 1}_name)`,
                    size     : '14',
                    alignment: 'center:bottom',
                    png64    : self.ICON_SPEAKER_ON,
                    color    : self.rgb(255,255,255),
                    bgcolor  : self.rgb(0,0,0),
                    latch    : true
                },
                actions: [{
                    action : 'inputAudioMute',
                    options: {
                        input     : [element.id],
                        muteAction: 'on'
                    }
                }],
                release_actions: [{
                    action : 'inputAudioMute',
                    options: {
                        input     : [element.id],
                        muteAction: 'off'
                    }
                }],
                feedbacks: [{
                    type   : 'inputAudioMute',
                    options: {
                        input: [element.id]
                    },
                    style : {
                        bgcolor: self.rgb(150,0,0),
                        png64  : self.ICON_SPEAKER_OFF
                    }
                }]
            });
            
            // Audio: Headphones Toggle
            presets.push({
                category: 'Audio',
                label   : `audioHeadphones${element.id}`,
                bank    : {
                    style    : 'text',
                    text     : `\$(studio:input_${element.id + 1}_name)`,
                    size     : '14',
                    alignment: 'center:bottom',
                    png64    : self.ICON_HEADPHONES_OFF,
                    color    : self.rgb(255,255,255),
                    bgcolor  : self.rgb(0,0,50),
                    latch    : true
                },
                actions: [{
                    action : 'inputAudioHeadphones',
                    options: {
                        input     : [element.id],
                        audioHeadphoneAction: 'on'
                    }
                }],
                release_actions: [{
                    action : 'inputAudioHeadphones',
                    options: {
                        input     : [element.id],
                        audioHeadphoneAction: 'off'
                    }
                }],
                feedbacks: [{
                    type   : 'inputAudioHeadphones',
                    options: {
                        input: [element.id]
                    },
                    style : {
                        bgcolor: self.rgb(0,0,150),
                        png64  : self.ICON_HEADPHONES_ON
                    }
                }]
            });

            // Audio: Audio to Program
            presets.push({
                category: 'Audio',
                label   : `audioToPgm${element.id}`,
                bank    : {
                    style    : 'text',
                    text     : `AUDIO\\n\$(studio:input_${element.id + 1}_name)`,
                    size     : '14',
                    color    : self.rgb(255,255,255)
                },
                actions: [{
                    action : 'inputAudioOnPgm',
                    options: {
                        input           : [element.id],
                        audioOnPgmAction: 'always'
                    }
                }],
                feedbacks: [{
                    type   : 'inputAudioToPgm',
                    options: {
                        input          : [element.id],
                        audioToPgmState: 0
                    },
                    style : {
                        bgcolor: self.rgb(60,60,60)
                    }
                },
                {
                    type   : 'inputAudioToPgm',
                    options: {
                        input          : [element.id],
                        audioToPgmState: 1
                    },
                    style : {
                        bgcolor: self.rgb(200,0,0)
                    }
                },
                {
                    type   : 'inputAudioToPgm',
                    options: {
                        input          : [element.id],
                        audioToPgmState: 2
                    },
                    style : {
                        bgcolor: self.rgb(200,200,0),
                        color  : self.rgb(40,40,40)
                    }
                }]
            });

        }
    }  //end of for loop


    for (const master in self.masterAudioChoices) {
        if (Object.hasOwnProperty.call(self.masterAudioChoices, master)) {
            const element = self.masterAudioChoices[master];

            // Master Audio: Mute Toggle
            presets.push({
                category: 'Master Audio',
                label   : `masterMute${element.id}`,
                bank    : {
                    style    : 'text',
                    text     : `${element.label}\\nMUTE`,
                    size     : '14',
                    alignment: 'center:bottom',
                    png64    : self.ICON_SPEAKER_ON,
                    color    : self.rgb(255,255,255),
                    bgcolor  : self.rgb(0,0,0),
                    latch    : true
                },
                actions: [{
                    action : 'masterAudioMute',
                    options: {
                        master    : element.id,
                        muteAction: 1
                    }
                }],
                release_actions: [{
                    action : 'masterAudioMute',
                    options: {
                        master    : element.id,
                        muteAction: 0
                    }
                }],
                feedbacks: [{
                    type   : 'masterAudioMute',
                    options: {
                        master: element.id
                    },
                    style : {
                        bgcolor: self.rgb(150,0,0),
                        png64  : self.ICON_SPEAKER_OFF
                    }
                }]
            });
            
            // Master Audio: Headphones Toggle
            presets.push({
                category: 'Master Audio',
                label   : `masterHeadphones${element.id}`,
                bank    : {
                    style    : 'text',
                    text     : `${element.label}`,
                    size     : '14',
                    alignment: 'center:bottom',
                    png64    : self.ICON_HEADPHONES_OFF,
                    color    : self.rgb(255,255,255),
                    bgcolor  : self.rgb(0,0,50),
                    latch    : true
                },
                actions: [{
                    action : 'masterAudioHeadphones',
                    options: {
                        master              : element.id,
                        audioHeadphoneAction: 1
                    }
                }],
                release_actions: [{
                    action : 'masterAudioHeadphones',
                    options: {
                        master              : element.id,
                        audioHeadphoneAction: 0
                    }
                }],
                feedbacks: [{
                    type   : 'masterAudioHeadphones',
                    options: {
                        master: element.id
                    },
                    style : {
                        bgcolor: self.rgb(0,0,150),
                        png64  : self.ICON_HEADPHONES_ON
                    }
                }]
            });

        }
    }


    // Generate GFX presets
    for (let i = 0; i <= 2; i++) {
        presets.push({
            category: 'GFX',
            label   : `pushGFX${i}`,
            bank    : {
                style    : 'text',
                text     : `GFX-${i + 1}`,
                size     : '14',
                alignment: 'center:bottom',
                png64    : self.ICON_PUSH_COLOR,
                color    : self.rgb(255,255,255)
            },
            actions: [{
                action : 'controlGFX',
                options: {
                    gfx      : [i],
                    gfxAction: 'push'
                }
            }],
            feedbacks: [{
                type   : 'gfxPushed',
                options: {
                    gfx: [i]
                },
                style : {
                    png64: self.ICON_PUSH
                }
            },
            {
                type: 'gfxCanPush',
                options: {
                    gfx: [i],
                    blink: 1
                },
                style: {
                    png64 : self.ICON_PUSH,
                    color : self.rgb(200,200,0)
                } 
            }
        ]
        });
    } // end for loop GFX


    // Cut Transition
    presets.push({
        category: 'Transitions',
        label   : 'executeCut',
        bank    : {
            style  : 'text',
            text   : 'CUT',
            size   : '24',
            color  : self.rgb(0,0,0),
            bgcolor: self.rgb(200,200,200)
        },
        actions: [{
            action : 'transitionCut',
            options: {
            }
        }]
    });

    // Auto Transition
    presets.push({
        category: 'Transitions',
        label   : 'executeAuto',
        bank    : {
            style  : 'text',
            text   : 'AUTO',
            size   : '24',
            color  : self.rgb(0,0,0),
            bgcolor: self.rgb(200,200,200)
        },
        actions: [{
            action : 'transitionAuto',
            options: {
            }
        }]
    });

   

    return presets;

}
