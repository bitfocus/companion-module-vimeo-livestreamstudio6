# companion-module-vimeo-livestreamstudio6
See [HELP.md](./HELP.md) and [LICENSE](./LICENSE)

## A Companion module to control [Vimeo Livestream Studio 6](https://livestream.com/studio/)

## Introduction

Livestream Studio 6 will transform your computer into a professional live production control room that can Input multiple feeds, add graphics, master audio, and stream in one robust, easy-to-use package. 

This project is a module for Companion that uses the Livestream Studio TCP API to bring forth a set of commands and feedback.
The Studio 6 API is not published and has been reverse-engineered by its users over time. 

This module was developed against **Livestream Studo ver 6.8.20**

## Commands Implemented #
A summary of Livestream Studio 6 commands that are implemented by this module are as follows:

- Set Program Source
- Set Preview Source
- Pgm/Prv Source
- Push/Pull Graphics 1, 2, 3 to Program
- Preview Graphics 1, 2, 3
- Play/Stop Media Players Full clip or from In to Out Point
- Cut Transition
- Auto Transition
- Fade-to-Black
- Audio Channel Volume
- Audio Gain on Inputs
- Audio Mute on Inputs / Master Channels
- Audio to Program on Inputs
- Audio to Headphones on Inputs / Master Channels
- Start/Stop Recording
- Start/Stop Streaming

**Important Note**: The commands broght forward as actions by this module are completely dependant on the API that Vimeo Livestream has baked into their software. Where this falls short is when the software manufacturer does not include a specific feature or function in the API.  This module has been developed to take advantage of every single command that is availale in the API. Please keep this in mind when posting feature requests. There are **many features of Livestream Studio that are not covered by the API**, and if the API doesn't implement it, I cannot make this module control it. 

**Features not implemented in the Livestream Studio API:**
- Ability to change data in GFX stacks
- Ability to manipulate GFX stack layers
- Chaning clips in a Media input play list
- Full Tally Feedback of all sources/layers
- GFX Tie to transition
- Control of AUX Busses
- Feedback on stream/record quality or errors
- Changing Auto Transition Style
- Countdown time for Media input clips


## Additional Information

Please see the [HELP](/HELP.md) document for the following:

- Configuration
- Available Actions
- Available Feedback
- Variables
- Presets

## Changelog

**v1.0.0** 

- Initial release

**v0.5.0** **(Current)**

- Initial commit / development build
