## A Companion module to control [Vimeo Livestream Studio 6](https://livestream.com/studio/)

Livestream Studio 6 will transform your computer into a professional live production control room that can Input multiple feeds, add graphics, master audio, and stream in one robust, easy-to-use package. This module provides control of Studio 6 with Companion. 

This module was developed against **Livestream Studo ver 6.8.20**

## Configuration

This module is for Vimeo Livestream Studio 6 production swithcer software. To configure: 
- In the module settings add the **IP address** of the machine where Livestream Studio 6 is running. If it is running on the same machine as Companion then use the default of `127.0.0.1`.
- **Important:** You must go to the **Hardware Control** tab in Livestream Studio 
settings and enable **Allow Incoming Connections**.

- Now enable the module in Companion so that it initialtes a connnection to Livestream Studio. 

- Then back in Livestream Studio settings under **Pending Connections**, click **Allow** for the IP address where Companion will be connecting from.
   
- **Note:** The TCP port in Livesteam Studio 6 is locked to port `9923` can **CANNOT** be changed by the user. The ability to set a port exists in this module for those users who wish to implement port proxying/remapping. Only change the TCP Port in you know what you are doing.

---
## Available Actions

The following actions are available to assign to a button.

Action                   | Description                  
-----------------------: | ---------------------------- 
**Set Preview Bus Source**| Sets the source on the Preview Bus [**Input**: `Available Inputs`]
**Set Program Bus Source**| Sets the source on the Program Bus [**Input**: `Available Inputs`]
**Control GFX Source**   | Control GFX Souces [**GFX Stack**: `1-3`, **Action**: `Push`, `Pull`, `Preview`]
**Control Media Source** | Control Media Source [**Media Souce**: `Available Media Inputs`, **Action**: `Play`, `Pause`]
**Cut Transition**       | Execute a CUT transition 
**Auto Transition**      | Execute an AUTO transition 
**Fade to Black**        | Fade to Black on Program Bus [**Action**: `Fade In`, `Fade Out`]
**Set Input Audio Volume**| Set audio Volume [**Input**: `Available Inputs`, **Level**: `-60000 to 10000`]
**Set Input Audio Gain**| Set audio Gain [**Input**: `Available Inputs`, **Level**: `0 to 10000`]
**Input Audio Mute**     | Set audio Mute [**Input**: `Available Inputs`, **Mute**: `On`, `Off`]
**Audio On Program**     | Assign audio to program [**Input**: `Available Inputs`, **Audio**: `Off`, `Always On`, `When Source is in Program` ]
**Audio Headphones**     | Set audio to headphones [**Input**: `Available Inputs`, **Headphones**: `On`, `Off`]
**Record**               | Control Recording [**Action**: `Start Recording`, `Stop Recording`]
**Stream**               | Control Streaming [**Action**: `Start Streaming`, `Stop Streaming`]

---
## Available Feedback

The following feedback has been implemented allowing Companion to indicate the status and states of Livestream Studio

Feedback          | Description                        
----------------- | ---------------------------------- 
 **Preview Source**| Indicate which input is in preview 

 ---
## Variables

The following variables are available to Companion. 

Variable                       | Description 
------------------------------ | ----------------------------------- 
**$(livestreamstudio:status)** | The current status of the connection to Livestream Studio (`Connected`, `Not Connected`, `Error`)
**$(livestreamstudio:input_`x`_name)** | Name of a given input `x`


---
## Presets

Presets have been created for many commond commands so that creating buttons is easy. 

Preset          | Description                                
--------------- | -------------------------------------------
**PRV Source**  | Moves a given source into the Preview bus 

---
### Notes
- Notes go here

---

That's it. Have fun and if you have any questions please submit an issue in this module's [GitHub Repository](https://github.com/bitfocus/companion-module-vimeo-livestreamstudio6) or leave a message on the official [Bitfocus Slack Channel](https://bitfocusio.slack.com/archives/CFG7HAN5N)
