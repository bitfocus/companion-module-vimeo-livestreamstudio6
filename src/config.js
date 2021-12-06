// config.js
// Companion module for Livestream Studio 6

exports.getConfigFields = function () {
    var self = this;
    return [
        {
            type : 'text',
            id   : 'info',
            width: 12,
            label: 'Information',
            value: 
              `<div style='margin-left: 20px;padding-left: 10px;border-left: 3px #BBBBBB solid'> 
              This module is for Vimeo Livestream Studio 6 production swithcer software. To confiure, 
              add the <b>IP address</b> of the machine where Livestream Studio 6 is running. 
              <br><br>
              <b>Important:</b> You must go to the <b>Hardware Control</b> tab in Livestream Studio 
              settings and enable <b>Allow Incoming Connections</b>.  Then under "Pending Connections", 
              click <b>Allow</b> for the IP address where Companion will be connecting from. Only change
              the TCP Port in you know what you are doing. 
              <br><br>
              <b>Note</b>: The TCP port in Livesteam Studio 6 is locked to port 9923 can <b>CANNOT</b>
              be changed by the user. The ability to set a port exists in this module for those users
              who wish to implement port proxying/remapping.
              
              ver 1.0.0</div> `
        },
        {
            type    : 'textinput',
            id      : 'host',
            label   : 'IP Address (Default: 127.0.0.1)',
            width   : 8,
            default : '127.0.0.1',
            required: true,
            regex   : self.REGEX_IP
        },
        {
            type    : 'number',
            id      : 'port',
            label   : 'TCP Port (Default: 9923)',
            width   : 4,
            default : 9923,
            required: true,
            regex   : self.REGEX_PORT
        },
        {
            type   : 'checkbox',
            id     : 'verbose',
            width  : 1,
            label  : 'Enable',
            default: false
        },
        {
            type   : 'text',
            id     : 'verboseInfo',
            width  : 11,
            label  : 'Turn on verbose debug messages to log window.',
            value  : 'When enabled the commands sent and received from Livestream Studio will be logged.  [Default: Un-Checked]'
        }
    ]
}
