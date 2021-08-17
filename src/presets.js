// presets.js
// Companion module for Livestream Studio 6


// ########################
// #### Define Presets ####
// ########################

exports.initPresets = function () {
    var self = this;
    self.log('info', '[Livestream Studio] Setting preset definitions')
    
    var presets = [];
  
    presets.push({
        category: 'Pgm/Pvw Bus',
        label   : 'setPreviewSource',
        bank    : {
            style  : 'text',
            text   : 'PVW\\n' + self.data.inputs[0].label.toString(),
            size   : 'auto'
        },
        actions: [{
            action : 'setPreviewSrc',
            options: {
                input: [0]
            }
        }],
        feedbacks: [{
            type: 'previewSource',
            options: {
                input: 0
            },
            style : {
                color  : self.rgb(255,255,255),
                bgcolor: self.rgb(0, 175, 0)
            }
        },
        {
            type: 'programSource',
            options: {
                input: 0
            },
            style : {
                color  : self.rgb(255,255,255),
                bgcolor: self.rgb(200, 0, 0)
            }
        }]
    });


    for (let i = 0; i <= 2; i++) {
    
        presets.push({
            category: 'GFX',
            label   : `pushGFX${i}`,
            bank    : {
                style  : 'text',
                text   : `GFX-${i + 1}`,
                size   : '14',
            alignment: 'center:bottom',
                png64  : self.ICON_PUSH_COLOR
            },
            actions: [{
                action : 'controlGFX',
                options: {
                    gfx      : [i],
                    gfxAction: 'push'
                }
            }],
            feedbacks: [{
                type: 'gfxPushed',
                options: {
                    gfx: [i]
                },
                style : {
                    png64 : self.ICON_PUSH
                }
            }]
        });

    }


return presets;
  //this.setPresetDefinitions(presets)

}
