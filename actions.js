// actions.js
// Companion module for Livestream Studio 6

const { Braket } = require("aws-sdk");

// ########################
// #### Define Actions ####
// ########################

// Define actions
exports.getActions = function () {
    var self = this;
    var actions = {};

    actions['setPreviewSrc'] = {
        label: 'Set Preview Bus Source',
        options: [
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

    actions['setProgramSrc'] = {
        label: 'Set Program Bus Source',
        options: [
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

    actions['controlGFX'] = {
        label: 'Control GFX Sources',
        options: [
            {
                type        : 'dropdown',
                label       : 'GFX Source',
                id          : 'gfx',
                tooltip     : 'Select the GFX stack to control.',
                default     : [ 0 ],
                choices     : [
                    { id: 0, label: 'GFX-1' },
                    { id: 1, label: 'GFX-2' },
                    { id: 2, label: 'GFX-3' }
                ]
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'gfxAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 'push', label: 'Push' },
                    { id: 'pull', label: 'Pull' },
                    { id: 'preview', label: 'Preview' }
                ]
            }
        ]
    }

    actions['controlMedia'] = {
        label: 'Control Media Sources',
        options: [
            {
                type        : 'dropdown',
                label       : 'Media Player Source',
                id          : 'media',
                tooltip     : 'Select the Media Player to control.',
                choices     : []
            },
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'mediaAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 'play', label: 'Play' },
                    { id: 'pause', label: 'Pause' }
                ]
            }
        ]
    }

    actions['transitionCut'] = {
        label: 'Cut Transition',
        options: [
            {
                type        : 'text',
                label       : 'No options for this action.',
                id          : 'cut'
            }
        ]
    }

    actions['transitionAuto'] = {
        label: 'Auto Transition',
        options: [
            {
                type        : 'text',
                label       : 'No options for this action.',
                id          : 'auto'
            }
        ]
    }

    actions['fadeToBlack'] = {
        label: 'Fade to Black',
        options: [
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
        label: 'Set input audio volume',
        options: [
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
                label   : 'Enter the volume level (-60000 to 10000)',
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

    actions['setAudioGain'] = {
        label: 'Set input audio gain',
        options: [
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
                label   : 'Enter gain level (0 to 10000)',
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
        label: 'Set input audio mute',
        options: [
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
        label: 'Set input audio to program',
        options: [
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
                    { id: 'always', label: 'Always On (Audio button RED)' },
                    { id: 'sourceInPgm', label: 'On when source in Program (Audio button YELLOW)' },
                    { id: 'off', label: 'Audio Off (Audio Button Off)' }
                ]
            }
        ]
    }

    actions['inputAudioHeadphones'] = {
        label: 'Set input audio Headphones',
        options: [
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
                    { id: 'on', label: 'Headphone On' },
                    { id: 'off', label: 'Headphone Off' }
                ]
            }
        ]
    }

    actions['controlRecord'] = {
        label: 'Control Recording',
        options: [
            {
                type   : 'dropdown',
                label  : 'Action',
                id     : 'recordAction',
                tooltip: 'Select the action to perform.',
                choices: [
                    { id: 'startRecording', label: 'Start Recording' },
                    { id: 'stopRecording', label: 'Stop Recording' }
                ]
            }
        ]
    }

    actions['controlStream'] = {
        label: 'Control Streaming',
        options: [
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


exports.executeAction = function (action) {
    var self = this;
    var cmd;
    var options = action.options;

    // Parse Command 
    if (options !== undefined || options !== '') {

        switch (action.action) {

            // Set Preview Source
            case 'setPreviewSrc':
                cmd = 'SPrI:' + options.input + '\n'
                break;
            
            // Set Program Source                
            case 'setProgramSrc':
                cmd = 'SPmI:' + options.input + '\n'
                break;

            //Control GFX stacks
            case 'controlGFX':

                break;
            
            //Control Media
            case 'controlMedia':

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
                cmd = 'SIVL:' + parseInt(options.input) + ':' + parseInt(options.volume) + '\n'
                break;

            //Audio Gain
            case 'setAudioGain':
                cmd = 'SIGL:' + parseInt(options.input) + ':' + parseInt(options.gain) + '\n'
                break; 

            //Audio Mute
            case 'inputAudioMute':
                if (options.muteAction === 'on') {
                    cmd = 'IAM:' + parseInt(options.input) + ':1'
                } else if (options.muteAction === 'off') {
                    cmd = 'IAM:' + parseInt(options.input) + ':0'
                }
                break;

            //Audio on Program
            case 'inputAudioOnPgm':
                if (options.audioOnPgmAction === 'always') {
                    cmd = 'IAP:' + parseInt(options.input) + ':1'
                } else if (options.audioOnPgmAction === 'sourceInPgm') {
                    cmd = 'IAP:' + parseInt(options.input) + ':2'
                } else if (options.audioOnPgmAction === 'off') {
                    cmd = 'IAP:' + parseInt(options.input) + ':0'
                }
                break;

            //Audio headphones
            case 'inputAudioHeadphones':
                if (options.audioHeadphoneAction === 'on') {
                    cmd = 'IAH:' + parseInt(options.input) + ':1'
                } else if (options.audioHeadphoneAction === 'off') {
                    cmd = 'IAH:' + parseInt(options.input) + ':0'
                }
                break;

            //Recoding
            case 'controlRecord':
                if (options.recordAction === 'startRecording') {
                    cmd = 'RecStart'
                } else if (options.recordAction === 'stopRecording') {
                    cmd = 'RecStop'
                }
                break;

            //Streaming
            case 'controlStream':
                if (options.streamAction === 'startStream') {
                    cmd = 'StrStart'
                } else if (options.recordAction === 'stopStream') {
                    cmd = 'StrStop'
                }
                break;

        }

        console.log(self.data);
    } else {
        self.log('error', '[Livestream Studio] Options not defined in command options')
    }

    // Send the command 
    if (cmd !== undefined) {
        self.sendCommand(cmd);
        cmd = ''
    }
    else {
        self.log('error', '[Livestream Studio] Invalid command: ' + cmd);
    }


}