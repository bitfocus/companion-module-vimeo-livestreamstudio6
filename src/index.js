// Index.js
// companion-module-livesteam-studio v1.0.0
// GitHub: https://github.com/bitfocus/companion-module-vimeo-livestreamstudio6

const tcp                                = require('../../../tcp');
const instance_skel                      = require('../../../instance_skel');
const { executeAction, initActions }     = require('./actions')
const { getConfigFields }                = require('./config')
const { executeFeedback, initFeedbacks } = require('./feedback')
const { initVariables }                  = require('./variables')
const { initPresets }                    = require('./presets')
const  _ = require('underscore');

var debug = debug;
var log = log;

// ########################
// #### Instance setup ####
// ########################

function instance(system, id, config) {
    var self = this;

    // super-constructor
    instance_skel.apply(this, arguments);

    self.data = {
        startup       : true,
        connected     : false,
        numberOfInputs: 0,
        inputs        : [
            { id: 0, label: '', audioVolume: 0, audioGain: 0, audioMute: 0, audioHeadphones: 0, audioToPgm: 0, type: 0, media: null }
        ],
        program       : null,
        preview       : null,
        gfx           : [
            { id: 0, label: 'GFX-1', state: 'off', canPush: false, preview: false, pushed: false, pulled: false },
            { id: 1, label: 'GFX-2', state: 'off', canPush: false, preview: false, pushed: false, pulled: false },
            { id: 2, label: 'GFX-3', state: 'off', canPush: false, preview: false, pushed: false, pulled: false }
        ],
        media         : [
        
        ],
        streamMaster: {
            level: 0, mute: false, headphones: false
        },
        recordMaster: {
             level: 0, mute: false, headphones: false
        },
        status: {
            fadeToBlack: false,
            recording  : false,
            streaming  : false,
        }
    };

    self.refreshConfigBool = false;
    self.refreshConfigIteration = 0;

    // Define icons
    self.ICON_SPEAKER_ON     = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAES0lEQVR4nO2baUrkQBTH32irqKjtDi7giuKGI4r6aXr0k9/mCHqBjB5hTjCQC8zcYMYbiAqCKLggqLgggjvabriiw79INZVKdxudJB1N/SB2m6rwXv79XuVVJSGFQqFQvC8+xfNW1/UaIvpORJ0B+T2jRDSuadrveI0WkXRd/0lEo5645j8WiGhE07SFhCLpuv6LiIbx/fHxkfb29tjnR6ewsJBtBoiqr6JQIUGgUS4QxFlbWwuEQJyysjJqbW2lUCgUJiIEy2felib0wxhEZ2dntLKyEiiBwNHRETtvg05d14f5P0wkXdcjRITBmkVQUIFQl5eX/Oy/mETiVzFEj9ApkBwfH/PTrpFFQh4GXqBEpL3tsGChRLKBEskGSiQbKJFs4AuRsrOzk7bzaUMoFErazy1SY1WgoqKCbXNzcwn7QKD6+npWx+3s7NDW1pZr/jw/P1v2heQOT09PrjkgU1lZyeZLp6entuwikiAWIm95edkzPy2RFE9JN4BAbW1ttuzKbYi88/NzFlVO45tIys/Pp/b2dtt2kV7o09jYGNvX0NBA29vbjvv2okjAbZEKCgqot7fXsp/bLS4upv7+frq5uWGz8oODA7q/v2cTb6RZVVUV65eRkcGicXd311H/4olkubqhk1tbXl4e9fX1sRNMZpeMK153dze1tLTE9q+urpqOKS8vd8VXGdfSrbm5mZqammz1Fe3KTtbV1dH+/j6dnJzQ9fU1+ywpKWFtSFsvhgdXI+k18GMgBEQRqa6ujrVDJE5OTs77jqTXiCTavbq6opmZGRocHGTjFxnjGG/H+CSSnp5ODw8PjvicyG/XBu7XRpJsFxHFRULEJBIJY9fd3d1/+8uxJZJTddJb0o1TWlrKaiFONBo1DegiWJN3Et9V3PHs4q5FJBIxtaMe4u2IKhEv/HUtklAAHh4emvaFw2Hq6uqK25/ble0jUsS5GkTkYOHe6RmCp5GE9XJ5zZwXhqiVEtkV7UPkycnJ2D6UA7m5uaZ2pyPJFxX3xsYGcwRVdTy7uLotLS2xSlocb4qKiixRuLm5mRqRvJjgQiikDWb0sl1E3+Lioqk/+qH6zszMjO2DQG7c3fHVwD09Pc3sYaL6kl2kmCgQUnZ2dtYzXz1PN5GpqSl28tiS2RV/Xaw94bjb21tXfLIVSV6tJ3EwMGPhLZndi4sLtnaEDanqJr4YuGUQEfPz80n7rK+vs80LfDNw+xnfVtx+wpfp9h5Q6SZha/lWYcUkkliwKayRNIE/WDvOysoKtDy4WSHDRYo9jtvR0ZEi91IPBMINDINx/oWJpGkanl1mT8P39PSIHQMDMmhoaIifb0wPkq5uY0T0DWtjAwMDbPkUSxbi3YmPCMSpra1lwSGk2pgROAz5jQA8hftHfPI0gIzI75iYrm7GqwJ4Ev6HEXJB4q/xuoTlJZy4bylJkRX+6EppmjbhAzcUCoVC4QhE9A+xanO+citviwAAAABJRU5ErkJggg==';
    self.ICON_SPEAKER_OFF    = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAACzElEQVR4nO2bvaoaQRiGXzWKKMqxsfAHoiA2ol5CgiLpcgtJeapzC7mDXELSmS6kE7HYNBKrpLYxjaigJqiIP6jhW5zDuupxDYfZWWcemOO4zLIz777f586cWSgUCoXCWbgu9LYI4E6Ce6pdewKJ8gHAHwA7icpXAK+sCETO6Ugmjrm8M4tiDLe7vUB6eCWTSaTTaYTD4Wud6CjW6zX6/T7a7Tbm8znr+nsAn0+J9ImpWCwWdZFkgsRqNpuYTCY06r8AUvtPeAwu+kKVbDarO0g2PB4PotEoOh0KJvgBDAD8oC9uQy7SSaVS0gnECAQCxgh6yypMJD2rU/7xer02dVEMSCgzbuN32QU6h/v/TpMLJZIFlEgWUCJZQIlkAUeIFIvFbL3+C/OB3W5nT0/OkMvl4Pf70e12uVzv1PiFFokEIheNx2Nu/booEjXYbrdcOnOJfD6PeDz+2IpXvyw5SQSREonEgUB237wjJ9kdbiRQoVA4Oi5MuIGjk0wzbh2aO55bphEq3HjdMfrForUrK/B0uFCJ+9pBC5OTYLOtn2orTLjZbevnbP+c/XKEkyBr4r5m0NIm7sFggGq1enCMHgFKpRIikchRe/XEvWe5XKLRaKBcLh8IZfcT98FSCbO1nYWE0jQNq9UKdvXNjJBzt+l0inq9jkqlAp/Px7Vfp0Q6WnQTwU1URqMRarWa7ije1zYj7FIJQUK1Wi1kMhmVuJ+CdnsMh0O1VHIJchQvHOkk3iiRLCDUBFdUhJq7OQn1H1wLMJH0vYE0JVAcw0T6RX82m430Qs1mM1b9zSpMJI25iZYwZIUEWiwWbPTfWcVj0IMs9Ia26lIJBoNwuS69VXE7kEC9Xo/9cFFk3bPBmVV43MtNC2ChUAhu9+3ndtrkbtjoThH1mqWgc3yU+JWJn8bt2oxz8fQSwMOpE24Ucs8346sSCoVCoXAqAP4BJ5GXt9prjf0AAAAASUVORK5CYII=';
    self.ICON_HEADPHONES_ON  = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAEdklEQVR4nO1b107kSBQ9i5ochchJZBAg2BUgJHhglx+YmT9YfsD/sF+wUv/AzB8s88ADT7sSIBASIufUILIIQxJRsDo1Lo/bWI1n2nYz2Eey2uWuur51fCpdu+DDhw8fPn4u/GLmbTAY/BPAOwC/A8jywDP9D8BnAJ8URfli/DOMpGAwSEL+BfCrqy6+HoQAfFAUZVLvkUaSkaCHhwecnJzg8vLyTbOSlJSEvLw8BAIBeYlK+kNPVECX/29J0OHhIebm5gRRXgDrWldXh7KyMqjdyz8AKmTV4/BVReUA2A/h4uICU1NTniFIYmlpCbu7uzJZrvbLAnHq73t9Zq+CddeJ452RpBZ54fT01LMkkSC2JBXaqC5JYnPzNEGREPfjRb0DnyQLCBizPD09vUY/Y4owkkiQ10kyq/8zJT0+PrrlTxgyMjIQHx+vXTo+Po6JH2aIqZJKSkqQn58vDjOcn59je3tbHG5Nbl+NkgoKCtDY2Ijk5OSI+aiuhoYG1NTUYGNjA8vLy477ZgZXO24uIpuamlBaWqpdY7Pa2toSquFBkLzMzExBJvOyGdbW1or02NgYrq+vHfPR1G99ggQ5pSRWtLOzU1SeODs7w+zsLI6Ojp7lvbq6EgfXUouLi4LYwsJCoazu7m4MDw+L8k4gps2tq6tLI4jKGR8ft1SOoZrR0VGxQm9tbRVk09bAwADu7+8d8dUIVzru5uZmjaDp6Wmsrq5+t43NzU3hW1tbmyCqo6MDg4ODtvsaEyXl5uaiurpanIdCoag6X5YnQS0tLcJuVVUVVlZWbPTWHM+WJVJNdh0cnaD2M5OTk1HbJck7OzvCJm1zMLDTXzM42nEzLMonTrCTvr29tcXuxMQEiouLhaqoUkYW7YLrza28XERghIrW19dts8uYD+dNFRUV4piZmbHNthkc7bj5tAkO43YPCAsLC4Kg1NRUZGVl2RYLc1VJXGokJCSIcw750i47W1YMqsLW1tYi2klLS0NlZaWWpiI5LeCbnLu7O3EPNmkn13qOkcT+COo8RxcSFRWWa7WDg4MXR6eUlBQxhZDY39/XZuYszxk57c3Pz9vitxkca25yRU+S9DaN5y/dz/jQmJZlqB65bLHLb1ebW3Z2tvjlk49k86X7GZ3Wj8BSobyXkwtzx5TEp0xbbBrRKMmMJL2S9vb2TPP9KFxV0sjIiKV80SiJi+P+/v4ovLSGmEcmoyHJLbgembSz43baPwnXlaSPH/H8pfvd3Nzo39GLdEyVBBdeKQ0NDX1XfhLZ19fnmD9W4L+ctACfJAvwSbIAnyQL8EmyAEmS+Cw3PT39NfsaM0iSpqCSlJiY6D0WdDATiiRJ+xxXH7vxGhjp1JH0OYwkRVH61A+90d7ejvr6es8RlJOTg56eHv0lbQarn3H3qh+7i8xFRUUi2M4Q6VsHFWRoQX8pihKSCeO2CX67/PHNsxIZ3F/Sq88RNgVQFOUTgN/UDSleg9xX0must+kuJXzbJfD1xdnbxxfjphsfPnz48PGzAsD/DyYR6FZfHkkAAAAASUVORK5CYII=';
    self.ICON_HEADPHONES_OFF = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAD90lEQVR4nO1b2U7cMBQ9s7BvI7EvQhQheGVeeYFPaL+g/ZV+SfsHbb+g7QuvVDwiQBUgdjHsO0x13NxRCGGSIY4zTHykKJvt2CfnXl87DiwsLCws3hYyAbWdBVBIwTv9VWsGkvIFQAlAOUUb2zwRhqDZFJLj3T55SXGbG1lcEvOamZnB0NAQuru7a1Xim8Ll5SV2d3exsrKCu7s7qfoHAN/9SPoJYKGpqQlzc3MNT44XJGhxcRGnp6e88xfAO0mSdfZU0QIPpqenU0cQQXEUi0U5nXCbnZD0XhJOTk4mUce6AMXhEsi8HAhJyg+lUUFeDA8Py5VKT5cNkzHtsCSFgCUpBPLeJOVyuR7raQx+7X9G0uPjYyO1uWYEksQEppWUy+XQ2tqKfD6PTCaj9gzs7u/vcX19jYeHB6P1qSslkZienh6196Ktra1y5fb2FmdnZzg/PzdSLz8YV1I2m8XAwMAzcqgaOC+JaeR+c3Mzent70dXVhcPDQ0VanEhcSWzwyMiIIoGgSZVKJVxcXPg+t729XamNypK8BwcHSllxIVGSWlpanhBEVRwfH1fNQxPj1tHRgcHBQZW3v79fNcQZiGpHYo6bznh0dFQ1ki9hc3OzJrMhUZzSGBsbU2TTXKlCKlA3ElOSKIhlb2xs4ObmpuYyJO/4+LgiinNd6+vrRnq/JxG3KEnnVigUVKOIvb095aBfWz4J2d7e/l9xl+np3ryIVUlsSF9fnzqms6WTjoqrqyvlvEkQnfr+/r57RjEyjJPERjBYJHZ2drSVTUVSoZz/IllbW1taykUSjpvxDcGe6DV+qBqOjo5Uj8f4SWedjSpJhhtwGqS7QxCS+BwSdXJyorV8N2JTEmMbgTsempqaQmdnpzpm1766ulq1HKZlHgHTMx+VSf/EQJMvIyjmCgujShIVsSHuMt2V4HHQ87z3eS7X2BmQJL4QXfU2ShKHEQTfeLUyg57nrbSbWAaUcEzbGEk6zU1IYlRcrcyg5/mRJNfYITBQ5RhPV72NKonxC50pTSKKuVVTEgNT6f6NKkknSWEQxSfR33EcGDeMz3F7lRTF3OKunyA2JYVFFHOLA3Uxfbu2tqamTuD0TkHPo09bXl6unDNGSpykuFHrXDWJ1BUovhb242QIWJJCwJIUApakELAkhcATktK+DgAvcCAk/YEzFtI5X/wW4frw+dtLElfEq2Ak7JirEcEPFS6RVP4SyDl7fojnKoUFfjRkQk6JpgmcseB6bhdBn+XE+2/JkvNXgPoSwa8d3HNrRND/0MVwFCALNhyLKjpruX3BVbjfUvzLxJLf/yUv/aXEhe8fnQyN/qeS+OMfAL7WQX0sLCwsLCIBwD/fItnwIMk6LgAAAABJRU5ErkJggg==';

    self.setActions(initActions.bind(self)()); // export actions
  
    return self;
}


// Return config fields for web config
instance.prototype.config_fields = function () {
    
    var self = this;
    return getConfigFields.bind(self)();

}

// Initalize module
instance.prototype.init = function () {
    var self = this;

    debug = self.debug;
    log = self.log;
    
    self.status(self.STATUS_UNKNOWN);
    self.setVariableDefinitions(initVariables.bind(self)());
    self.initTCP();
    

   // if (!self.refreshConfigBool && self.data.startup) { 
        _.defer(function(self){
            self.log('debug', '[Livestream Studio] Deferred functions running')
            self.setFeedbackDefinitions(initFeedbacks.bind(self)());
            
            self.setMediaInputs();
            
            self.setPresetDefinitions(initPresets.bind(self)());
        
            self.setActions(initActions.bind(self)()); 
            self.data.startup = false;
        },self)
        
    //}
}

// Initialize TCP connection
instance.prototype.initTCP = function () {
    var self = this;
    var receiveBuffer = '';

    if (self.socket !== undefined) {
        self.log('warn', '[Livestream Studio] Killing existing socket connections');
        self.socket.destroy();
        self.setVariable('status', 'Not Connected');
        self.data.connected = false;
        delete self.socket;
    }

    if (self.config.port === undefined) {
        self.config.port = 9923;
    }

    if (self.config.host) {
        self.socket = new tcp(self.config.host, self.config.port);
      
        self.socket.on('status_change', function (status, message) {
            self.status(status, message);
        });

        self.socket.on('error', function (err) {
            self.debug('Network error', err);
            self.setVariable('status', 'Error');
            self.data.connected = false;
            self.log('error', '[Livestream Studio] TCP Socket error: ' + err.message);
        });

        self.socket.on('connect', function () {
            self.debug('Connected');
            self.setVariable('status', 'Connected');
            self.data.connected = true;
            self.log('info', '[Livestream Studio] Connected to Livestream Studio at IP ' + self.config.host + ' on port ' + self.config.port);
        });
        
        // separate buffered stream into lines with responses
		self.socket.on('data', function (chunk) {
			var i = 0,
		        line = '',
				offset = 0
			receiveBuffer += chunk

			while ((i = receiveBuffer.indexOf('\n', offset)) !== -1) {
				line = receiveBuffer.substr(offset, i - offset)
				offset = i + 1
				self.socket.emit('receiveline', line.toString())
			}

			receiveBuffer = receiveBuffer.substr(offset)
		});
        
		self.socket.on('receiveline', function (line) {
			if (line !== undefined || line !== '') {
			    
                // If verbose send received string to the log, except in the case of TrMSp & AVC
                // both of which return large amounts of data that would be excessive for the log
                if (self.config.verbose &&
                    !line.startsWith('TrMSp') &&
                    !line.startsWith('TrASp') &&
                    !line.startsWith('AVC') 
                    ) { self.log('debug', '[Livestream Studio] Data received: ' + line) }

               self.parseIncomingAPI(line);

			} else {
				self.log('error', '[Livestream Studio] Data received was undefined or null')
			}
		});
	}
}

// When module gets deleted
instance.prototype.destroy = function () {
    var self = this;

    if (self.socket !== undefined) {
        self.setVariable('status', 'Not Connected')
        self.data.connected = false;
        self.socket.destroy()
    }

    self.debug('[Livestream Studio] Destroy', self.id);
}


// Carry out the actions of a button press
instance.prototype.action = function (action) {

    executeAction.bind(this)(action);

};


// Update module after a config change
instance.prototype.updateConfig = function (config) {
    var self = this;
    var resetConnection = false;

    // check if host IP has updated
    if (self.config.host !== config.host) {
        resetConnection = true;
    }

    // check if host Port has updated
    if (self.config.port !== config.port) {
        resetConnection = true;
    }

    // save new config
    self.config = config;
    self.log('info', '[Livestream Studio] Updated Config Saved.')

    if (resetConnection === true || self.socket === undefined) {
        self.log('warn', '[Livestream Studio] Update Config: Reinitializing socket');
        self.initTCP();
    }

    self.log('warn', '[Livestream Studio] Update Config: Reinitializing actions, variables, and feedbacks');
   
    // self.setVariableDefinitions(initVariables.bind(self)());
    // self.setMediaInputs();
    // self.setFeedbackDefinitions(initFeedbacks.bind(self)());
    // self.setPresetDefinitions(initPresets.bind(self)());
    // self.setActions(initActions.bind(self)());

    self.refreshConfig()
}


// Send command
instance.prototype.sendCommand = function (cmd) {
    var self = this;

    if (cmd !== undefined && cmd != '') {
        if (self.socket !== undefined){ //} && self.socket.connected) {
            if (self.config.verbose) { self.log('debug', '[Livestream Studio] Sending Command: ' + cmd) }
            try {
                self.socket.send(cmd);
            }
            catch (err) {
                self.log('error', '[Livestream Studio] Error sending command: ' + err.message)
            }
        } else {
            self.log('error', '[Livestream Studio] Empty or undefined command in sendCommand')
        }
    }
}


// Refresh Companion configuration to setup inputs in actions/presets/variables
instance.prototype.refreshConfig = function () {
    var self = this;
    self.log('debug', '[Livestream Studio] Refreshing config, actions, variables, and presets')

    self.setMediaInputs();
    self.setActions(initActions.bind(self)());
    self.setVariableDefinitions(initVariables.bind(self)());
    self.setFeedbackDefinitions(initFeedbacks.bind(self)());
    self.setPresetDefinitions(initPresets.bind(self)());
    self.refreshConfigBool = false;
};

instance.prototype.setMediaInputs = function () {
    var self = this;
    self.log('info', '[Livestream Studio] Setting Media Inputs');

    self.data.media = [];

    let mediaInputs = self.data.inputs.filter(input => input.type === 3, self);
     mediaInputs.forEach(function (m) {
         self.data.media.push({ id: m.id, label: m.label, media: null});
     });
}


// Deal with incoming data
instance.prototype.parseIncomingAPI = function (apiData) {
    var self = this;
    var mediaElement; 
    const apiDataArr = apiData.trim().split(/:/);
    
    if (apiData !== undefined || apiData !== '') {

        switch (apiDataArr[0]) {
            
            // Inputs -----------------------------------------------
            // Number of Inputs  ILCC:%1
            case 'ILCC':
                self.data.numberOfInputs = parseInt(apiDataArr[1])

                break;

            // Inputs  ILC:%1:%2:%3:%4:%5:%6:%7:%8
            case 'ILC':
                self.data.inputs[apiDataArr[1]] = { 
                    id             : parseInt(apiDataArr[1]),
                    label          : (parseInt(apiDataArr[1]) + 1).toString() + ': ' + apiDataArr[2].slice(1,-1), //.replace(/[^a-z0-9-_.]+/gi, ''),
                    audioVolume    : parseInt(apiDataArr[3]),
                    audioGain      : parseInt(apiDataArr[4]),
                    audioMute      : parseInt(apiDataArr[5]),
                    audioHeadphones: parseInt(apiDataArr[6]),
                    audioToPgm     : parseInt(apiDataArr[7]),
                    type           : parseInt(apiDataArr[8])
                }
                self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_name`, apiDataArr[2].slice(1,-1))
                self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_volume`, parseInt(apiDataArr[3]))
                self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_gain`, parseInt(apiDataArr[4]))

                // When the API has finished dumping all of the input details, refresh 
                // the config variables, feedbacks, and actions so they are aware of new inputs
                self.refreshConfigIteration++;
                if (self.refreshConfigIteration === self.data.numberOfInputs) {
                    self.refreshConfigBool = true;
                    self.refreshConfig();
                }
                break;

            // Input Name Change INC:%1:%2
            case 'INC':
                self.data.inputs[parseInt(apiDataArr[1])].label = 
                    (parseInt(apiDataArr[1]) + 1).toString() + ': ' + apiDataArr[2].slice(1,-1)
                    self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_name`, apiDataArr[2].slice(1,-1))
                break;

            // Program Source PmIS:%1
            case 'PmIS':
                self.data.program = parseInt(apiDataArr[1])
                self.setVariable('pgmSource', parseInt(apiDataArr[1]))
                break;

            // Preview Source PwIS:%1
            case 'PwIS':
                self.data.preview = parseInt(apiDataArr[1])
                self.setVariable('pvwSource', parseInt(apiDataArr[1]))
                break;

            // Stream Master Fader ------------------------------------------
            // Stream Volume SVC:%1
            case 'SVC':
                self.data.streamMaster.level = parseInt(apiDataArr[1])
                self.setVariable('streamVolume', parseInt(apiDataArr[1]))
                break;
                
            // Stream Mute  SMC:%1
            case 'SMC':
                self.data.streamMaster.mute = parseInt(apiDataArr[1])
                break;

            // Stream Headphones  SSC:%1
            case 'SSC':
                self.data.streamMaster.headphones = parseInt(apiDataArr[1])
                break;

            // Record Master Fader ------------------------------------------
            // Record Volume  RVC:%1
            case 'RVC':
                self.data.recordMaster.level = parseInt(apiDataArr[1])
                self.setVariable('recordVolume', parseInt(apiDataArr[1]))
                break;

            // Record Mute  RMC:%1
            case 'RMC':
                self.data.recordMaster.mute = parseInt(apiDataArr[1])
                break;
            
            // Record Headphones  RSC:%1
            case 'RSC':
                self.data.recordMaster.headphones = parseInt(apiDataArr[1])
                break;

            // Transitions ---------------------------------------------------
            // Fade to Black not engaged  FIn
            case 'FIn':
                self.data.status.fadeToBlack = false
                break;

            // Fade to Black engaged  FOut
            case 'FOut':
                self.data.status.fadeToBlack = true
                break;
            
            // Streaming -----------------------------------------------------
            // Streaming Stopped  StrStopped
            case 'StrStopped':
                self.data.status.streaming = false
                self.setVariable('streaming', false)
                break;

            // Streaming Started   StrStarted
            case 'StrStarted':
                self.data.status.streaming = true
                self.setVariable('streaming', true)
                break;

            // Unknown API Response  StrSEr
            case 'StrSEr':
                self.log('error', '[Livestream Studio] Error Unknown API Responce - StrSEr - Please log this issue on GitHub')
                break;

            // Stream Starting or Stopping (indeterminate state) StrStarting StrStopping
            case 'StrStarting':
            case 'StrStopping':
                self.data.status.streaming = 'Transitioning'
                self.setVariable('streaming', 'transitioning')
                break;

            // Recording -----------------------------------------------------
            // Recording Stopped  RecStopped
            case 'RecStopped':
                self.data.status.recording = false
                self.setVariable('recording', false)
                break;

            // Recording Started   RecStarted
            case 'RecStarted':
                self.data.status.recording = true
                self.setVariable('recording', true)
                break;

            // Unknown API Response  RecSEr
            case 'RecSEr':
                self.log('error', '[Livestream Studio] Error Unknown API Responce - RecSEr - Please log this issue on GitHub')
                break;

            // Record Starting or Stopping (indeterminate state)  RecStarting RecStopping
            case 'RecStarting':
            case 'RecStopping':
                self.data.status.recording = 'Transitioning'
                self.setVariable('recording', 'transitioning')
                break;

            // GFX -----------------------------------------------------------
            // GFX Stack On State  GMOn:%1
            case 'GMOn':
                self.data.gfx[parseInt(apiDataArr[1])].state = 'On'
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_active`, true)
                break;

            // GFX Stack Off State  GMOff:%1
            case 'GMOff':
                self.data.gfx[parseInt(apiDataArr[1])].state = 'Off'
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_active`, false)
                break;

            // GFX In Preview GMPvS:%!:%2
            case 'GMPvS':
                self.data.gfx[parseInt(apiDataArr[1])].preview = true
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_preview`, true)
                break;
            
            // GFX NOT in Preview  GMPvH:%1:%2
            case 'GMPvH':
                self.data.gfx[parseInt(apiDataArr[1])].preview = false
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_preview`, false)
                break;

            // GFX is in Pushed State (Visible on PGM)  GMOS:%1:%2
            case 'GMOS':
                self.data.gfx[parseInt(apiDataArr[1])].pushed = true
                self.data.gfx[parseInt(apiDataArr[1])].pulled = false
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_state`, 'pushed')
                break;

            // GFX is in Pulled State (Not visible on PGM) GMOH:%1:%2
            case 'GMOH':
                self.data.gfx[parseInt(apiDataArr[1])].pulled = true
                self.data.gfx[parseInt(apiDataArr[1])].pushed = false
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_state`, 'pulled')
                break;

            // GFX stack can be pushed  0=No, 1=Flashing Push  GPA:%1:%2
            case 'GPA':
                if (parseInt(apiDataArr[2]) === 0) {
                    self.data.gfx[parseInt(apiDataArr[1])].canPush = false
                } else if (parseInt(apiDataArr[2]) === 1 ) {
                    self.data.gfx[parseInt(apiDataArr[1])].canPush = true
                }
                break;
            
            // Media Inputs -----------------------------------------------------
            // Media Player Playing In to Out   MIOP:%1
            case 'MIOP':
                mediaElement =  self.data.media.find(m => m.id === parseInt(apiDataArr[1]))
                mediaElement.media = 'playingInOut'
                self.setVariable(`media_${apiDataArr[1]}_state`, mediaElement.media)
                break;           
            
            // Media Player Playing Full Clip    MFP:%1
            case 'MFP':
                mediaElement =  self.data.media.find(m => m.id === parseInt(apiDataArr[1]))
                mediaElement.media = 'playingFull'
                self.setVariable(`media_${apiDataArr[1]}_state`, mediaElement.media)
                break;

            // Media Player Pause   MPause:%1
            case 'MPause':
                mediaElement =  self.data.media.find(m => m.id === parseInt(apiDataArr[1]))
                mediaElement.media = 'paused'
                self.setVariable(`media_${apiDataArr[1]}_state`, mediaElement.media)
                break;

            // Audio Faders -----------------------------------------------------
            // Audio to Program 0=off, 1=red, 2=yellow  AOC:%1:%2
            case 'AOC':
                self.data.inputs[parseInt(apiDataArr[1])].audioToPgm = parseInt(apiDataArr[2])
                break;

            // Audio Mute  0=Off, 1=On AMC:%1:%2  
            case 'AMC':
                self.data.inputs[parseInt(apiDataArr[1])].audioMute = parseInt(apiDataArr[2])
                break;

            // Audio Headphones  0=Off, 1=On  ASC:%1:%2  
            case 'ASC':
                self.data.inputs[parseInt(apiDataArr[1])].audioHeadphones = parseInt(apiDataArr[2])
                break;

            // Audio Fader Volume  -60000 to 10000  AVC:%!:%2   
            case 'AVC':
                self.data.inputs[parseInt(apiDataArr[1])].audioVolume = parseInt(apiDataArr[2])
                self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_volume`, parseInt(apiDataArr[2]))
                break;

            // Audio Gain  0 to 10000  AGC:%1:%2
            case 'AGC':
                self.data.inputs[parseInt(apiDataArr[1])].audioGain = parseInt(apiDataArr[2])
                self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_gain`, parseInt(apiDataArr[2]))
                break;

            // Ignored Data
            // We want to ignore these items from the API
            case 'TrASp':
            case 'TrMSp':
                // do nothing
                break;

            default:
                self.log('warn', 'API response undefined: ' + apiData)

        }

        // Clean up removed inputs from channel mixer
        // Object.keys(self.data.inputs).forEach((key) => {
        //     if (!self.data.inputs.map((input) => input.key).includes(key)) {
        //         delete self.data.inputs[key]
        //     }
        // })

    } else {
        self.log('error', '[Livestream Studio] No data received from socket')
    }
}


instance_skel.extendedBy(instance);
exports = module.exports = instance;
