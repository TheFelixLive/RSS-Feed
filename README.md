# RSS-Feed
![](https://github.com/user-attachments/assets/ff4ca6e3-40b3-4e04-ae4a-7e2909faaa1d)


## About
The Minecraft Bedrock RSS Reader is a script that lets players access real-time news, updates, or blog feeds directly within the game. Using this tool, you can stay informed with the latest headlines from your favorite websites or Minecraft news sources, without leaving your world.

# How to use?
1. Open the menu (by sneaking and jumping at the same time, noding in spectator mode or by interacting with a stick)
2. Select `Settings`
3. Add a RSS Feed with it's URL & Have fun!
![](https://github.com/user-attachments/assets/afd554e3-fd77-4dfb-be67-a87024db300c)

# Installation

> [!WARNING]
> This add-on only works on a [dedicated server](https://www.minecraft.net/download/server/bedrock). Other clients (consoles, phones, etc.) can join to the server after the installation.

<details open>
   <summary>Windows (Client + Server) - Recommended</summary>

   ## 1. Get the Add‑On
   - Download the latest `.mcpack` / `.mcaddon` [here](https://github.com/TheFelixLive/RSS-Feed/releases/latest)

   ## 2. Prepare your World
   1. Double‑click the downloaded file to import it.
   2. Launch Minecraft and open (or create) your world.
   3. Go to **Behavior Packs → Available** and activate **RSS‑Feed**.
   4. Under **Experiments**, enable **Beta APIs**, then **Play** or **Create**.
   5. Close Minecraft once it’s loaded.

   ## 3. Prepare the Dedicated Server
   1. Download the latest server ZIP [here](https://www.minecraft.net/download/server/bedrock)
   2. Extract it to a folder and run `bedrock_server.exe` once (allow firewall access).
   3. When you see **“Server started.”**, close it.

   ## 4. Copy Your World
   1. Press `Win + R`, paste:
      ```
      %localappdata%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\minecraftWorlds
      ```
   2. Copy the most‑recently modified world folder into your server’s `worlds` directory.
   3. Delete the default `Bedrock level` folder and rename your copied folder to `Bedrock level`.

   ## 5. Set Up the Bedrock Dedicated Server
   1. Open `config/default/permissions.json` in your server folder.
   2. Replace its contents with:
      ```json
      {
      "allowed_modules": [
         "@minecraft/server-gametest",
         "@minecraft/server",
         "@minecraft/server-ui",
         "@minecraft/server-admin",
         "@minecraft/server-editor",
         "@minecraft/server-net"
      ]
      }
      ```
   3. Run `bedrock_server.exe` again. You should see:
      ```
      Experiment(s) active: gtst
      Hello from RSS‑Feed …
      ```

   ## 6. Connect & Play
   - Run `bedrock_server.exe`
   - In Minecraft, either join the LAN world automatically or add your [server’s IP](https://www.google.com/search?q=what's+my+local+ip+windows+and+linux) under **Servers**.
</details>

<details>
   <summary>Server + NBT Editor</summary>

   ## 1. Prepare the Dedicated Server
   1. Download the latest server ZIP [here](https://www.minecraft.net/download/server/bedrock)
   2. Extract it to a folder and run `bedrock_server` once (allow firewall access).
   3. When you see **“Server started.”**, close it.

   ## 2. Set Up your World
   1. With in `worlds/Bedrock level`: Create a folder called `behavior_packs` & a file called `world_behavior_packs.json`
   2. Paste that in to `world_behavior_packs.json`:
      ```json
      [
         {
            "pack_id" : "f3c8b1d2-4a5e-4b6c-9f0e-7c8d9f1e2b3a",
            "version" : [ 1, 0, 0 ]
         }
      ]
      ```
   3. Delete `level.dat_old`
   4. Open `level.dat` with a NBT Editor (e.g. [VS Code](https://marketplace.visualstudio.com/items?itemName=Misodee.vscode-nbt))
   5. Add a Tag under experiments called `gametest` with a value of `1`

   <img width="565" height="327" src="https://github.com/user-attachments/assets/8f0dfb7f-0aad-49ef-aa61-08d79e0971e9" />
   

   7. Download the latest `.mcpack` / `.mcaddon` [here](https://github.com/TheFelixLive/RSS-Feed/releases/latest)
   8. Extract it to `worlds/Bedrock level/behavior_packs`. You may have to rename it `.zip`

   ## 3. Set Up the Bedrock Dedicated Server
   1. Open `config/default/permissions.json` in your server folder.
   2. Replace its contents with:
      ```json
      {
      "allowed_modules": [
         "@minecraft/server-gametest",
         "@minecraft/server",
         "@minecraft/server-ui",
         "@minecraft/server-admin",
         "@minecraft/server-editor",
         "@minecraft/server-net"
      ]
      }
      ```
   3. Run `bedrock_server` again. You should see:
      ```
      Experiment(s) active: gtst
      Hello from RSS‑Feed …
      ```

   ## 4. Connect & Play
   - Run `bedrock_server`
   - In Minecraft, either join the LAN world automatically or add your [server’s IP](https://www.google.com/search?q=what's+my+local+ip+windows+and+linux) under **Servers**.
</details>

# Multiple Menu
This add-on supports multiple menus. But what does that actually mean?
If you have at least two add-ons and want to open the menu, they will be displayed simultaneously. With multiple menu, the add-ons can communicate with each other, and only one menu will open. Just look for this icon: <img src="https://github.com/user-attachments/assets/43fc6418-62e1-424d-aeaa-424be79eff39" width="20" height="auto" />

![Minecraft 07 07 2025 14_29_26](https://github.com/user-attachments/assets/99c7853d-ced4-4ddc-9280-112d37675118)

> Was captured while the Timer and Command2Hard were active

<details>
<summary>Implication in your addon</summary>
<p>If you want you can copy this code to your own addon to implement the Multiple Menu System. I do my best to describe what function needs to be implemented and when they’re called.</p>

<pre><code>
/* ─────────────────────────────────────────────────────────
This code is part of the Multiple Menu System by TheFelixLive:
─────────────────────────────────────────────────────────*/

// MUST CHANGE: Addon information
let addon_name = "My new Addon"
let addon_uuid = 41bc0f18-edc3-427a-a5a8-36dede25df56 // Doesn't have to be a UUID, it just has to be unique
let addon_texture_path = "textures/ui/hardcore/heart"

let main_menu = (player) => {
   your_menu(player); // This function is called when your addon is selected
}

// Make sure that multiple_menu(player) is called by your addon! If multiple_menu isn't enabled, it will automatically open your menu.


// Required models
import { system, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui"

// Status
let system_privileges = 2

/* This variable contains the status (or permissions) of your add-on:
2 means the system is not active (no other packs found);
1 means the system is acting as a host;
0 means the system is acting as a client;
*/

/*------------------------
 Client (an addon only needs to have the client function to be recognizable)
-------------------------*/

system.afterEvents.scriptEventReceive.subscribe(event=> {
   let player = event.sourceEntity

   // Sends the addon information to the host
   if (event.id === "multiple_menu:initialize") {
      world.scoreboard.getObjective("multiple_menu_name").setScore(addon_uuid + "_" + addon_name, 1);
      world.scoreboard.getObjective("multiple_menu_icon").setScore(addon_uuid + "_" + addon_texture_path, 1);
      if (system_privileges == 2) system_privileges = 0;
   }

   // Host Only (which is why system_privileges == 1): Opens the multiple menu, is called by other addons as a back button
   if (event.id === "multiple_menu:open_main" && system_privileges == 1) {
      multiple_menu(player);
   }

   // Will open the main menu of your addon
   if (event.id === "multiple_menu:open_"+addon_uuid) {
      main_menu(player);
   }
})

/*------------------------
 Host
-------------------------*/

let addon_name, addon_id, addon_icon; // When initialized properly, it contains the data of all supported add-ons

system.run(() => {
   initialize_multiple_menu()
});

async function initialize_multiple_menu() {
   // This fallback ensures that even if multiple add-ons could act as host, only one of them will be used as the host.
   try {
      world.scoreboard.addObjective("multiple_menu_name");
      world.scoreboard.addObjective("multiple_menu_icon");
      console.log("Multiple Menu: Initializing Host");
      system_privileges = 1;
   } catch (e) {
      console.log("Multiple Menu: Already Initialized");
      return -1;
   }

   // Requests addon information. Look into the Client
   world.getDimension("overworld").runCommand("scriptevent multiple_menu:initialize");

   await system.waitTicks(2);
   console.log("Multiple Menu: successfully initialized as Host");

   // Evaluation of the add-on information
   const participants = world.scoreboard.getObjective("multiple_menu_name").getParticipants();
   addon_id = participants.map(p => p.displayName.split("_")[0]);
   addon_name = participants.map(p => p.displayName.split("_").slice(1).join("_"));
   addon_icon = world.scoreboard.getObjective("multiple_menu_icon").getParticipants().map(p => p.displayName.split("_").slice(1).join("_"));

   if (addon_id.length == 1) {
      console.log("Multiple Menu: no other plugin found");
      system_privileges = 2;
   }

   world.scoreboard.removeObjective("multiple_menu_name")
   world.scoreboard.removeObjective("multiple_menu_icon")
}

/*------------------------
 Host Only: Menu
-------------------------*/

function multiple_menu(player) {
   // Skips the multiple_menu
   if (system_privileges == 2) return main_menu(player);

   let form = new ActionFormData();
   let actions = [];

   form.title("Multiple menu v.1.0");
   form.body("Select an addon to open its menu");

   // Adds every Addon as a button
   addon_name.forEach((name, index) => {
      form.button(name, addon_icon[index]);

      actions.push(() => {
         player.runCommand("scriptevent multiple_menu:open_"+ addon_id[index]);
      });
   });

   form.show(player).then((response) => {
      if (response.selection == undefined ) {
         return -1
      }

      if (actions[response.selection]) {
         actions[response.selection]();
      }
   });
}
</code></pre>

</details>

# License & Attribution
This project is licensed under the [MIT License](./LICENSE).

### Attribution Requirements
1. **Social Media Reviews:**
   - If you share reviews, screenshots, videos, or posts about this project on social media—which I would appreciate—please include:
     - the project name: **RSS-Feed**
     - the official download link: `https://github.com/TheFelixLive/RSS-Feed`
     - the creator: **TheFelixLive**

2. **Using Code in Your Own Projects:**
   - You are allowed to use code snippets from this repository in your own projects under the following conditions:
     - The copied code does **not** make up the **majority** of your project.
     - The reused code must be **clearly marked** with a comment in your code, for example:
        ```
        /* ─────────────────────────────────────────────────────────
           This code is part of RSS-Feed by TheFelixLive:
           https://github.com/TheFelixLive/RSS-Feed
        ─────────────────────────────────────────────────────────*/
        ```

> Thank you for respecting the license terms and supporting this project!
