// Index.js
// companion-module-livesteam-studio v1.0.0
// GitHub: https://github.com/bitfocus/companion-module-vimeo-livestreamstudio6

const tcp                                   = require('../../../tcp');
const instance_skel                         = require('../../../instance_skel');
const { executeAction, initActions }        = require('./actions')
const { getConfigFields }                   = require('./config')
const { executeAdvFeedback, initFeedbacks } = require('./feedback')
const { initVariables }                     = require('./variables')
const { initPresets }                       = require('./presets')

var debug = debug;
var log = log;

// ########################
// #### Instance setup ####
// ########################

function instance(system, id, config) {
    let self = this;

    // super-constructor
    instance_skel.apply(this, arguments);

    // Initial data structure to hold state of the application from the API 
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
            level: 0, mute: 0, headphones: 0
        },
        recordMaster: {
             level: 0, mute: 0, headphones: 0
        },
        status: {
            fadeToBlack: false,
            recording  : false,
            streaming  : false,
        }
    };

    self.blinkingFB = {};
    self.refreshConfigBool = false;
    self.refreshConfigIteration = 0;

    // Define icons
    self.ICON_SPEAKER_ON     = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAADrUlEQVR4nO2aTUsbQRjHn43xlSi+4cEcrCJ6sEQRPQWFYtBrPoJfYL5DDz325H4Be/JqTwqCBArqQaRQRES9CPVdDCai+JIp/zGTphDrzG6y2SXzg5F1dndefpl9dnYYi3NOhv8TMn7ex0hSwEhSIOzkJtu2k0SE9MHrBjskTUQpIlpkjKV1i9AK3LZtt3POf1iW9bHy/So/nPOsZVmMMbaoU7iWpIWFhV8QdHNzQ8fHx3RxcVH1jqvQ3NxMvb29NDAwIK/+xBhLqd6vHJNs256Xgra3twMjCNzf39PR0RHt7u6K/znnX3Tu1wnciEG0v7+v2UT/cHJyQplMhizLiiN0VEKSKBSVBJnLy0vZ+rFKSKpZjCQFjCQFjCQFfCEpHA6LuUwpML/p6OioavuqLgmCJiYmqKmpqeR5SMJ5JFxbDbRrfXl5KVsz6+vrRedbW1spl8uVLFt+EWA0jYyM0M7Ojqs6UY8u2iMJlZQj1dXV0eTkpBAkZSC/sbGRIpFIoY6DgwN6fn4W1/T09AhZbup3ssioPZKc/BKlGB8fp7a2tn/KRYpGozQ0NES3t7fi8weTv42NDZqenhbX4XzRhFAbX0uKx+OFYzxmxYKoaCTJTuA8HsVUKkXpdJqur6+pq6tLJDc/lK8loXPvlYuE76vh4WGRB1GdnZ10dXUlRg/KwFvQa0mexSSVxuM6rDLs7e0V8uXIKe5czcSkUuUi4VHs6+sr5ENaKUlOCbQkOZIGBweppaVF5D09PdH5+bnIl3lu2+CJJKfzpKWlpcJxQ0MDzczMUHv73yUdlIskOwFBW1tb9PDwIK7HWw1gsc/NXC0wIwkdX1tbo0QiUfjkkCPp7OxMHGMl8e7uTgiampoSjyFAfs08bhCF+c/s7KwQIGPS6empSBLMjzCJBJB2eHjoqt7AxSS82ldXV2lubq4wkt7i8fGR1tfXXdcfyMANUSsrK2+WjUkkEhbxs9ms6/oC+3aDqLfY3Nwsa12+frv5BSc/sm/mSV4R6MmkV3jy7VaLaEuSi2RBpbu7W7ZceXeJjqRl/BkdHQ20oP7+foSM34yxn6r36Uha5JxnYrGYWHbFMmuQwLdfMpl87XQo9FWn6br7k8by+5MilN+AEAQQIorCxDfG2HzFJOVFYXfb51wulwiFQtFAWHrle36n27LujWaLsgJmCqCAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkaSAkfQeRPQH4RqoYPTbGZgAAAAASUVORK5CYII=';
    self.ICON_SPEAKER_OFF    = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAACaUlEQVR4nO2aT6oaQRCHfx0UUaI8FMFlUHDjZhb+wUXIFXIEj/DICZKThNwgB3CRqHsD2bqICxciyFOCKKIdanBEIU+rZEZntD5omUba7v5muuyZKWOthXKaN+rnPCqJgUriQDFJUgA4AL5T0ygVY8xvAC3pfKmIArcxpgXgKx0nk0mkUqnbnV0B6/Ua8/nca/DNWtuStGdLMsa8o7NhrX1bqVRQLBYDm1QQkKR+v+/J+mKt/cztRhKTnklQuVyOnCAik8mgVqu5x8aYT5K2EkkUiyIpyIPCQ6FQoDiTNsY43Hbif7d4PH7J+EIDXVE7nrhj0i0AA5XEQCUxUEkMQi0pnU6jVCrdfBwxaYNrPVohQdVqFcPh8Gp9voZY0na7DXxQ3sYvFou5gvzs8xLhoZNEgur1uisIu0k9vKRcLrc/po2q4zh7QYiqpM1mI+7kFM1m8+T3NCk/+7xEeChj0iG63BioJAYqCcBkMjmq5/P5o7pKAtBut4/q9Lyq0Wjs6yrpPwwGA/dq8h7u6RbgFXq9njsZum8jQX72eVeBu9vtuptLXW5n6HQ67o5cJZ1guVxiNBr5+pt3uU/ym7sJ3EFylXu3R8xnerhn3JesBImkF/pYLBbiTsLEwfh/cYclkUTpNhiPx5GNS9PpFKvVig5/WmtfuO2kqTc/AHxIJBLIZrOReuU9m83cAuAvgPfWWvaVJE3geopiAtdBobwbJ9AkLo9dRsZHccPb8odOsGSZ7eerKcrn0dfcDFQSA5XEQCUxUEkMVBIDlcRAJTFQSQxUEgOVxEAlMVBJDFQSA5XEQCUxUEnnAPAPxYQmn/AWJMQAAAAASUVORK5CYII=';
    self.ICON_HEADPHONES_ON  = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAADp0lEQVR4nO2a20obQRjH/y2KaBOJeAIxISieULHeeKMIIt6XPoF9gHmHvkBB2FuhhzfoG7TGKwXxQvEsVfF8ihpR8VS+6W5JbQ7ftya7Cc4PZo3L7Lczv8x8mVn21ePjIwyZeW38ZMdIYmAkMSiRXmBZVgjAKIB3fjT4GcwCGFNK/ZKGECVuy7LeAogBCHjTr7zwQSn1RRKYLcmyrCiAOQBvEokENjY2cHV1VSgdz0hpaSkikQiqqqqcakNKqR/c6yXT7aMjaHp6Gnd3dznrhBccHBygs7MTDQ0NdLdvACLc20oS93s6LC4uFp0gh6WlJedj2J4ZLCSSgnQ4PT3NQ/O9gb7cpPbnRdKLxUhiIF4nvcS9nljSw8NDXhpSXl6uC0FLi3wtL9x8yb5KovVLNBpFY2PjX0EOlGT39vawsrLi+3rMN0nhcFivW0pK/jTh+PhYF6KyshI1NTVaHpXl5WVdckHRjKTe3l4tCfbaZX19Hbe3t//VozpdXV1obW1FdXU1pqamUtbLN55Lam5u1p2nzk5OTuLs7CxtXdr67OzsYGBgQEuikTczM/Os+xf8SKqtrUV3d7cWNDExkVGQw83Nja47ODio91/xeByrq6uu2+AGsaT7+3vXN2tvb9d/ae93cnIiuidNtZGREXR0dKSdnhzcjCTxYpJGkptCiZhG0uHhIba2tsQxSOr8/Lz+RWxpaXHdDjd4Jol+6mFvkN3GWFtb0zEoltsYBZ2T6Kecpsjm5qb+v6mpCYFAAPTohaZPKurr63UhSNDFxYV+5FFXV6fXVZeXl67aIsUTSSSDpokzzWBLIgH7+/tpEzHJoERP7O7uakm0wKTzoVBI/y+lYHNSRUWFvpbySqrcwJka9JnOkSyCnjJ6lZM8GUnONU5HkfSNJp97SrKkpx3NdF0mPMlJbpYA29vbGB8f/+dcsqR0MZMl0GeqlyqWhKLb4GaLmWq6+YFvko6OjnTHaVObLub5+bnelhDX19c5uXdRjaRYLJa1zsLCgi5+Yx7fMjCSGBhJDIwkBmJJwWDQj3bmDHoSYRPnxpRI+k6Hvr4+f3qXA3p6evQeEkBCKTXLjSiRNEaHtrY2DA8PF9WIKisr04L6+/udU58k10vfT6KXtz4L21hofFVKjUraJMpJ9stPQwB+FqGcOfsFLpEgSEfSS8UsARgYSQyMJAZGEgMjiYGRxMBIYmAkMTCSGBhJDIwkBkYSAyOJgZHEwEhiYCQxMJKyAeA3RGYeXU/StLUAAAAASUVORK5CYII=';
    self.ICON_HEADPHONES_OFF = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAADe0lEQVR4nO2aSU4bQRSG/2qCmMEMAoQQsgCxIpKl7FhxhByBnCEXyE0SbpAjZI+yghWTjUECxGhjBglBRX/JjYzk4b3G7nYr9Utlt+16NXz9qupVu4y1Fl7NFXg+reUhCeQhScQ5SZMArAP4TdM0JWPMNoCv2v4yqSZuY8wGgJ+8HhgYwODgYHJ3V6Hn52eUy+XQYNNau6GxF0MyxmQB5Ht7e5HL5TA7O9uxTnVCV1dX2NracsAAfLPW/pJWo5mTfvBlZWUldYCoyclJrK2tuWtjzHeNrRiSMeYL3xcXF/Ut7BKNjo66ZK1d1bRIDIkF826kXZwutPIhgEAekkCftAavr69JtDNRqSAxXOgEpP7+foyMjLz77unpCXd3d22vK8qGPlFPGh8fx/T0dMPJ9OXlxcU3TLxOSol4Uk9PD7LZLIaGhtxnRsOlUikM9BAEAcbGxtxyTYiZTAZHR0d4fHz8cN2p8CQCYqzFbQ07XSwW63b+9vbW5V1YWHDAaLO/v98WUFrF7knLy8sOEIfQyclJ02HEug4ODjA/P+88irY7OzsfGnpd70kzMzMYHh7Gw8MD8vm82I7eRq9iMEtgGtt2KDZPYifn5ubc9d7enrqcQqHgABPU6empAx1FXe1J7BxBXVxcRJpXWC+H59LSkvNIDsO4pPakqPPB1NSUe+cqFbWMs7MztypOTExgd3c3Uhkd96SPDDeuUPf3929exNWKw6dSqeDw8LCuDT2GiaLn0P7y8tJ9x+CTYYNWXTvcCIMikNCeMRLBNQPf19fn8qA6pzEfyyAk/hbXFikWT2JwSNGL6tk3KrP2rjMPU/gYNiqkrvWkcMm/ubl5sw8b2wx8bYfCfPXK6rRi8SR2jNFyI2k8qVVZkj5opfakdm00az2pUZm18Hid1CY3sUcljHm4NWk0T6H6D0cIkytbO+qOxZPadcDi+Pi4ZR4u90xJyz++FchDEshDEkgDqRI+OfzfpIH0l5DSDipK+zWQeNwG5+fn6kq6RVwpq5A2NU1SHb0JgmCbf3dz38RHH9x0pkXX19duc8xpA8Bna21B3HTlAa4MgD9pO8BVk4oAch09xPXmfsasV0+8pUkFzZmkd/31R5Rby8dJAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIAnlIrQTgHxN87HRLBWg/AAAAAElFTkSuQmCC';
    self.ICON_PREVIEW        = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAD30lEQVR4nO2aS0vjUBSAT9KoUx9lqKAyvopUBEFaFwriCKOb8WfMwGzzH2Y1e8nCrSt3A+5cqYMIU60youALrSDURX2ND6yP2AznYjpOTZrLcE+Ccj8ImNvbc5vPk5uT5CqWZYGkPKr0442UxIGUxIGUxIFGEdQwjBgAfDVN8z1F/FJUVc2oqvpN1/UfFPGFX90Mw0halvVTUZQ3Z2dnQmO7EYlErFAopADAZ13XJ0THFy5pbGzsl2VZiXQ6rVxeXgqN7YamadDX1wc1NTV5RVHe6br+W2R8oXOSYRhvVVVNZrNZ3wQhpmnC3t4eKIoSBoCk6PiiJ272A3O5nOCw3tzf35PFllc3DqQkDkhKAF7q6uogmUxCPp93/UY4HIbV1VXwc44rhUQSXjELhYJnv0QiAWtra9DS0gLr6+uOfVBkb28vzM/Pe45JBYkkFOQlKRKJwM3NDcukyspKdhlfWVl51u/8/JxlWm1tLVxcXJQdkwoySQ8PD2X73N7eQigUAiw4GxoaYHd31/U7KBD7l4v54iTxnG5XV1fssn10dASbm5uOWVJRUQGtra2sH/b3GpOKwE43JJVKQU9PDzQ1Nbn2ub6+Zv284r3KTILHU255eVnYmFSQSMK5w2tOohiTikAzSfSYVAQ6J4kek4rASgCKMakI5HSLRqNwenr6TxsWlMjd3d1/j0mFr6cbVte4wWOdtLGxwbbR0dFiGYDylpaWoK2tDbq7u2F2dhYODg5gZGSEtU1OTjqKpMwkkqcAdiaVbvZ/e2ZmhmUOCrMPDuUsLi6yLEM5Ozs7rL2xsZH1QUEoC29lysWmwNcSwD6Q6upqJgmzCfthO+7H43H2Od70YiWOn7e3t8Ph4SFr39/fd53rKOfAQDJpYGAATk5OYG5urphJKKm+vp49EkFB2I5S8Ma2s7OT9clkMo5xX2Qmuc1J9oGMj48/az8+Pobt7W0YHh5mtyrpdBqy2Sz7OxaLMWF4qpUbkwqyJ5N44E6b02c2eKOLmYRSsB0zx56kUZJbTOpFH74+mdza2irOL09ZWFgo7k1PT0NVVVVxf2pqiu1jpgWFr5IwS5wewz4VUCojSDk28kUABySS7Or5tSBUkr1goaOjw3c9+MKACuGZZJrm966uLvYmxC+am5thaGgIy4AcxcoS4RO3pmlfCoVCYnBwMN7f38/edlCC1TtulmXhYomPFEORLSw1DOMTAHwAgBjJAH/BFSSYPROiV5PYyNW3HMgSgAMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpiQMpyQsA+AN5nnPb8NY8/AAAAABJRU5ErkJggg==';
    self.ICON_PREVIEW_COLOR  = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAERElEQVR4nO2a7WscRRzHv7uzuWfzaJq9YvNkC4KKwVc2BBFBfSkV8YWCWKIgpQVfCL5REJEiiu8k0heB/gOK9o3iCxHbmBeCjegLMWmu5wPeXR7MXS632b3dGdm5XtJesreD7NyRMh9YyO3O/X53n/xmdm52NMYYFO3RlZ9wlCQBlCQBlCQBDBlBZwtj4wDe1SvpGRnxW2EJZ5XF6hfnzfx3MuJHfnebLYxNwdMXQWii/nsm0thB9IxaDAlPA3B23sxfjjp+5JJevXnqOoX3yNZH92vun8lIYwehpTwMvHkDJGtbIPT4vJnfijJ+pGPSbGGsnyWcqd2FgY4J8mE1gp0rIwChftKpqONHPXDzD2gv9UUcNhxqEWmx1d1NACVJAClTAOHkJyz0nrsJuhELbKMPOajMjaOTY1wrUiQxykApDW3Xey6H6qenkJ0cQu7bw29Ixold9J/PYf2tB0JzykKKJMpoqKSe0V2geA9GzxCUH7yKydQ0Vq6UD7Rz8jF46zGQ+2qo/5Fom1MWciR5FJ7ntW2jbQM0swPt++NID/+Lwg924Hu0pAt3G21j+jllIae7CVSSUyKgNR057Sewi1lUN7YPtNFTFOnHy7yd3x4IjsmOXCUJjknFj7MYfHkNxqPLSAW0cdcN3i4sHj1qY5JIJfnQKlCaGxaM2j7ekaskj4aPSTJyyqKrU4Coc8qia1MAGTll0bUpgIycsujKwJ2cdGGt3pmapBvdxdvR/ndOWXR0CmC+VIP5Yo3/7ZR0rH2RxNqXSZz8oIzMw3V+3soZ+PtSGn2nHQw/ayH3fi/KizFMvFNB32MOfnlh6FCRMqcAUlYBmpXUejRXQVffy/DK8aU1ZDJYqwR/XUohOeFyOevfNH70ph9yeBtfkC+rvs0CYt8lUwB2q7qMYy6X5BR13s53578efMrm1//5vAfVZfDr/acdVJYa/8vNBRI41t01U4BmJY2+vovaDR35uUSjCsBAMgyxEQq7qKO6rPHzmwsGzOccDD3t8PdtXCOBY53MKYCU7kZDutvik2n8/FoSW9cbMsCAnRUdKx/GER+hMM/Y/Hz5VgUNTLu8iuqVw7saPyR2Nzkrk4xxIQeOvct3XuOWwFD6isAuahiY8fj5jav63iC9eY0cHrMZQ+LGj46uTJa+NvbGl9vJfbK/Mvnb23EYmf0v/Osbjdd+pXWLjkqyCxrswsGnGrcLaJXRTTlN1IMAAaRIIp15ut0xIpXU3LAwONPZ320+cfMoTQFqPZ8de8ZF9nk38tBB9E15mLhQBxy9JGNniYxdJf2wyY+Ieyf52nQ+Hmn8VozhOox7XcDTLBA2PW/ml6LOIW1j6Wxh7BUATwAYl5JgH/+BnV89l6PeTdJE7b4VQE0BBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSBFCSwgDwHzxBdMEpCbkiAAAAAElFTkSuQmCC';
    self.ICON_PULL           = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAD0UlEQVR4nO2az0sbQRTH347VBESpYg56EMRU9KYHiYKF3oInK6X/gJ4q7B/Ra6977X/QS7xoDyKCQkE9RPCgGGMu/iD+CooYxZ2UN3TCdEnMJJ23pjIfWHZ3frzZ/e6btzOz65RKJbA8D7P61MaKpIEVSYM3VIY9z/sIAKNU9gPkACDlum6BwrjxwO153ttSqfTTcZyEUcM14JznGWNJ13XTpm0b9yTO+XfGWCKbzcLh4aFp8xXp6+uD4eHhGOf8BwC8M23feExijH06OTkJTSAE28tkMg5jLO553gfT9o2KJC/w+vrapFktbm9vyWyTvN3u7+8pzL4YZG+3eujq6oLu7u6/aqDQ2I2agaYYJ6FAKJQkGo2KYNwskHgSDis453WVv7q6wuBbFm1wcLBuG1SQiIQ3V+sGW1tbIZFIQEdHhzhHgWQd3KNQyWQSnp6eYGNjo2acq0fQeiHpbtKTntseHh4gnU4LEXZ2dmB/f79c/uLiAtbX10Xe9vY23N3d1bT3Kj0JKRQKsLm5CePj4+L45uZGpKOXTUxMwO7uLpyfn2u3SQWJJ+EF+76vteXzedjb2xNCMcZE2uTkJJyenkIul9O2QylSUwTug4MD6OzshKmpKeFRCHazetukgsyT6t22trZE3VgsBmtraw3ZoKIpPEmyuroK7e3tIqg30iYVJCLJONFIvWKx2HCbVDSVJ/1rm1S86BDAdJtUkIlE6f7V2qQilO42Nzcn9o+Pj3B2dgYrKyvldDxfWlqC3t5emJ6ehuXlZTFGUvMkY2NjYpNlgm1SEcoQAP6MhS4vL6G/vx/i8Xg5XZ3CQKCrBqc3UohXOwRQn3TwplQBgnXV42plgvZNE9oQYGhoSOyPjo4APxLIfLw5tbx6LPOCQlSy/98NAaDCk8VZPi55qANFXJfGpZK2tjYYGBgQaZiv1tU5pia05Vuc4QdH0nJiOz8/L85xuRaXSSS4OrmwsCDOFhcXy+kzMzPl8qlUivzaQxEJb1Aug6jgfA27H3oRioPHah0VzEcb6rp3I9OXRghFpOPj46p5ePOq9zxXB0Wh/HRUDfvDhAamRRLf4WUQDhMM/lQYFQn/6uCcZ0ZGRqCnpyc0iSKRiPiowDkvygdlEuMxiTH2GQB+zc7ORrLZrFMpYJsEBcKHguviAPCF4vcbkn8mPc8b9X3/G2PsveM4UeMNBPB9P93S0vLVdV2S8YD9sVQD+3bTwIqkgRVJAyuSBlYkDaxIGliRNLAiaWBF0sCKpIEVSQMrkgZWJA2sSBpYkTSwImlgRdLAiqSBFakWAPAbuGkm2KjAfLQAAAAASUVORK5CYII=';
    self.ICON_PULL_COLOR     = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAEPklEQVR4nO2aX2gcRRzHv7Oze5e7vR5XYotP9sVCoRjydiCt9KkVnxTxSZ+kL4K+WPDBiH9eRQtaBAUR2tcWEhG0+iAUIxJ8aIgUhRasfTG0SRvTy+XS3ZmRmc1eNpdLbq7sb5uU+YQhuzszv9357m9mfrM3TCkFx854Tp/BOJEscCJZ4FMZXmyOvQhgnMp+DzcBTI3OzC1RGM994F5sjjUij18OpGjmangAkefdDqQ8NTozN5u37dw9adUPvq7EUfPbsIGpWiNv8305ttrCq627BxT3LwI4nLf93MekShy9/GulVphAmulKDZNhg5VE/PRic+xE3vZzFSl9wL+CkTzNWnHLL5HZJpndFjjZfPBI2BWtOfKgY1IWLbTuRruBXREnGZGiDZGekDGOdVqP9JmykHiSVBJSSuvyOgz50y9jslo351qwl1b+G8qGvicVJCIpqQY2sKokJpbv4Kk4MueTlXq3jq5/JFrD+Tu30GYeJhoHseDt/Ki6DhUk3S31pJ1SSwFfVhtGhK/CBi6N1Lrlr/EA79YPmLyztf24DW+gvcfSkzR/M45Pqw2cad8zx//wwFzXXvbe/QVcGKnjmhcAFrYoPYlmTJISQgirsn8wjoulEGdWlvBOdT9WGMP77Xv4nZfxMy8BlnaGGb+GhUwkyewf+jtexiEe4YPVJdz0OLRPnCuFVh6UvScVNN1N2XW3LJ/7VZxdW8ZREeHtUn3o+pRfWOk8CcO/2YkgxEElcV83eMhG78nuJpTdWJJleT0Bw9fdc7ObCQEUozC9/T0fwnNtoQsBCB+67z31cE/0Xgi7W7E/VUmmAE5ju5CI+yc/MmnSj/ChF2+6/glPzp+BMOf6f29eml5j8aYyRUXcJCKlEXeaND8K4IYEnvUUTrKN62m4kEbM2Wg9zUtTOs332s/Wp4DwK0D2CktmdNabn1xIgs/kvF9eV/z1yWCrfXTr7x2RhF6WZN+sj+fX7zQdK1x5IJBk+8Y79BJGmgbyTN2NvBTle8b5t9pHtz4FNLOb/usZuH+IJD7rCLP6T5mXCk8yIITCcT/p+TqQzNbdfLy9fcpporDPt/9KbBJI832k8HrZw+V9yep/Vihcz3jIOGeYrid5b7Xj7vVzVb9b/s2VGNQUIpJu4HyfyeebNYFfYmm8SIujj7N1suj8eSlxVWyU6RWdikJEuhpv35rrxnu2LkP61WkpZTyyaNyGCQvyFsn8Dv+cX7z2Nao1Sd4i6V0dax6/8ULJw2Fe3AK3xoDTFY6YsU76ovIk9zGpLMUrnLHfvgiD8pVIMOoxZB8D9EsJYWKENyi235DsmVxsjo13PP6xr9RxX0nyjQFt7s9WRfzR6MzcFIV9t7HUAje7WeBEssCJZIETyQInkgVOJAucSBY4kSxwIlngRLLAiWSBE8kCJ5IFTiQLnEgWOJEscCJZ4ESywIk0CAD/A0IAl0XHVePxAAAAAElFTkSuQmCC';
    self.ICON_PUSH           = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAD90lEQVR4nO2az0sbQRTH3467xt/4q8EfKCKIiqL1F20uagVPeih46tmb5/4P/SfqtQfpIRc9Fw9qEDUoFI1FC6JRYyX+QIwxO+UNzhJ/oCPs22zLfGDIzuzO251v3sy82R2Dcw6a52Fan5fRIimgRVJAi6SASWHUMIxy0zS/MMZCFPYfwjn/lU6nP3POf1PYd312MwyjiTH2MxAIBBoaGjzx1L29PUilUinbtt9zzqNu23ddpPz8/O+maU4MDQ2BZVmu2n6O5eVlSCQSidvb26Dbtl3/p9Pp9ERra6unAiEdHR2QyWTeGIbx1m3bJN2hqKiIwqzqPcvdtu2r2c00TSgtLfXBk9zHVyJ1dnZCf3+/EMtP+EYkHMcKCgrg+PhYCOUnSESybftVqba2Furq6mBjY0MkuBuIX2uHCjKRMpmMUiouLoa2tjZYWVmBZDIpypaWliAYDEJjY6OyHUz/nEgqKS8vD/r6+mBrawtjHKdOKpWChYUFaGlpgYqKiv/TkzBAVWlUKBSCwsJCqKmpgfr6eqccZzjsbmgHxyfM51IkkmlE9aHX19fFL3YrFEvWQQ/DGS4SiYg8ehalCC9BJpLKGHF0dCR+q6qqRDBYWVkp8ug5Nzc3zvlcQyKS7G6qXF5eQnV1NbS3tzs1cBDPpfdkk9PuJtnZ2RHJr/jCk/wOiUjUcYvXaE9SwBdjkt8hDwF6e3uhp6dHHB8eHsLq6irE43GnfG5uTuTHxsbENbOzs1BSUgKjo6NOSDA/Pw/b29viGgw8p6enRfnk5CSsra0Jm5SQR9zy9fDi4qJo4ODg4L3y7OtkPVyOoECxWEwIcHBw8GSdh/eigry7yYZh1IwBomyULH84fuHx9fW1OG5qahJruLOzs3v2x8fHH/0hlJC/BZANGB4eFkLhC/vscnktdjFsMB5Ho1FxnayHazwszxY226uoZ1PPXgHOzMzAycmJk0evgrslSCAQEL/yPB5vbm7CxcUFjIyMiGg8m3A4LHJTU1OePLtnImULhKAIAwMDQgSJXPB2d3dDV1eXU76/v+/VYz4JxcdJjqt6+fUCvaKsrOzJhuK55uZm/FbneI4sR+/BtLu76wiMefQ6aQtfr5yfnzv10AYAfOCc/3C1TdQieQmVSHrDhAKui8QY+3N1dUXxrM8iuxwAuL5pgsKTvp6enmayHpocjKvi8ThnjEUodpaQ7JlkjH3jnH+yLMu2LIu0S2N8hPEXYyxm2/Y7znnS7XuQbSy927jwkcT4Y6Kc8zCVcb37VgE9uymgRVJAi6SAFkkBLZICWiQFtEgKaJEU0CIpoEVSQIukgBZJAS2SAlokBbRICmiRFNAiKaBFegkA+AvJQCAfByzMpQAAAABJRU5ErkJggg==';
    self.ICON_PUSH_COLOR     = 'iVBORw0KGgoAAAANSUhEUgAAAEkAAAA5CAYAAAB6UQYdAAAACXBIWXMAAAsSAAALEgHS3X78AAAEXUlEQVR4nO2abWgURxjH/3tebnOXkF5stqktTaOmrQZTtEHbxoZ+qBWMiopaGmoRo0ir0lqoVtt+sAUpFCkFSyg01DeQNgehBXO+gCAqhSKSwJGAVVCoGmMMicm9mtsdmbnsvcSrmcDO3Z6dHwy7++zMszP/e2ZnZm8UQggkj8ch9ZkcKRIHUiQOpEgcOEU4HQg0eWMP8N1YHG+K8D8RRcG1Ejc+1+r8N4T4t3p0Gwg0Vcd19I4EoV687MhJpC5+zUBZKWJFTryh1fm7rfZveSSFIjgQjcG976AT4ajV3rPz51kHdmzQ1drZ5AyAZ6z2b/kvXeLGWlrpXAlk8lunA6oL2kCgab7VvoV0h3tDigi3vM/0Wu3bVqObpxiommG/FYCtRGpZp2P3Fp2JZSdsI1LzcgMVXqCrV2FC2QkhIhFiwDD4U8MCnQ3jbT4Fv/jou4WgZa0+JR80iUKISLTCuq5zpecrdTSvIPjxCMH1mwnb/p8JFtQSLGng82GmAhOJcP3yxaqBnRsVdJw20HM1ZQ+GDOxvNbDmXQWvzOTzVXCRxNvdvvrYgYpyoH6egrfqkbS/MINgw6rEkP7ZJge7zqdIQtZuZiRNxpGOOMvx9qKEWGYZt+pgI9yBtjF2HQwR5jNfCBLJ4HpHBK4k8sydXQRtuoI5sxL2qucIQhGCwJWxvAmTjjCRphL+/fcM1NY4sX5ZqjrX/9WFdqGpIEQk+mVhKg08+1eMJbtii0iyO3l9J/2vRTKnAE8KeZ0CFArClyUfrPLg1OFKlr7fU455Lzsz7OY1vUcTPadzptZvpyfLvdOgJvPQa9M3Pad+CnRZkpoFm9/QW48N49U5Luza6s2wp+czR8WljW7MqirCmQthHO0YQXdvNGsZpI2kBTfjTp8CmA0bDekIhQ22wk9v8MTpAj0fDSaiYnF9MX46OoTb/Q8y/P/wtZb1WaIQFEmplbm5nPjio6cxGjLwa/tQht3MW1kxjTWYnv9+YhiHfMPJcts/9DJ7urCpqCLCu5uQSMrG5t23cPVGKiKC4USjntWcKC1xsOO18fv0/OS5UdwZGMPebRpqql0ZHj/Z18eO59tn5qTuORMpXSDKyXNBtKwvZyLsHbf5/PfZ8b3lT2FdU1kyb1dPjv96mYBwkWhEdPdGHrHTb0abdt1C4yIPSj3TxiMn8VWgvfM+unoiqKlWcfFSKCnwwcODLOpMPv2mD31346KbIF4k2nCz8dnu+TpH/rPMhUvhDPvEaMxVhMkNExxYLlI4YgzOr3WLqOtjaVzoMW9bvmnCcpEIQdv7K8v0tEoL56VqF77coZFojPwtYmeJkD2TNy8vO666lOa7g3Hjdn9caJemL/KaF12Ixsg/xaryulbnH7b6GcI2lo5vXFgtxPmjdGt1/j9EOZe7bzmQoxsHUiQOpEgcSJE4kCJxIEXiQIrEgRSJAykSB1IkDqRIHEiROJAicSBF4kCKxIEUiQMpEgdSpMkA8BC1+zeRbpUHAgAAAABJRU5ErkJggg==';

    self.masterAudioChoices = [
        { id: 'str', label: 'Stream' },
        { id: 'rec', label: 'Record' }
    ]

    self.setActions(initActions.bind(self)()); // export actions
  
    return self;
}


// Return config fields for web config
instance.prototype.config_fields = function () {
    const self = this;
    return getConfigFields.bind(self)();
}


// Initalize module
instance.prototype.init = function () {
    const self = this;

    debug = self.debug;
    log = self.log;
    
    self.status(self.STATUS_UNKNOWN);
    //self.setVariableDefinitions(initVariables.bind(self)());
    self.initTCP();

    if (!self.data.startup) {
        self.log('info', '[Livestream Studio] Deferred functions running')
        self.setMediaInputs();
        self.setFeedbackDefinitions(initFeedbacks.bind(self)());
        self.setActions(initActions.bind(self)());
        self.setPresetDefinitions(initPresets.bind(self)());
        self.data.startup = false;
    }
}

// Initialize TCP connection
instance.prototype.initTCP = function () {
    var self = this;
    var receiveBuffer = '';

    if (self.socket !== undefined) {
        self.log('warn', '[Livestream Studio] Killing existing socket connections');

        if (self.blinker) {
            clearInterval(self.blinker);
            delete self.blinker;
        }
        
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
      
        self.socket.on('status_change', (status, message) => {
            self.status(status, message);
        });

        self.socket.on('error', (err) => {
            self.debug('Network error', err);
            self.setVariable('status', 'Error');
            self.data.connected = false;
            
            if (self.blinker) {
				clearInterval(self.blinker);
				delete self.blinker;
			}

            self.log('error', `[Livestream Studio] TCP Socket error: ${err.message}`);
        });

        self.socket.on('connect', () => {
            self.debug('Connected');
            self.setVariable('status', 'Connected');
            self.data.connected = true;
            self.log('info', `[Livestream Studio] Connected to Livestream Studio at IP ${self.config.host} on port ${self.config.port}`);
            self.blinker = setInterval( () => { self.blink(); }, 1000);
        });
        
        // separate buffered stream into lines with responses
		self.socket.on('data', (chunk) => {
			let i      = 0;
			let line   = '';
			let offset = 0;
			receiveBuffer += chunk

			while ((i = receiveBuffer.indexOf('\n', offset)) !== -1) {
				line = receiveBuffer.substr(offset, i - offset)
				offset = i + 1
				self.socket.emit('receiveline', line.toString())
			}

			receiveBuffer = receiveBuffer.substr(offset)
		});
        
		self.socket.on('receiveline', (line) => {
			if (line !== undefined || line !== '') {
			    
                // If verbose send received string to the log, except in the case of TrMSp & AVC
                // both of which return large amounts of data that would be excessive for the log
                if (self.config.verbose &&
                    !line.startsWith('TrMSp') &&
                    !line.startsWith('TrASp') &&
                    !line.startsWith('AVC') 
                    ) { self.log('debug', `[Livestream Studio] Data received: ${line}`) }

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

    if (self.blinker) {
        clearInterval(self.blinker);
        delete self.blinker;
    }
    
    self.debug('[Livestream Studio] Destroy', self.id);
}


// Carry out the actions of a button press
instance.prototype.action = function (action) {

    return executeAction.bind(this)(action);

};


// Execute advanced feedback
instance.prototype.feedback = function (feedback, bank) {

    return executeAdvFeedback.bind(this)(feedback, bank)

}

// Blink the feedbacks that want it
instance.prototype.blink = function () {
    var self = this;
    //for (var fbkNameId in self.blinkingFB) {   
    //    self.checkFeedbacks(fbkNameId.split(/:/)[0]);
    //}
    self.checkFeedbacks('gfxCanPush')
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

    self.refreshConfig()
}


// Send command
instance.prototype.sendCommand = function (cmd) {
    var self = this;

    if (cmd !== undefined && cmd != '') {
        if (self.socket !== undefined) { 
            if (self.config.verbose) { self.log('debug', `[Livestream Studio] Sending Command: ${cmd}`) }
            try {
                self.socket.send(cmd);
            }
            catch (err) {
                self.log('error', `[Livestream Studio] Error sending command: ${err.message}`)
            }
        } else {
            self.log('error', '[Livestream Studio] Empty or undefined command in sendCommand')
        }
    }
}


// Refresh Companion configuration to setup inputs in actions/presets/variables
instance.prototype.refreshConfig = function () {
    var self = this;
    self.log('info', '[Livestream Studio] Refreshing config, actions, variables, and presets')

    self.setMediaInputs();
    self.setActions(initActions.bind(self)());
    self.setVariableDefinitions(initVariables.bind(self)());
    self.setFeedbackDefinitions(initFeedbacks.bind(self)());
    self.setPresetDefinitions(initPresets.bind(self)());

    self.data.media.forEach((m) => {
        self.setVariable(`media_${m.id.toString()}_state`, m.media)
    });

    self.data.startup = false;
    self.refreshConfigBool = false;
};


// Populates media[] by pulling all type 3 inputs from input[]
instance.prototype.setMediaInputs = function () {
    var self = this;
    self.log('info', '[Livestream Studio] Setting Media Inputs');

    self.data.media = [];

    // Filter inputs by input type to find the media inputs
    let mediaInputs = self.data.inputs.filter(input => input.type === 3, self);
    
    // Then add those to the media index with a paused state since we don't 
    // get the state of the media players until it changes
     mediaInputs.forEach((m) => {
         self.data.media.push({ id: m.id, label: m.label, media: 'paused'});
     });
}


// Deal with incoming data
instance.prototype.parseIncomingAPI = function (apiData) {
    var self = this;
    var mediaElement; 
    const apiDataArr = apiData.trim().split(/:/);
    
    if ((apiData !== undefined || apiData !== '')) {

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
                    label          : `${(parseInt(apiDataArr[1]) + 1).toString()}: ${apiDataArr[2].slice(1,-1)}`, //.replace(/[^a-z0-9-_.]+/gi, ''),
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
                    self.refreshConfigIteration = 0;
                    self.checkFeedbacks()
                }
                break;

            // Input Name Change INC:%1:%2
            case 'INC':
                self.data.inputs[parseInt(apiDataArr[1])].label =
                    `${(parseInt(apiDataArr[1]) + 1).toString()}: ${apiDataArr[2].slice(1, -1)}`
                self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_name`, apiDataArr[2].slice(1, -1))
                self.checkFeedbacks()
                break;

            // Program Source PmIS:%1
            case 'PmIS':
                self.data.program = parseInt(apiDataArr[1])
                self.setVariable('pgmSource', parseInt(apiDataArr[1]) + 1)
                self.checkFeedbacks('programSource')
                break;

            // Preview Source PwIS:%1
            case 'PwIS':
                self.data.preview = parseInt(apiDataArr[1])
                self.setVariable('pvwSource', parseInt(apiDataArr[1]) + 1)
                self.checkFeedbacks('previewSource')
                break;

            // Stream Master Fader ------------------------------------------
            // Stream Volume SVC:%1
            case 'SVC':
                self.data.streamMaster.level = parseInt(apiDataArr[1])
                self.setVariable('streamVolume', parseInt(apiDataArr[1]))
                self.checkFeedbacks('masterAudioVolume')
                break;
                
            // Stream Mute  SMC:%1
            case 'SMC':
                self.data.streamMaster.mute = parseInt(apiDataArr[1])
                self.checkFeedbacks('masterAudioMute')
                break;

            // Stream Headphones  SSC:%1
            case 'SSC':
                self.data.streamMaster.headphones = parseInt(apiDataArr[1])
                self.checkFeedbacks('masterAudioHeadphones')
                break;

            // Record Master Fader ------------------------------------------
            // Record Volume  RVC:%1
            case 'RVC':
                self.data.recordMaster.level = parseInt(apiDataArr[1])
                self.setVariable('recordVolume', parseInt(apiDataArr[1]))
                self.checkFeedbacks('masterAudioVolume')
                break;

            // Record Mute  RMC:%1
            case 'RMC':
                self.data.recordMaster.mute = parseInt(apiDataArr[1])
                self.checkFeedbacks('masterAudioMute')
                break;
            
            // Record Headphones  RSC:%1
            case 'RSC':
                self.data.recordMaster.headphones = parseInt(apiDataArr[1])
                self.checkFeedbacks('masterAudioHeadphones')
                break;

            // Transitions ---------------------------------------------------
            // Fade to Black not engaged  FIn
            case 'FIn':
                self.data.status.fadeToBlack = true
                self.checkFeedbacks('fadeToBlack')
                break;

            // Fade to Black engaged  FOut
            case 'FOut':
                self.data.status.fadeToBlack = false
                self.checkFeedbacks('fadeToBlack')
                break;

            // Cut transition occurred  Cut
            case 'Cut':
                let pgmCut = self.data.program
                let pvwCut = self.data.preview
                self.data.program = pvwCut
                self.data.preview = pgmCut
                self.setVariable('pgmSource', self.data.program + 1)
                self.setVariable('pvwSource', self.data.preview + 1)
                self.checkFeedbacks('programSource')
                self.checkFeedbacks('previewSource')
                break;

            // T-Bar Transition or Auto Transition occurred TrAStop
            case 'TrAStop':
                let pgmAuto = self.data.program
                let pvwAuto = self.data.preview
                self.data.program = pvwAuto
                self.data.preview = pgmAuto
                self.setVariable('pgmSource', self.data.program + 1)
                self.setVariable('pvwSource', self.data.preview + 1)
                self.checkFeedbacks('programSource')
                self.checkFeedbacks('previewSource')
                break;
            
            // Streaming -----------------------------------------------------
            // Streaming Stopped  StrStopped
            case 'StrStopped':
                self.data.status.streaming = 'stopped'
                self.setVariable('streaming', 'stopped')
                self.checkFeedbacks('streamState')
                break;

            // Streaming Started   StrStarted
            case 'StrStarted':
                self.data.status.streaming = 'started'
                self.setVariable('streaming', 'started')
                self.checkFeedbacks('streamState')
                break;

            // Unknown API Response  StrSEr
            case 'StrSEr':
                self.log('error', '[Livestream Studio] Error Unknown API Responce - StrSEr - Please log this issue on GitHub')
                break;

            // Stream Starting or Stopping (indeterminate state) StrStarting StrStopping
            case 'StrStarting':
            case 'StrStopping':
                self.data.status.streaming = 'transitioning'
                self.setVariable('streaming', 'transitioning')
                self.checkFeedbacks('streamState')
                break;

            // Recording -----------------------------------------------------
            // Recording Stopped  RecStopped
            case 'RecStopped':
                self.data.status.recording = 'stopped'
                self.setVariable('recording', 'stopped')
                self.checkFeedbacks('recordState')
                break;

            // Recording Started   RecStarted
            case 'RecStarted':
                self.data.status.recording = 'started'
                self.setVariable('recording', 'started')
                self.checkFeedbacks('recordState')
                break;

            // Unknown API Response  RecSEr
            case 'RecSEr':
                self.log('error', '[Livestream Studio] Error Unknown API Responce - RecSEr - Please log this issue on GitHub')
                break;

            // Record Starting or Stopping (indeterminate state)  RecStarting RecStopping
            case 'RecStarting':
            case 'RecStopping':
                self.data.status.recording = 'transitioning'
                self.setVariable('recording', 'transitioning')
                self.checkFeedbacks('recordState')
                break;

            // GFX -----------------------------------------------------------
            // GFX Stack On State  GMOn:%1
            case 'GMOn':
                self.data.gfx[parseInt(apiDataArr[1])].state = 'On'
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_active`, true)
                self.checkFeedbacks('gfxActive')
                break;

            // GFX Stack Off State  GMOff:%1
            case 'GMOff':
                self.data.gfx[parseInt(apiDataArr[1])].state = 'Off'
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_active`, false)
                self.checkFeedbacks('gfxActive')
                break;

            // GFX In Preview GMPvS:%1:%2
            case 'GMPvS':
                self.data.gfx[parseInt(apiDataArr[1])].preview = true
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_preview`, true)
                self.checkFeedbacks('gfxPreview')
                break;
            
            // GFX NOT in Preview  GMPvH:%1:%2
            case 'GMPvH':
                self.data.gfx[parseInt(apiDataArr[1])].preview = false
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_preview`, false)
                self.checkFeedbacks('gfxPreview')
                break;

            // GFX is in Pushed State (Visible on PGM)  GMOS:%1:%2
            case 'GMOS':
                self.data.gfx[parseInt(apiDataArr[1])].pushed = true
                self.data.gfx[parseInt(apiDataArr[1])].pulled = false
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_state`, 'pushed')
                self.checkFeedbacks('gfxPushed')
                self.checkFeedbacks('gfxPulled')
                break;

            // GFX is in Pulled State (Not visible on PGM) GMOH:%1:%2
            case 'GMOH':
                self.data.gfx[parseInt(apiDataArr[1])].pulled = true
                self.data.gfx[parseInt(apiDataArr[1])].pushed = false
                self.setVariable(`GFX_${parseInt(apiDataArr[1]) + 1}_state`, 'pulled')
                self.checkFeedbacks('gfxPulled')
                self.checkFeedbacks('gfxPushed')
                break;

            // GFX stack can be pushed  0=No, 1=Flashing Push  GPA:%1:%2
            case 'GPA':
                if (parseInt(apiDataArr[2]) === 0) {
                    self.data.gfx[parseInt(apiDataArr[1])].canPush = false
                } else if (parseInt(apiDataArr[2]) === 1 ) {
                    self.data.gfx[parseInt(apiDataArr[1])].canPush = true
                }
                self.checkFeedbacks('gfxCanPush')
                break;
            
            // Media Inputs -----------------------------------------------------
            // Media Player Playing In to Out   MIOP:%1
            case 'MIOP':
                mediaElement =  self.data.media.find(m => m.id === parseInt(apiDataArr[1]))
                mediaElement.media = 'playInOut'
                self.setVariable(`media_${apiDataArr[1]}_state`, mediaElement.media)
                self.checkFeedbacks('mediaState')
                break;           
            
            // Media Player Playing Full Clip    MFP:%1
            case 'MFP':
                mediaElement =  self.data.media.find(m => m.id === parseInt(apiDataArr[1]))
                mediaElement.media = 'playFull'
                self.setVariable(`media_${apiDataArr[1]}_state`, mediaElement.media)
                self.checkFeedbacks('mediaState')
                break;

            // Media Player Pause   MPause:%1
            case 'MPause':
                mediaElement =  self.data.media.find(m => m.id === parseInt(apiDataArr[1]))
                mediaElement.media = 'pause'
                self.setVariable(`media_${apiDataArr[1]}_state`, mediaElement.media)
                self.checkFeedbacks('mediaState')
                break;

            // Audio Faders -----------------------------------------------------
            // Audio to Program 0=off, 1=red, 2=yellow  AOC:%1:%2
            case 'AOC':
                self.data.inputs[parseInt(apiDataArr[1])].audioToPgm = parseInt(apiDataArr[2])
                self.checkFeedbacks('inputAudioToPgm')
                break;

            // Audio Mute  0=Off, 1=On AMC:%1:%2  
            case 'AMC':
                self.data.inputs[parseInt(apiDataArr[1])].audioMute = parseInt(apiDataArr[2])
                self.checkFeedbacks('inputAudioMute')
                break;

            // Audio Headphones  0=Off, 1=On  ASC:%1:%2  
            case 'ASC':
                self.data.inputs[parseInt(apiDataArr[1])].audioHeadphones = parseInt(apiDataArr[2])
                self.checkFeedbacks('inputAudioHeadphones')
                break;

            // Audio Fader Volume  -60000 to 10000  AVC:%!:%2   
            case 'AVC':
                self.data.inputs[parseInt(apiDataArr[1])].audioVolume = parseInt(apiDataArr[2])
                self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_volume`, parseInt(apiDataArr[2]))
                self.checkFeedbacks('inputAudioVolume')
                break;

            // Audio Gain  0 to 10000  AGC:%1:%2
            case 'AGC':
                self.data.inputs[parseInt(apiDataArr[1])].audioGain = parseInt(apiDataArr[2])
                self.setVariable(`input_${parseInt(apiDataArr[1]) + 1}_gain`, parseInt(apiDataArr[2]))
                self.checkFeedbacks('inputAudioGain')
                break;

            // Ignored Data ----------------------------------------------------
            // We want to ignore these items from the API due to large amount of messages from API
            // for T-Bar feature which is not implemented yet in this module. 
            case 'TrAStart': // T-Bar Auto transition start
            case 'TrAStop':  // T-Bar Auto transitoin stop
            case 'TrASp':    // T-Bar Auto transition steps
            case 'TrMSp':    // T-Bar manual transition steps
                // do nothing
                break;

            default:
                self.log('warn', `[Livestream Studio] API response undefined: ${apiData}`)

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
