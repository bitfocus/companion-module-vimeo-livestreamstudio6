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


    return feedbacks;
   
}

// ###########################
// #### Execute Feedbacks ####
// ###########################

exports.executeFeedback = function (feedback, bank) {


}