// actions.js
// Companion module for Livestream Studio 6

// ########################
// #### Define Actions ####
// ########################

// Define actions
instance.prototype.initActions = function () {
    var self = this;
    var actions = {};

    actions['startRecordingSlot'] = {
        label: 'Start Recording Slot',
        options: [
            {
                type        : 'multiselect',
                label       : 'Select Slot [1-16, or All]',
                id          : 'slot',
                tooltip     : 'Select the slot to start recording, or select All Coonected Slots. \r\n(Minimum selection is 1 item, add one item to remove the first item.)',
                default     : [ 0 ],
                choices     : self.CHOICES_SLOT,
                minSelection: 1
            }
        ]
        // callback: function (action, bank) {
        //     var opt = action.options;
        //     self.sendCommand(`SET sample_action: ${opt.text}`);
        //}
    },


    self.setActions(actions);
}

// Carry out the actions of a button press
instance.prototype.action = function (action) {
    var self = this;
    var cmd;
    var options = action.options;

    // Parse Command 
    if (options.slot !== undefined || options.slot !== '') {

        switch (action.action) {

            case 'refreshStatus':
                cmd = '<status slot="0" uid="' + Date.now() + '" />\r\n'
                break;
        }

    } else {
        self.log('error', '[Livemind Recorder] Slot not defined in command options')
    }

    // Send the command 
    if (cmd !== undefined) {
        self.sendCommand(cmd);
        cmd = ''
    }
    else {
        self.log('error', '[Livemind Recorder] Invalid command: ' + cmd);
    }

};

// Send command
instance.prototype.sendCommand = function (cmd) {
    var self = this;

    if (cmd !== undefined && cmd != '') {
        if (self.socket !== undefined){ //} && self.socket.connected) {
            if (self.config.verbose) { self.log('debug', '[Livemind Recorder] Sending Command: ' + cmd) }
            try {
                self.socket.send(cmd);
            }
            catch (err) {
                self.log('error', '[Livemind Recorder] Error sending command: ' + err.message)
            }
        } else {
            self.log('error', '[Livemind Recorder] Empty or undefined command in sendCommand')
        }
    }
}