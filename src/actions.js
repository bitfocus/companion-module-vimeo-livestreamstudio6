// actions.js
// Companion module for Livestream Studio 6

// ########################
// #### Define Actions ####
// ########################

// Define actions
exports.initActions = function () {
    var self = this;
    var actions = {};
    //self.log('info', '[Livestream Studio] Setting action definitions')

    actions.setPreviewSrc = {
        label      : 'Set Preview Bus Source',
        description: 'Set the source input on the Preview bus',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Input',
                id          : 'input',
                tooltip     : 'Select the input to send to the Preview bus.',
                default     : [ 0 ],
                choices     : self.data.inputs
            }
        ]
    }

    actions.setProgramSrc = {
        label      : 'Set Program Bus Source',
        description: 'Set the source input on the Program bus',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Input',
                id          : 'input',
                tooltip     : 'Select the input to send to the Program bus.',
                default     : [ 0 ],
                choices     : self.data.inputs
            }
        ]
    }

    actions.controlGFX = {
        label      : 'Control GFX Sources',
        description: 'Set and control various functions on the GFX stacks (Push, Pull, etc)',
        options    : [
            {
                type        : 'dropdown',
                label       : 'GFX Source',
                id          : 'gfx',
                tooltip     : 'Select the GFX stack to control.',
                default     :[ 0 ],
                choices     : self.data.gfx
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'gfxAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 'push', label: 'Push' },
                    { id: 'pull', label: 'Pull' },
                    { id: 'previewShow', label: 'Preview Show' },
                    { id: 'previewHide', label: 'Preview Hide' }
                ]
            }
        ]
    }

    actions.controlMedia = {
        label      : 'Control Media Sources',
        description: 'Control Play/Pause state on Media Inputs. When playing you can play the full clip or just the In to Out points',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Media Player Source',
                id          : 'media',
                tooltip     : 'Select the Media Player to control.',
                choices     : self.data.media
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'mediaAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 'playFull', label: 'Play Full Clip' },
                    { id: 'playInOut', label: 'Play In to Out Point'},
                    { id: 'pause', label: 'Pause' }
                ]
            }
        ]
    }

    actions.transitionCut = {
        label      : 'Transition: Cut',
        description: 'Execute a CUT transition',
        options    : [
            {
                type        : 'text',
                label       : 'No options for this action.',
                id          : 'cut'
            }
        ]
    }

    actions.transitionAuto = {
        label      : 'Transition Auto',
        description: 'Execute an AUTO transition',
        options    : [
            {
                type        : 'text',
                label       : 'No options for this action.',
                id          : 'auto'
            }
        ]
    }

    actions['fadeToBlack'] = {
        label      : 'Transition: Fade to Black',
        description: 'Control the Fade to Black transition',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Action',
                id          : 'action',
                tooltip     : 'Select the Fade to Black action.',
                choices     : [
                    { id: 'fadeIn', label: 'Fade In' },
                    { id: 'fadeOut', label: 'Fade Out' }
                ]
            }
        ]
    }

    actions['setAudioVolume'] = {
        label      : 'Audio Input: Set Volume',
        description: 'Set the volume level on an input channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Input',
                id          : 'input',
                tooltip     : 'Select the input to adjust the volume.',
                default     : [ 0 ],
                choices     : self.data.inputs
            },
            {
                type    : 'number',
                label   : 'Volume Level (-60000 to 10000)',
                id      : 'volume',
                tooltip : 'Enter volume level from -60000 to 10000.',
                min     : -60000,
                max     : 10000,
                default : 0,
                step    : 1,
                required: true
            }
        ]
    }

    actions['setAudioVolumeIncrement'] = {
        label      : 'Audio Input: Adjust Volume by Increment',
        description: 'Increment the Volume by an amount on a Input channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Input',
                id          : 'input',
                tooltip     : 'Select the input to adjust the volume.',
                choices     : self.data.inputs
            },
            {
                type    : 'number',
                label   : 'Increment (-60000 to +60000)',
                id      : 'increment',
                tooltip : 'Enter incremental adjustment to volume level from -60000 to +60000.',
                min     : -60000,
                max     : 60000,
                default : 0,
                step    : 1,
                required: true
            }
        ]
    }

    actions['setAudioGain'] = {
        label      : 'Audio Input: Set Gain',
        description: 'Set the Gain value on an input channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Input',
                id          : 'input',
                tooltip     : 'Select the input to adjust the gain.',
                default     : [ 0 ],
                choices     : self.data.inputs
            },
            {
                type    : 'number',
                label   : 'Gain Level (0 to 10000)',
                id      : 'gain',
                tooltip : 'Enter the gain level from 0 to 10000',
                min     : 0,
                max     : 10000,
                default : 0,
                step    : 1,
                required: true
            }
        ]
    }

    actions['inputAudioMute'] = {
        label      : 'Audio Input: Set Mute',
        description: 'Control the Mute state on an input channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Input',
                id          : 'input',
                tooltip     : 'Select the Input to control.',
                default     : [ 0 ],
                choices     : self.data.inputs
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'muteAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 'on', label: 'Mute On' },
                    { id: 'off', label: 'Mute Off' }
                ]
            }
        ]
    }

    actions['inputAudioOnPgm'] = {
        label      : 'Audio Input: Set Audio to Program',
        description: 'Set the Audio to Program state on an input channel. This is the same as pressing the AUDIO button in Livestream',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Input',
                id          : 'input',
                tooltip     : 'Select the Input to control.',
                default     : [ 0 ],
                choices     : self.data.inputs
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'audioOnPgmAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 1, label: 'Always On (Audio button RED)' },
                    { id: 2, label: 'On when source in Program (Audio button YELLOW)' },
                    { id: 0, label: 'Audio Off (Audio Button Off)' }
                ]
            }
        ]
    }

    actions['inputAudioHeadphones'] = {
        label      : 'Audio Input: Set Headphones',
        description: 'Set the Audio to Headphones state on an input channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Input',
                id          : 'input',
                tooltip     : 'Select the Input to control.',
                default     : [ 0 ],
                choices     : self.data.inputs
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'audioHeadphoneAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id:  0, label: 'Headphone Off' },
                    { id:  1, label: 'Headphone On' }
                ]
            }
        ]
    }

    actions['setMasterVolume'] = {
        label      : 'Audio Master: Set Volume',
        description: 'Set the Volume level to an absolute value on a Master channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Master',
                id          : 'master',
                tooltip     : 'Select the input to adjust the volume.',
                choices     : self.masterAudioChoices
            },
            {
                type    : 'number',
                label   : 'Volume Level (-60000 to 10000)',
                id      : 'volume',
                tooltip : 'Enter volume level from -60000 to 10000.',
                min     : -60000,
                max     : 10000,
                default : 0,
                step    : 1,
                required: true
            }
        ]
    }

    actions['setMasterVolumeIncrement'] = {
        label      : 'Audio Master: Adjust Volume by Increment',
        description: 'Increment the Volume by an amount on a Master channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Master',
                id          : 'master',
                tooltip     : 'Select the input to adjust the volume.',
                choices     : self.masterAudioChoices
            },
            {
                type    : 'number',
                label   : 'Increment (-60000 to +60000)',
                id      : 'increment',
                tooltip : 'Enter incremental adjustment to volume level from -60000 to +60000.',
                min     : -60000,
                max     : 60000,
                default : 0,
                step    : 1,
                required: true
            }
        ]
    }

    actions['masterAudioMute'] = {
        label      : 'Audio Master: Set Mute',
        description: 'Set the Mute state on a Master channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Master',
                id          : 'master',
                tooltip     : 'Select the Master Channel to control.',
                choices     : self.masterAudioChoices
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'muteAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 0, label: 'Mute Off' },
                    { id: 1, label: 'Mute On' }
                ]
            }
        ]
    }

    actions['masterAudioHeadphones'] = {
        label      : 'Audio Master: Set Headphones',
        description: 'Set the Audio to Headphones state on a Master channel',
        options    : [
            {
                type        : 'dropdown',
                label       : 'Master',
                id          : 'master',
                tooltip     : 'Select the Input to control.',
                choices     : self.masterAudioChoices
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'audioHeadphoneAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 0, label: 'Headphone Off' },
                    { id: 1, label: 'Headphone On' }
                ]
            }
        ]
    }

    actions['controlRecord'] = {
        label      : 'Control Recording',
        description: 'Start or Stop Recording',
        options    : [
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'recordAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 'startRecord', label: 'Start Recording' },
                    { id: 'stopRecord', label: 'Stop Recording' }
                ]
            }
        ]
    }

    actions['controlStream'] = {
        label      : 'Control Streaming',
        description: 'Start or Stop Streaming',
        options    : [
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'streamAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 'startStream', label: 'Start Streaming' },
                    { id: 'stopStream', label: 'Stop Streaming' }
                ]
            }
        ]
    }

    return actions; 
  
}



// ###########################
// #### Implement Actions ####
// ###########################

exports.executeAction = function (action) {
    var self = this;
    var cmd;
    var options = action.options;

    // Parse Command 
    if (options !== undefined || options !== '') {

        switch (action.action) {

            // Set Preview Source
            case 'setPreviewSrc':
                cmd = `SPrI:${parseInt(options.input)}`;
                break;
            
            // Set Program Source                
            case 'setProgramSrc':
                cmd = `SPmI:${parseInt(options.input)}`;
                break;

            //Control GFX stacks
            case 'controlGFX':
                switch (options.gfxAction) {
                    case 'push':
                        cmd = `RGMOS:${parseInt(options.gfx)}`;
                        break;
                    
                    case 'pull':
                        cmd = `RGMOH:${parseInt(options.gfx)}`;
                        break;
                    
                    case 'previewShow':
                        cmd = `RGPvS:${parseInt(options.gfx)}`;
                        break;

                    case 'previewHide': 
                        cmd = `RGMPvH:${parseInt(options.gfx)}`;
                        break;
                }
                break;
            
            //Control Media
            case 'controlMedia':
                if (options.mediaAction === 'playFull') {
                    cmd = `RMFP:${options.media}`;
                } else if (options.mediaAction === 'playInOut') {
                    cmd = `RMIOP:${options.media}`;
                } else if (options.mediaAction === 'pause') {
                    cmd = `RMPause:${options.media}`;
                }
                break;

            //Cut Transition
            case 'transitionCut':
                cmd = 'RCut'
                break;
            
            //Auto Transition
            case 'transitionAuto':
                cmd = 'RAuto'
                break;

            //Fade to Black
            case 'fadeToBlack':
                if (options.action === 'fadeIn') {
                    cmd = 'RFIn';
                } else if (options.action === 'fadeOut') {
                    cmd = 'RFOut';
                }
                break;

            //Audio Volume Level
            case 'setAudioVolume':
                cmd = `SIVL:${parseInt(options.input)}:${parseInt(options.volume)}`
                break;

            //Audio Volume Level by Increment
            case 'setAudioVolumeIncrement':
                cmd = `IVL:${parseInt(options.input)}:${parseInt(options.increment)}`
                break;

            //Audio Gain
            case 'setAudioGain':
                cmd = `SIGL:${parseInt(options.input)}:${parseInt(options.gain)}`
                break; 

            //Audio Mute
            case 'inputAudioMute':
                cmd = `IAM:${parseInt(options.input)}:${options.muteAction}` 
                break;

            //Audio on Program  0=off  1=always on  2=source in pgm
            case 'inputAudioOnPgm':
                cmd = `IAP:${parseInt(options.input)}:${options.audioOnPgmAction}`
                break;

            //Audio headphones
            case 'inputAudioHeadphones':
                cmd = `IAH:${parseInt(options.input)}:${options.audioHeadphoneAction}`
                break;

            //Master Volume Stream or Record
            case 'setMasterVolume':
                if (options.master === 'str') {
                    cmd = `SSVL:${parseInt(options.volume)}`;
                } else if (options.master === 'rec') {
                    cmd = `SRVL:${parseInt(options.volume)}`;
                }
                break;

            // Master Volume Increment Stream or Record
            case 'setMasterVolumeIncrement':
                if (options.master === 'str') {
                    cmd = `SVL:${parseInt(options.increment)}`;
                } else if (options.master === 'rec') {
                    cmd = `RVL:${parseInt(options.increment)}`;
                }
                break;

            // Master Audio Mute Stream or Record
            case 'masterAudioMute':
                if (options.master === 'str') {
                    cmd = `SM:${parseInt(options.muteAction)}`;
                } else if (options.master === 'rec') {
                    cmd = `RM:${parseInt(options.muteAction)}`;
                }
                break;

            // Master Audio Headphones Stream or Record
            case 'masterAudioHeadphones':
                if (options.master === 'str') {
                    cmd = `SH:${parseInt(options.audioHeadphoneAction)}`;
                } else if (options.master === 'rec') {
                    cmd = `RH:${parseInt(options.audioHeadphoneAction)}`;
                }
                break;

            //Recoding
            case 'controlRecord':
                if (options.recordAction === 'startRecord') {
                    cmd = 'RecStart'
                } else if (options.recordAction === 'stopRecord') {
                    cmd = 'RecStop'
                }
                break;

            //Streaming
            case 'controlStream':
                if (options.streamAction === 'startStream') {
                    cmd = 'StrStart'
                } else if (options.streamAction === 'stopStream') {
                    cmd = 'StrStop'
                }
                break;

            // Log error message if the action sent over doesn't exist
            default:
                self.log('error', `[Livestream Studio] Action not found: ${action.toString()}`)
                break;

        }

        console.log(self.data);
    } else {
        self.log('error', '[Livestream Studio] Options not defined in command options')
    }

    // Send the command 
    if (cmd !== undefined) {
        self.sendCommand(`${cmd}\n`);
        cmd = ''
    }
    else {
        self.log('error', `[Livestream Studio] Invalid command: ${cmd}`);
    }
    
}
