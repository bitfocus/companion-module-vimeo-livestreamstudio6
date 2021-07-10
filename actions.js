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
    }

    return actions; 
  
}

exports.executeAction = function (action) {


}