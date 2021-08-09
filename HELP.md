## A Companion module to control [Vimeo Livestream Studio 6](https://livestream.com/studio/)

Livestream Studio 6 will transform your computer into a professional live production control room that can Input multiple feeds, add graphics, master audio, and stream in one robust, easy-to-use package. This module provides control of Studio 6 with Companion. 

This module was developed against **Livestream Studo ver 6.8.20**

## Configuration

This module is for Vimeo Livestream Studio 6 production swithcer software. To configure: 
- In the module settings add the **IP address** of the machine where Livestream Studio 6 is running. If it is running on the same machine as Companion then use the default of `127.0.0.1`. You may have to create an exception in the firewall on either machine for the TCP port listed in the config.

- **Important:** You must complete the following steps in order to allow Livestream Studio to accept connections over the network.
  - In Livestream Studio settings go to the **Hardware Crontrol** tab and enable **Allow Incoming Connections**.

  - Now back in Companion add or enable this module so that it initiates a connnection to Livestream Studio. 

  - Finally, back in Livestream Studio settings under **Pending Connections**, click **Allow** for the IP address where Companion will be connecting from.
   
- **Note:** The TCP port in Livesteam Studio 6 is locked to port `9923` and **CANNOT** be changed by the user. The ability to set a port exists in this module for those users who wish to implement port proxying/remapping. Only change the TCP Port if you know what you are doing.

---
## Available Actions

The following actions are available to assign to a button.

Action                           | Description                        | Options
-------------------------------- | ---------------------------------- | -------------
**Set Preview Bus Source**       | Sets the source on the Preview Bus | **Input**: `Available Inputs`
**Set Program Bus Source**       | Sets the source on the Program Bus | **Input**: `Available Inputs`
**Control GFX Source**           | Control GFX Souces                 | **GFX Stack**: `1-3`, **Action**: `Push`, `Pull`, `Preview Show`, `Preview Hide`
**Control Media Source**         | Control Media Source               | **Media Souce**: `Available Media Inputs`, **Action**: `Play full Clip`, `Play In to Out Point`, `Pause`
**Transition: Cut**              | Execute a CUT transition 
**Transition: Auto**             | Execute an AUTO transition 
**Transition: Fade to Black**    | Fade to Black on Program Bus       | **Action**: `Fade In`, `Fade Out`
**Audio Input: Set Volume**      | Set audio Volume | **Input**: `Available Inputs`, **Level**: `-60000 to 10000`
**Audio Input: Adjust by Increment** | Adjust input volume by an increment  | **Input**: `Available Inputs`, **Increment**: `-600000 to +60000`
**Audio Input: Set Gain**        | Set audio Gain                     | **Input**: `Available Inputs`, **Level**: `0 to 10000`
**Audio Input: Set Mute**        | Set audio Mute                     | **Input**: `Available Inputs`, **Mute**: `On`, `Off`
**Audio Input: Audio On Program**| Assign audio to program            | **Input**: `Available Inputs`, **Audio**: `Off`, `Always On`, `When Source is in Program` 
**Audio Input: Set Headphones**  | Set audio to headphones            | **Input**: `Available Inputs`, **Headphones**: `On`, `Off`
**Audio Master: Set Volume**     | Set Master channel volume          | **Master**: `Record`, `Stream`, **Level**: `-60000 to 10000`
**Audio Master: Adjust Volume Increment**| Adjust Master channel volume by an increment | **Master**: `Record`, `Stream`, **Increment**: `-60000 to +60000`
**Audio Master: Set Mute**       | Set mute on a Master Channel       | **Master**: `Record`, `Stream`, **Mute**: `On`, `Off`
**Audio Master: Set Headphones** | Set Master channel audio to headphones | **Master**: `Record`, `Stream`, **Headphones**: `On`, `Off`
**Record**                       | Control Recording                  | **Action**: `Start Recording`, `Stop Recording`
**Stream**                       | Control Streaming                   | **Action**: `Start Streaming`, `Stop Streaming`

---
## Available Feedback

The following feedback has been implemented allowing Companion to indicate the status and states of Livestream Studio

Feedback                      | Description                        
----------------------------- | ---------------------------------- 
**Preview Source**            | Indicate which input is in preview 
**Program Source**            | Indicate which input is in program
**GFX-`x` Active**            | GFX stack `x` is enabled (on)
**GFX-`x` Can Push**          | GFX stack `x` can be pushed (same as blinking `Push` button in the software)
**GFX-`x` State**             | GFX stack `x` state (`Pushed, Pulled`)
**GFX-`x` Preview**           | GFX stack `x` in Preview (`true, false`)
**Media Player State**        | Indicate the state of a Media player (`Playing full clip, playing in to out, paused`)
**Fade to Black State**       | Indicate if Fade to Black is acitve
**Audio Input: Level**        | Returns the value of an inputs level
**Audio Input: Gain**         | Returns the value of an input gain 
**Audio Input: Mute**         | Indicate the Mute state on an input
**Audio Input: Audio On Pgm** | Indicate the Audio on Program state for an input
**Audio Input: Headphones**   | Indicate the audio to headphones state of an input
**Record Master: Level**      | Returns the volume level of the Record Master
**Record Master: Mute**       | Indicate the Mute state on the Record Master
**Record Master: Headphones** | Indicate the Headphones state on the Record Master
**Stream Master: Level**      | Returns the volume level of the Stream Master
**Stream Master: Mute**       | Indicate the Mute state of the Stream Master
**Stream Master: Headphones** | Indicate the Headphones state for the Stream Master
**Record State**              | Indicates if Recording is active, or transitioning **Stream State**              | Indicates if Streaming is active, or transitionin

---
## Variables

The following variables are available to Companion. 

Variable                     | Description 
---------------------------- | ----------------------------------------------------- 
**$(studio:status)**         | Is Livestream Studio connected to Companion (`True`, `False`, `Error`)
**$studio:input_`x`_name)**  | Name of a given input `x`
**$studio:input_`x`_volume)**| Volume level of a given input `x`
**$studio:input_`x`_gain)**  | Gain level of a given input `x`
**$(studio:pvwSource)**      | Which input number is on the Preview Bus
**$(studio:pgmSource)**      | Which input number is on the Program Bus
**$(studio:GFX_`x`_active)** | Indicates if a GFX is active (on)
**$(studio:GFX_`x`_state)**  | Indicates the state of a GFX stack (`pulled, pushed`)
**$(studio:GFX_`x`_preview)**| Indicates if GFX stack is in preview (`true, false`)
**$(studio:media_`x`_state)**| State of Media `x` Player (`playingFull, playingClip, pause`)
**$(studio:recordVolume)**   | Master volume level of the record feed
**$(studio:streamVolume)**   | Master volume level of the streaming feed
**$(studio:streaming)**      | Streaming (`true, false, transitioning`)
**$(studio:recording)**      | Recording (`true, false, transitioning`)


---
## Presets

Presets have been created for many commond commands so that creating buttons is easy. 

Preset               | Description                                
-------------------- | --------------------------------------------------
**PRV `x` `name`**   | Sets a given source `x` to the Preview bus, includes input `name` 
**PGM `x` `name`**   | Sets a given source `x` to the Program Bus, includes input `name`
**CUT**              | Execute a CUT transition
**AUTO**             | Execute an AUTO transition
**Fade to Black**    | Fade to Black Toggle
**GFX-`x` Push/Pull**| GFX Push/Pull Toggle [`GFX-1, GFX-2, GFX-3`]
**GFX-`x` Preview**  | GFX Preview Toggle [`GFX-1, GFX-2, GFX-3`]
**Media-`x` Play/Pse**| Media-`x` Play/Pause Toggle
**Input 1 Vol +10%** | Increase Input 1 Volume 10%
**Input 1 Vol -10%** | Decrease Input 1 Volume 10%
**Stream**           | Toggle streaming on/off
**Record**           | Toggle recording on/off


---
### Notes
**IMPORTANT:** Vimeo Livestream Studio 6 has a very limited network API available. If there is a feature of the program that you do not see represented above, it is because that feature is NOT available through the API. Every available command has been implemented in this module. Please keep this in mind when submitting bugs & feature requests. 

##### (Refer to the README file in the [GitHub Repository](https://github.com/bitfocus/companion-module-vimeo-livestreamstudio6)  for a list of features not implemented by the Livestream Studio API.) 

---

That's it. Have fun and if you have any questions please submit an issue in this module's [GitHub Repository](https://github.com/bitfocus/companion-module-vimeo-livestreamstudio6) or leave a message on the official [Bitfocus Slack Channel](https://bitfocusio.slack.com/archives/CFG7HAN5N)
