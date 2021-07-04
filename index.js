// Index.js
// companion-module-livesteam-studio v1.0.0
// GitHub: https://github.com/ChgoChad/companion-module-livestream-studio

const tcp           = require('../../tcp');
const instance_skel = require('../../instance_skel');
const actions       = require('./actions.js');
const variables     = require('./variables.js');
const feedbacks     = require('./feedbacks.js');
const presets       = require('./presets.js');


// ########################
// #### Instance setup ####
// ########################

function instance(system, id, config) {
    var self = this;
    var debug;
    var log;
    // super-constructor
    instance_skel.apply(this, arguments);

    self.SLOTS = []
    self.CHOICES_SLOT = []
    self.CHOICES_SLOT_NOALL = []

    // Define icons
    self.ICON_SPEAKER_ON     = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAES0lEQVR4nO2baUrkQBTH32irqKjtDi7giuKGI4r6aXr0k9/mCHqBjB5hTjCQC8zcYMYbiAqCKLggqLgggjvabriiw79INZVKdxudJB1N/SB2m6rwXv79XuVVJSGFQqFQvC8+xfNW1/UaIvpORJ0B+T2jRDSuadrveI0WkXRd/0lEo5645j8WiGhE07SFhCLpuv6LiIbx/fHxkfb29tjnR6ewsJBtBoiqr6JQIUGgUS4QxFlbWwuEQJyysjJqbW2lUCgUJiIEy2felib0wxhEZ2dntLKyEiiBwNHRETtvg05d14f5P0wkXdcjRITBmkVQUIFQl5eX/Oy/mETiVzFEj9ApkBwfH/PTrpFFQh4GXqBEpL3tsGChRLKBEskGSiQbKJFs4AuRsrOzk7bzaUMoFErazy1SY1WgoqKCbXNzcwn7QKD6+npWx+3s7NDW1pZr/jw/P1v2heQOT09PrjkgU1lZyeZLp6entuwikiAWIm95edkzPy2RFE9JN4BAbW1ttuzKbYi88/NzFlVO45tIys/Pp/b2dtt2kV7o09jYGNvX0NBA29vbjvv2okjAbZEKCgqot7fXsp/bLS4upv7+frq5uWGz8oODA7q/v2cTb6RZVVUV65eRkcGicXd311H/4olkubqhk1tbXl4e9fX1sRNMZpeMK153dze1tLTE9q+urpqOKS8vd8VXGdfSrbm5mZqammz1Fe3KTtbV1dH+/j6dnJzQ9fU1+ywpKWFtSFsvhgdXI+k18GMgBEQRqa6ujrVDJE5OTs77jqTXiCTavbq6opmZGRocHGTjFxnjGG/H+CSSnp5ODw8PjvicyG/XBu7XRpJsFxHFRULEJBIJY9fd3d1/+8uxJZJTddJb0o1TWlrKaiFONBo1DegiWJN3Et9V3PHs4q5FJBIxtaMe4u2IKhEv/HUtklAAHh4emvaFw2Hq6uqK25/ble0jUsS5GkTkYOHe6RmCp5GE9XJ5zZwXhqiVEtkV7UPkycnJ2D6UA7m5uaZ2pyPJFxX3xsYGcwRVdTy7uLotLS2xSlocb4qKiixRuLm5mRqRvJjgQiikDWb0sl1E3+Lioqk/+qH6zszMjO2DQG7c3fHVwD09Pc3sYaL6kl2kmCgQUnZ2dtYzXz1PN5GpqSl28tiS2RV/Xaw94bjb21tXfLIVSV6tJ3EwMGPhLZndi4sLtnaEDanqJr4YuGUQEfPz80n7rK+vs80LfDNw+xnfVtx+wpfp9h5Q6SZha/lWYcUkkliwKayRNIE/WDvOysoKtDy4WSHDRYo9jtvR0ZEi91IPBMINDINx/oWJpGkanl1mT8P39PSIHQMDMmhoaIifb0wPkq5uY0T0DWtjAwMDbPkUSxbi3YmPCMSpra1lwSGk2pgROAz5jQA8hftHfPI0gIzI75iYrm7GqwJ4Ev6HEXJB4q/xuoTlJZy4bylJkRX+6EppmjbhAzcUCoVC4QhE9A+xanO+citviwAAAABJRU5ErkJggg==';
    self.ICON_SPEAKER_OFF    = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAACzElEQVR4nO2bvaoaQRiGXzWKKMqxsfAHoiA2ol5CgiLpcgtJeapzC7mDXELSmS6kE7HYNBKrpLYxjaigJqiIP6jhW5zDuupxDYfZWWcemOO4zLIz777f586cWSgUCoXCWbgu9LYI4E6Ce6pdewKJ8gHAHwA7icpXAK+sCETO6Ugmjrm8M4tiDLe7vUB6eCWTSaTTaYTD4Wud6CjW6zX6/T7a7Tbm8znr+nsAn0+J9ImpWCwWdZFkgsRqNpuYTCY06r8AUvtPeAwu+kKVbDarO0g2PB4PotEoOh0KJvgBDAD8oC9uQy7SSaVS0gnECAQCxgh6yypMJD2rU/7xer02dVEMSCgzbuN32QU6h/v/TpMLJZIFlEgWUCJZQIlkAUeIFIvFbL3+C/OB3W5nT0/OkMvl4Pf70e12uVzv1PiFFokEIheNx2Nu/booEjXYbrdcOnOJfD6PeDz+2IpXvyw5SQSREonEgUB237wjJ9kdbiRQoVA4Oi5MuIGjk0wzbh2aO55bphEq3HjdMfrForUrK/B0uFCJ+9pBC5OTYLOtn2orTLjZbevnbP+c/XKEkyBr4r5m0NIm7sFggGq1enCMHgFKpRIikchRe/XEvWe5XKLRaKBcLh8IZfcT98FSCbO1nYWE0jQNq9UKdvXNjJBzt+l0inq9jkqlAp/Px7Vfp0Q6WnQTwU1URqMRarWa7ije1zYj7FIJQUK1Wi1kMhmVuJ+CdnsMh0O1VHIJchQvHOkk3iiRLCDUBFdUhJq7OQn1H1wLMJH0vYE0JVAcw0T6RX82m430Qs1mM1b9zSpMJI25iZYwZIUEWiwWbPTfWcVj0IMs9Ia26lIJBoNwuS69VXE7kEC9Xo/9cFFk3bPBmVV43MtNC2ChUAhu9+3ndtrkbtjoThH1mqWgc3yU+JWJn8bt2oxz8fQSwMOpE24Ucs8346sSCoVCoXAqAP4BJ5GXt9prjf0AAAAASUVORK5CYII=';
    self.ICON_HEADPHONES_ON  = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAEdklEQVR4nO1b107kSBQ9i5ochchJZBAg2BUgJHhglx+YmT9YfsD/sF+wUv/AzB8s88ADT7sSIBASIufUILIIQxJRsDo1Lo/bWI1n2nYz2Eey2uWuur51fCpdu+DDhw8fPn4u/GLmbTAY/BPAOwC/A8jywDP9D8BnAJ8URfli/DOMpGAwSEL+BfCrqy6+HoQAfFAUZVLvkUaSkaCHhwecnJzg8vLyTbOSlJSEvLw8BAIBeYlK+kNPVECX/29J0OHhIebm5gRRXgDrWldXh7KyMqjdyz8AKmTV4/BVReUA2A/h4uICU1NTniFIYmlpCbu7uzJZrvbLAnHq73t9Zq+CddeJ452RpBZ54fT01LMkkSC2JBXaqC5JYnPzNEGREPfjRb0DnyQLCBizPD09vUY/Y4owkkiQ10kyq/8zJT0+PrrlTxgyMjIQHx+vXTo+Po6JH2aIqZJKSkqQn58vDjOcn59je3tbHG5Nbl+NkgoKCtDY2Ijk5OSI+aiuhoYG1NTUYGNjA8vLy477ZgZXO24uIpuamlBaWqpdY7Pa2toSquFBkLzMzExBJvOyGdbW1or02NgYrq+vHfPR1G99ggQ5pSRWtLOzU1SeODs7w+zsLI6Ojp7lvbq6EgfXUouLi4LYwsJCoazu7m4MDw+L8k4gps2tq6tLI4jKGR8ft1SOoZrR0VGxQm9tbRVk09bAwADu7+8d8dUIVzru5uZmjaDp6Wmsrq5+t43NzU3hW1tbmyCqo6MDg4ODtvsaEyXl5uaiurpanIdCoag6X5YnQS0tLcJuVVUVVlZWbPTWHM+WJVJNdh0cnaD2M5OTk1HbJck7OzvCJm1zMLDTXzM42nEzLMonTrCTvr29tcXuxMQEiouLhaqoUkYW7YLrza28XERghIrW19dts8uYD+dNFRUV4piZmbHNthkc7bj5tAkO43YPCAsLC4Kg1NRUZGVl2RYLc1VJXGokJCSIcw750i47W1YMqsLW1tYi2klLS0NlZaWWpiI5LeCbnLu7O3EPNmkn13qOkcT+COo8RxcSFRWWa7WDg4MXR6eUlBQxhZDY39/XZuYszxk57c3Pz9vitxkca25yRU+S9DaN5y/dz/jQmJZlqB65bLHLb1ebW3Z2tvjlk49k86X7GZ3Wj8BSobyXkwtzx5TEp0xbbBrRKMmMJL2S9vb2TPP9KFxV0sjIiKV80SiJi+P+/v4ovLSGmEcmoyHJLbgembSz43baPwnXlaSPH/H8pfvd3Nzo39GLdEyVBBdeKQ0NDX1XfhLZ19fnmD9W4L+ctACfJAvwSbIAnyQL8EmyAEmS+Cw3PT39NfsaM0iSpqCSlJiY6D0WdDATiiRJ+xxXH7vxGhjp1JH0OYwkRVH61A+90d7ejvr6es8RlJOTg56eHv0lbQarn3H3qh+7i8xFRUUi2M4Q6VsHFWRoQX8pihKSCeO2CX67/PHNsxIZ3F/Sq88RNgVQFOUTgN/UDSleg9xX0must+kuJXzbJfD1xdnbxxfjphsfPnz48PGzAsD/DyYR6FZfHkkAAAAASUVORK5CYII=';
    self.ICON_HEADPHONES_OFF = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAD90lEQVR4nO1b2U7cMBQ9s7BvI7EvQhQheGVeeYFPaL+g/ZV+SfsHbb+g7QuvVDwiQBUgdjHsO0x13NxRCGGSIY4zTHykKJvt2CfnXl87DiwsLCws3hYyAbWdBVBIwTv9VWsGkvIFQAlAOUUb2zwRhqDZFJLj3T55SXGbG1lcEvOamZnB0NAQuru7a1Xim8Ll5SV2d3exsrKCu7s7qfoHAN/9SPoJYKGpqQlzc3MNT44XJGhxcRGnp6e88xfAO0mSdfZU0QIPpqenU0cQQXEUi0U5nXCbnZD0XhJOTk4mUce6AMXhEsi8HAhJyg+lUUFeDA8Py5VKT5cNkzHtsCSFgCUpBPLeJOVyuR7raQx+7X9G0uPjYyO1uWYEksQEppWUy+XQ2tqKfD6PTCaj9gzs7u/vcX19jYeHB6P1qSslkZienh6196Ktra1y5fb2FmdnZzg/PzdSLz8YV1I2m8XAwMAzcqgaOC+JaeR+c3Mzent70dXVhcPDQ0VanEhcSWzwyMiIIoGgSZVKJVxcXPg+t729XamNypK8BwcHSllxIVGSWlpanhBEVRwfH1fNQxPj1tHRgcHBQZW3v79fNcQZiGpHYo6bznh0dFQ1ki9hc3OzJrMhUZzSGBsbU2TTXKlCKlA3ElOSKIhlb2xs4ObmpuYyJO/4+LgiinNd6+vrRnq/JxG3KEnnVigUVKOIvb095aBfWz4J2d7e/l9xl+np3ryIVUlsSF9fnzqms6WTjoqrqyvlvEkQnfr+/r57RjEyjJPERjBYJHZ2drSVTUVSoZz/IllbW1taykUSjpvxDcGe6DV+qBqOjo5Uj8f4SWedjSpJhhtwGqS7QxCS+BwSdXJyorV8N2JTEmMbgTsempqaQmdnpzpm1766ulq1HKZlHgHTMx+VSf/EQJMvIyjmCgujShIVsSHuMt2V4HHQ87z3eS7X2BmQJL4QXfU2ShKHEQTfeLUyg57nrbSbWAaUcEzbGEk6zU1IYlRcrcyg5/mRJNfYITBQ5RhPV72NKonxC50pTSKKuVVTEgNT6f6NKkknSWEQxSfR33EcGDeMz3F7lRTF3OKunyA2JYVFFHOLA3Uxfbu2tqamTuD0TkHPo09bXl6unDNGSpykuFHrXDWJ1BUovhb242QIWJJCwJIUApakELAkhcATktK+DgAvcCAk/YEzFtI5X/wW4frw+dtLElfEq2Ak7JirEcEPFS6RVP4SyDl7fojnKoUFfjRkQk6JpgmcseB6bhdBn+XE+2/JkvNXgPoSwa8d3HNrRND/0MVwFCALNhyLKjpruX3BVbjfUvzLxJLf/yUv/aXEhe8fnQyN/qeS+OMfAL7WQX0sLCwsLCIBwD/fItnwIMk6LgAAAABJRU5ErkJggg==';

    // Fill choices based off of number of slots to be created
    self.setChoices(self.config.slotsToCreate);

    self.initActions(); // export action

    return self;
}

// Setup the choices that are available based off of number of slots
instance.prototype.setChoices = function (numberOfSLOTS) {
    var self = this;
    self.CHOICES_SLOT = []
    self.CHOICES_SLOT_NOALL = []

    for (let index = 0; index <= numberOfSLOTS; index++) {
        if (index === 0) {
            self.CHOICES_SLOT.push({ id: index, label: 'All Connected Slots' });
        } else {
            self.CHOICES_SLOT.push({ id: index, label: `Slot ${index}` });
            self.CHOICES_SLOT_NOALL.push({ id: index, label: `Slot ${index}` });
        }
    }
}

// Create array of slots to hold state data
// numberOfSLOTS is the number of slots to create
instance.prototype.createSlots = function (numberOfSLOTS) {
    var self = this;
    self.SLOTS = [];

    self.log('debug', `[Livemind Recorder] Creating ${numberOfSLOTS} slots`);
    for (let index = 0; index <= numberOfSLOTS; index++) {
        self.SLOTS.push({
            id       : index,
            label    : `Slot ${index}`,
            source   : '',
            recording: 0,
            listening: 0
        })
    }
}

// Return config fields for web config
instance.prototype.config_fields = function () {
    var self = this;

    return [
        {
            type : 'text',
            id   : 'info',
            width: 12,
            label: 'Information',
            value: 
              `<div style='margin-left: 20px;padding-left: 10px;border-left: 3px #BBBBBB solid'> 
              This module is for Livemind Recorder NDI recording software. To confiure, 
              add the <b>IP address</b> of the machine where Livemind Recorder is running.
              Multiple instances of the module can be added each pointing to a different
              IP address to control multiple instances of Recorder.
              <br><br>
              <b>Note</b>: If Recorder is running on a separate machine from 
              Companion you will need to create exceptions in your operating system's 
              firewall on BOTH machines at the port number you set.</div> `
        },
        {
            type    : 'textinput',
            id      : 'host',
            label   : 'IP Address (Default: 127.0.0.1)',
            width   : 6,
            default : '127.0.0.1',
            required: true,
            regex   : self.REGEX_IP
        },
        {
            type    : 'number',
            id      : 'port',
            label   : 'TCP Port (Default: 9099)',
            width   : 4,
            default : 9099,
            required: true,
            regex   : self.REGEX_PORT
        },
     
        // {
        //     type    : 'number',
        //     id      : 'pollInterval',
        //     label   : 'Polling Interval in ms (Default: 500)',
        //     width   : 5,
        //     min     : 15,
        //     max     : 10000,
        //     default : 500,
        //     required: true,
        //     regex   : self.REGEX_FLOAT_OR_INT
        // },
        {
            type   : 'checkbox',
            id     : 'verbose',
            width  : 9,
            label  : 'Enable verbose debug messages to log window',
            default: false
        }
    ]
}

// Initalize module
instance.prototype.init = function () {
    var self = this;

    debug = self.debug;
    log = self.log;
    
    self.status(self.STATUS_UNKNOWN);

    self.initVariables();
    self.initFeedbacks();
    self.initPresets();
    self.initTCP();
}

// Initialize TCP connection
instance.prototype.initTCP = function () {
    var self = this;
    var receiveBuffer = '';

    if (self.socket !== undefined) {
        self.log('warn', '[Livemind Recorder] Killing existing socket connections');
        self.socket.destroy();
        self.setVariable('status', 'Not Connected');
        delete self.socket;
    }

    if (self.config.port === undefined) {
        self.config.port = 9099;
    }

    if (self.config.host) {
        self.socket = new tcp(self.config.host, self.config.port);
      
        self.socket.on('status_change', function (status, message) {
            self.status(status, message);
        });

        self.socket.on('error', function (err) {
            self.debug('Network error', err);
            self.setVariable('status', 'Error');
            self.log('error', '[Livemind Recorder] TCP Socket error: ' + err.message);
        });

        self.socket.on('connect', function () {
            self.debug('Connected');
            self.setVariable('status', 'Connected');
            self.log('info', '[Livemind Recorder] Connected to Livemind Recorder at IP ' + self.config.host + ' on port ' + self.config.port);
        });
        
        // separate buffered stream into lines with responses
		self.socket.on('data', function (chunk) {
			var i = 0,
		        line = '',
				offset = 0
			receiveBuffer += chunk

			while ((i = receiveBuffer.indexOf('\r\n', offset)) !== -1) {
				line = receiveBuffer.substr(offset, i - offset)
				offset = i + 1
				self.socket.emit('receiveline', line.toString())
			}

			receiveBuffer = receiveBuffer.substr(offset)
		});
        
		self.socket.on('receiveline', function (line) {
			if (line !== undefined || line !== '') {
			    if (self.config.verbose) { self.log('debug', '[Livemind Recorder] Data received: ' + line) }

               try {
                    var response = xmlParser.parse(line, xmlOptions, false);
                    //console.log(response)
                }
                catch(err) {
                    self.log('error', '[Livemind Recorder] XML Parser error: ' + err.message)
                }

                self.incomingData(response);

			} else {
				self.log('error', '[Livemind Recorder] Data received was undefined or null')
			}
		});
	}
}

// When module gets deleted
instance.prototype.destroy = function () {
    var self = this;

    if (self.socket !== undefined) {
        self.setVariable('status', 'Not Connected')
        self.socket.destroy()
    }

    self.debug('[Livemind Recorder] Destroy', self.id);
}

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

    // check if number of slots had changed
    if (self.config.slotsToCreate !== config.slotsToCreate) {
        resetConnection = true;
    }

    // save new config
    self.config = config;
    self.log('info', '[Livemind Recorder] Updated Config Saved.')

    // recreate slots if needed
    if (resetConnection === true) {
 
    }

    if (resetConnection === true || self.socket === undefined) {
        self.log('warn', '[Livemind Recorder] Update Config: Reinitializing socket');
        self.initTCP();
    }

    self.initActions();
    self.initVariables();
    self.initPresets();
    self.initFeedbacks();
    self.updateStatus();
   
}


// Deal with incoming data
instance.prototype.incomingData = function (data) {
    var self = this;

    if (data !== undefined || data !== '') {

       

    } else {
        self.log('error', '[Livemind Recorder] No data received from socket')
    }
}




instance_skel.extendedBy(instance);
exports = module.exports = instance;
