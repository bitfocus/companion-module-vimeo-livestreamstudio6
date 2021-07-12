// actions.js
// Companion module for Livestream Studio 6

// ########################
// #### Define Actions ####
// ########################

// Define actions
exports.getActions = function () {
    var self = this;
    var actions = {};

    actions['setPreviewSrc'] = {
        label: 'Set Preview Source',
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
        // callback: function (action, bank) {
        //     var opt = action.options;
        //     self.sendCommand(`SET sample_action: ${opt.text}`);
        //}
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

            case 'setPreviewSrc':
                cmd = 'SPrI:' + options.input + '\n'
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