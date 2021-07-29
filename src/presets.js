// presets.js
// Companion module for Livestream Studio 6


// ########################
// #### Define Presets ####
// ########################

exports.initPresets = function () {
    var self = this;
    self.log('debug', '[Livestream Studio] Setting preset definitions')
    
    var presets = [];
  
 presets.push({
        category: 'Commands',
        label   : 'setPreviewSource',
        bank    : {
            style  : 'text',
            text   : 'PVW\n1',
            size   : 'auto',
            color  : '16777215',
            bgcolor: self.rgb(0,102,102)
        },
        actions: [{
            action : 'setPreviewSrc',
            options: {
                input: [0]
            }
        }],
        feedbacks: [/* {
            type: 'slotIsRecording',
            options: {
                slot: 0
            },
            style : {
                bgcolor: self.rgb(200,0,0)
            }
        },
        {
            type: 'slotIsStopped',
            options: {
                slot: 0
            },
            style : {
                bgcolor: self.rgb(0,102,102)
            }
        } */]
    });
  
  return presets;
  //this.setPresetDefinitions(presets)

  }
