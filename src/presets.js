// presets.js
// Companion module for Livestream Studio 6


// ########################
// #### Define Presets ####
// ########################

exports.initPresets = function () {
    const self = this;
    self.log('info', '[Livestream Studio] Setting preset definitions')
    
    const presets = [];
  
    // Iterate inputs to create program/preview buses
    for (const input in self.data.inputs) {
        if (Object.hasOwnProperty.call(self.data.inputs, input)) {
            const element = self.data.inputs[input];
            
            // Preview Bus
            presets.push({
                category: 'Pgm/Pvw Bus',
                label   : `setPreviewSource${element.id}`,
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
                label   : `setProgramSource${element.id}`,
                bank    : {
                    style    : 'text',
                    text     : `PGM\\n\$(studio:input_${element.id + 1}_name)`,   //'PGM ' + element.label.split(/:/)[0] + '\\n' + element.label.split(/:/)[1],
                    size     : '14',
                    alignment: 'center:top',
                    color    : self.rgb(255,255,255)
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
                        muteAction: 1
                    }
                }],
                release_actions: [{
                    action : 'inputAudioMute',
                    options: {
                        input     : [element.id],
                        muteAction: 0
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
                        audioHeadphoneAction: 1
                    }
                }],
                release_actions: [{
                    action : 'inputAudioHeadphones',
                    options: {
                        input     : [element.id],
                        audioHeadphoneAction: 2
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

            // Audio: Volume Level
            presets.push({
                category: 'Audio',
                label   : `audioVolume${element.id}`,
                bank    : {
                    style    : 'text',
                    text     : `VOL\\n\$(studio:input_${element.id + 1}_name)`,
                    size     : '14',
                    color    : self.rgb(255,255,255)
                },
                actions: [{
                    action : 'setAudioVolume',
                    options: {
                        input  : [element.id],
                        volume : 0
                    }
                }],
                feedbacks: [{
                    type   : 'inputAudioVolume',
                    options: {
                        input : [element.id],
                        value : true
                    }
                }]
            });

            // Audio: Gain Level
            presets.push({
                category: 'Audio',
                label   : `audioGain${element.id}`,
                bank    : {
                    style    : 'text',
                    text     : `GAIN\\n\$(studio:input_${element.id + 1}_name)`,
                    size     : '14',
                    color    : self.rgb(255,255,255)
                },
                actions: [{
                    action : 'setAudioGain',
                    options: {
                        input  : [element.id],
                        gain   : 0
                    }
                }],
                feedbacks: [{
                    type   : 'inputAudioGain',
                    options: {
                        input : [element.id]
                    }
                }]
            });
        }
    }  //end of for loop

    /// Master audio channels
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

        // GFX Push
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

        // GFX Pull
        presets.push({
            category: 'GFX',
            label   : `pullGFX${i}`,
            bank    : {
                style    : 'text',
                text     : `GFX-${i + 1}`,
                size     : '14',
                alignment: 'center:bottom',
                png64    : self.ICON_PULL,
                color    : self.rgb(255,255,255)
            },
            actions: [{
                action : 'controlGFX',
                options: {
                    gfx      : [i],
                    gfxAction: 'pull'
                }
            }],
            feedbacks: [{
                type   : 'gfxPushed',
                options: {
                    gfx: [i]
                },
                style : {
                    png64: self.ICON_PULL_COLOR,
                    bgcolor: self.rgb(100,0,0)
                }
            },
            {
                type: 'gfxPulled',
                options: {
                    gfx: [i],
                },
                style: {
                    png64 : self.ICON_PULL
                } 
            }
        ]
        });
        
        // GFX Preview
        presets.push({
            category: 'GFX',
            label   : `previewGFX${i}`,
            bank    : {
                style    : 'text',
                text     : `GFX-${i + 1}`,
                size     : '14',
                alignment: 'center:bottom',
                png64    : self.ICON_PREVIEW,
                color    : self.rgb(255,255,255),
                latch    : true
            },
            actions: [{
                action : 'controlGFX',
                options: {
                    gfx      : [i],
                    gfxAction: 'previewShow'
                }
            }],
            release_actions: [{
                action : 'controlGFX',
                options: {
                    gfx      : [i],
                    gfxAction: 'previewHide'
                }
            }],
            feedbacks: [{
                type   : 'gfxPreview',
                options: {
                    gfx: [i]
                },
                style : {
                    png64: self.ICON_PREVIEW_COLOR,
                    bgcolor: self.rgb(0,100,0)
                }
            },
            {
                type: 'gfxPulled',
                options: {
                    gfx: [i],
                },
                style: {
                    png64 : self.ICON_PREVIEW
                } 
            }
        ]
        });

    } // end for loop GFX

    // Media Inputs
    if (self.data.media[0] !== undefined) {
        for (const media in self.data.media) {
            if (Object.hasOwnProperty.call(self.data.media, media)) {
                const element = self.data.media[media];
                
                // Media Play Full Clip
                presets.push({
                    category: 'Media',
                    label   : `mediaPlayFull${element.id}`,
                    bank    : {
                        style    : 'text',
                        text     : `${element.label}\\nPlay Full`,
                        size     : '14',
                        color    : self.rgb(255,255,255),
                        bgcolor  : self.rgb(0,0,50)
                    },
                    actions: [{
                        action : 'controlMedia',
                        options: {
                            media      : element.id,
                            mediaAction: 'playFull'
                        }
                    }],
                    feedbacks: [{
                        type   : 'mediaState',
                        options: {
                            media      : element.id,
                            mediaAction: 'playFull'
                        },
                        style : {
                            bgcolor: self.rgb(0,0,204),
                        }
                    },
                    {
                        type   : 'mediaState',
                        options: {
                            media      : element.id,
                            mediaAction: 'pause'
                        },
                        style : {
                            bgcolor: self.rgb(0,0,104),
                        }
                    }]
                });


                // Media Play In to Out
                presets.push({
                    category: 'Media',
                    label   : `mediaPlayInOut${element.id}`,
                    bank    : {
                        style    : 'text',
                        text     : `${element.label}\\nPlay InOut`,
                        size     : '14',
                        color    : self.rgb(255,255,255),
                        bgcolor  : self.rgb(0,0,50)
                    },
                    actions: [{
                        action : 'controlMedia',
                        options: {
                            media      : element.id,
                            mediaAction: 'playInOut'
                        }
                    }],
                    feedbacks: [{
                        type   : 'mediaState',
                        options: {
                            media      : element.id,
                            mediaAction: 'playInOut'
                        },
                        style : {
                            bgcolor: self.rgb(100,0,204),
                        }
                    },
                    {
                        type   : 'mediaState',
                        options: {
                            media      : element.id,
                            mediaAction: 'pause'
                        },
                        style : {
                            bgcolor: self.rgb(50,0,104),
                        }
                    }]
                });
    
                // Media Pause
                presets.push({
                    category: 'Media',
                    label   : `mediaPause${element.id}`,
                    bank    : {
                        style    : 'text',
                        text     : `${element.label}\\nPause`,
                        size     : '14',
                        color    : self.rgb(255,255,255),
                        bgcolor  : self.rgb(0,0,50)
                    },
                    actions: [{
                        action : 'controlMedia',
                        options: {
                            media      : element.id,
                            mediaAction: 'pause'
                        }
                    }],
                    feedbacks: [{
                        type   : 'mediaState',
                        options: {
                            media      : element.id,
                            mediaAction: 'playInOut'
                        },
                        style : {
                            bgcolor: self.rgb(50,50,50),
                        }
                    },
                    {
                        type   : 'mediaState',
                        options: {
                            media      : element.id,
                            mediaAction: 'playFull'
                        },
                        style : {
                            bgcolor: self.rgb(50,50,54),
                        }
                    },
                    {
                        type   : 'mediaState',
                        options: {
                            media      : element.id,
                            mediaAction: 'pause'
                        },
                        style : {
                            bgcolor: self.rgb(200,200,40),
                        }
                    }]
                });

            }
        }
    }

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

     // Fade to Black
     presets.push({
        category: 'Transitions',
        label   : 'executeFTB',
        bank    : {
            style  : 'text',
            text   : 'Fade to Black',
            size   : '14',
            color  : self.rgb(0,0,0),
            bgcolor: self.rgb(100,100,100),
            latch  : true
        },
        actions: [{
            action : 'fadeToBlack',
            options: {
                action: 'fadeIn'
            }
        }],
        release_actions: [{
            action : 'fadeToBlack',
            options: {
                action: 'fadeOut'
            }
        }],
        feedbacks: [{
            type   : 'fadeToBlack',
            options: {},
            style  : {
                bgcolor: self.rgb(200,0,0)
            }
        }]
    });
   
     // Streaming Toggle
     presets.push({
        category: 'System',
        label   : 'toggleStreaming',
        bank    : {
            style  : 'text',
            text   : 'Stream',
            size   : '18',
            color  : self.rgb(255,255,255),
            bgcolor: self.rgb(0,150,0),
            latch  : true
        },
        actions: [{
            action : 'controlStream',
            options: {
                streamAction: 'startStream'
            }
        }],
        release_actions: [{
            action : 'controlStream',
            options: {
                streamAction: 'stopStream'
            }
        }],
        feedbacks: [{
            type   : 'streamState',
            options: {
                stateStream: 'transitioning'
            },
            style  : {
                text   : 'Transitioning',
                bgcolor: self.rgb(200,200,0)
            }
        },
        {
            type   : 'streamState',
            options: {
                stateStream: 'started'
            },
            style  : {
                text   : 'Stream Started',
                bgcolor: self.rgb(200,0,0)
            }
        }]
    });

     // Record Toggle
     presets.push({
        category: 'System',
        label   : 'toggleRecording',
        bank    : {
            style  : 'text',
            text   : 'Record',
            size   : '18',
            color  : self.rgb(255,255,255),
            bgcolor: self.rgb(0,150,0),
            latch  : true
        },
        actions: [{
            action : 'controlRecord',
            options: {
                recordAction: 'startRecord'
            }
        }],
        release_actions: [{
            action : 'controlRecord',
            options: {
                recordAction: 'stopRecord'
            }
        }],
        feedbacks: [{
            type   : 'recordState',
            options: {
                stateRecord: 'transitioning'
            },
            style  : {
                text   : 'Transitioning',
                bgcolor: self.rgb(200,200,0)
            }
        },
        {
            type   : 'recordState',
            options: {
                stateRecord: 'started'
            },
            style  : {
                text   : 'Recording',
                bgcolor: self.rgb(200,0,0)
            }
        }]
    });


    
    return presets;

}
