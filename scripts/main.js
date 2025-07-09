import { system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData  } from "@minecraft/server-ui"
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';


const version_info = {
  name: "RSS-Feed",
  version: "v.2.1.0",
  build: "B000",
  release_type: 0, // 0 = Development version (with debug); 1 = Beta version; 2 = Stable version
  unix: 1751897705,
  update_message_period_unix: 15897600, // Normally 6 months = 15897600
  uuid: "f3c8b1d2-4a5e-4b6c-9f0e-7c8d9f1e2b3a",
  changelog: {
    // new_features
    new_features: [
    ],
    // general_changes
    general_changes: [
    ],
    // bug_fixes
    bug_fixes: [
    ]
  }
}

const links = [
  {name: "§l§5Github:§r", link: "github.com/TheFelixLive/Command2Hardcore"},
  {name: "§l§8Curseforge:§r", link: "curseforge.com/projects/1277546"},
  {name: "§l§aMcpedl:§r", link: "mcpedl.com/com2hard"},
]


console.log("Hello from " + version_info.name + " - "+version_info.version+" ("+version_info.build+") - Further debugging is "+ (version_info.release_type == 0? "enabled" : "disabled" ) + " by the version")


/*------------------------
  Handshake with timer
-------------------------*/

// 2 = Standalone, 1 = Multiple Menu: Host, 0 = Multiple Menu: Client
let system_privileges = 2

/*------------------------
  Client
-------------------------*/

system.afterEvents.scriptEventReceive.subscribe(event=> {
  if (event.id === "multiple_menu:initialize") {
    world.scoreboard.getObjective("multiple_menu_name").setScore(version_info.uuid + "_" + version_info.name, 1);
    world.scoreboard.getObjective("multiple_menu_icon").setScore(version_info.uuid + "_" , 1);
    if (system_privileges == 2) system_privileges = 0;
  }
  if (event.id === "multiple_menu:open_main" && system_privileges == 1) {
    multiple_menu(event.sourceEntity);
  }

  if (event.id === "multiple_menu:open_"+version_info.uuid) {
    main_menu(event.sourceEntity);
  }
})


/*------------------------
  Host
-------------------------*/
let addon_name, addon_id, addon_icon;
system.run(() => {
  initialize_multiple_menu()
});

async function initialize_multiple_menu() {
  try {
    world.scoreboard.addObjective("multiple_menu_name");
    world.scoreboard.addObjective("multiple_menu_icon");
    print("Multiple Menu: Initializing Host");
    system_privileges = 1;
  } catch (e) {
    print("Multiple Menu: Already Initialized");
    return -1;
  }

  world.getDimension("overworld").runCommand("scriptevent multiple_menu:initialize");

  await system.waitTicks(2);
  print("Multiple Menu: successfully initialized as Host");

  const participants = world.scoreboard.getObjective("multiple_menu_name").getParticipants();
  addon_id = participants.map(p => p.displayName.split("_")[0]);
  addon_name = participants.map(p => p.displayName.split("_").slice(1).join("_"));
  addon_icon = world.scoreboard.getObjective("multiple_menu_icon").getParticipants().map(p => p.displayName.split("_").slice(1).join("_"));

  if (addon_id.length == 1) {
    print("Multiple Menu: no other plugin found");
    system_privileges = 2;
  }

  world.scoreboard.removeObjective("multiple_menu_name")
  world.scoreboard.removeObjective("multiple_menu_icon")
}

function multiple_menu(player) {
  let form = new ActionFormData();
  let actions = [];

  form.title("Multiple menu v.1.0");
  form.body("Select an addon to open it's menu");

  addon_name.forEach((name, index) => {
    form.button(name, addon_icon[index]);

    actions.push(() => {
      player.runCommand("scriptevent multiple_menu:open_"+ addon_id[index]);
    });
  });
  form.divider()
  form.label("Settings")

  form.button("Gestures", "textures/ui/sidebar_icons/emotes");
  actions.push(() => {
    settings_gestures(player)
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

/*------------------------
 Save Data
-------------------------*/


// Creates or Updates Save Data if not present
system.run(() => {
  let save_data = load_save_data();

  const default_save_data_structure = {fetch_message_time: 20, update_message_unix: (version_info.unix + version_info.update_message_period_unix)};

  if (!save_data) {
      save_data = [default_save_data_structure];
      print("Creating save_data...");
  } else {
      let data_entry = save_data[0];
      let changes_made = false;

      function merge_defaults(target, defaults) {
          for (const key in defaults) {
              if (defaults.hasOwnProperty(key)) {
                  if (!target.hasOwnProperty(key)) {
                      target[key] = defaults[key];
                      changes_made = true;
                  } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
                      if (typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key])) {
                          target[key] = defaults[key];
                          changes_made = true;
                      } else {
                          merge_defaults(target[key], defaults[key]);
                      }
                  }
              }
          }
      }

      merge_defaults(data_entry, default_save_data_structure);
      if (!Array.isArray(save_data) || save_data.length === 0) {
          save_data = [data_entry];
          changes_made = true;
      } else {
          save_data[0] = data_entry;
      }

      if (changes_made) {
          print("Missing save_data attributes found and added.");
      }
  }

  update_save_data(save_data);
})


// Load & Save Save data
function load_save_data() {
    let rawData = world.getDynamicProperty("com2hard:save_data");

    if (!rawData) {
        return;
    }

    return JSON.parse(rawData);
}


function update_save_data(input) {
    world.setDynamicProperty("com2hard:save_data", JSON.stringify(input))
};

function delete_player_save_data(player) {
  let save_data = load_save_data();

  save_data = save_data.filter(entry => entry.id !== player.id);
  update_save_data(save_data);
}



// Add player if not present
function create_player_save_data(playerId, playerName) {
  let save_data = load_save_data();

  // Define the default structure for a new player's save data
  const default_player_save_data_structure = (is_op_initial) => ({
      id: playerId,
      name: playerName,
      op: is_op_initial, // This will be determined when the player is first added
      last_unix: Math.floor(Date.now() / 1000),
      gesture: { emote: false, sneak: true, nod: true, stick: true },
      url: [],
  });

  let player_sd_index = save_data.findIndex(entry => entry.id === playerId);
  let player_data;

  // Helper function to recursively merge default values
  const merge_defaults = (target, defaults) => {
      for (const key in defaults) {
          if (defaults.hasOwnProperty(key)) {
              if (!target.hasOwnProperty(key)) {
                  // Key is missing, add it with default value
                  target[key] = defaults[key];
              } else if (typeof defaults[key] === 'object' && defaults[key] !== null && !Array.isArray(defaults[key])) {
                  // If the default value is an object, recurse into it
                  if (typeof target[key] !== 'object' || target[key] === null || Array.isArray(target[key])) {
                      // If the existing value is not an object or is null/array, replace it with the default structure
                      target[key] = defaults[key];
                      changes_made = true;
                  } else {
                      merge_defaults(target[key], defaults[key]);
                  }
              }
          }
      }
  };

  if (player_sd_index === -1) {
      // Player does not exist, create new entry
      let should_be_op = true;

      for (let entry of save_data) {
          if (entry.op === true) {
              should_be_op = false;
              break;
          }
      }

      print(`Player ${playerName} (${playerId}) added with op=${should_be_op}!`);

      player_data = default_player_save_data_structure(should_be_op);
      save_data.push(player_data);
  } else {
      // Player exists, get their data
      player_data = save_data[player_sd_index];

      // Update player name if it's different
      if (player_data.name !== playerName) {
          player_data.name = playerName;
      }

      const dynamic_default_structure = default_player_save_data_structure(player_data.op);
      merge_defaults(player_data, dynamic_default_structure);

  }

  update_save_data(save_data);
  print(`Save data for player ${playerName} updated.`);
}

world.afterEvents.playerJoin.subscribe(({ playerId, playerName }) => {
  create_player_save_data(playerId, playerName);
})

// TODO
world.afterEvents.playerSpawn.subscribe(async (eventData) => {
  const { player, initialSpawn } = eventData;
  if (!initialSpawn) return -1
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  await system.waitTicks(40); // Wait for the player to be fully joined

  if (version_info.release_type !== 2 && save_data[player_sd_index].op) {
    player.sendMessage("§l§7[§f" + ("System") + "§7]§r "+ save_data[player_sd_index].name +" how is your experiences with "+ version_info.version +"? Does it meet your expectations? Would you like to change something and if so, what? Do you have a suggestion for a new feature? Share it at §l"+links[0].link)
    player.playSound("random.pop")
  }

  // Help reminder: how to open the menu
  if (save_data[player_sd_index].last_unix == undefined || save_data[player_sd_index].last_unix > (Math.floor(Date.now() / 1000) + 604800)) {
    if (save_data[player_sd_index].op) {
      player.sendMessage("§l§6[§eHelp§6]§r You can always open the menu with the sneak-jump (or in spectator with the nod) gesture or with a stick")
      player.playSound("random.pop")
    }
    if (save_data[player_sd_index].last_unix == undefined) {
      save_data[player_sd_index].last_unix = Math.floor(Date.now() / 1000)
      update_save_data(save_data)
    }
  }


  // Update popup
  if (save_data[player_sd_index].op && (Math.floor(Date.now() / 1000)) > save_data[0].update_message_unix && system_privileges !== 0) {
    let form = new ActionFormData();
    form.title("Update time!");
    form.body("Your current version (" + version_info.version + ") is older than 6 months.\nThere MIGHT be a newer version out. Feel free to update to enjoy the latest features!\n\nCheck out: §7"+links[0].link);
    form.button("Mute");

    const showForm = async () => {
      form.show(player).then((response) => {
        if (response.canceled && response.cancelationReason === "UserBusy") {
          showForm()
        } else {
          if (response.selection === 0) {
            save_data[0].update_message_unix = (Math.floor(Date.now() / 1000)) + version_info.update_message_period_unix;
            update_save_data(save_data);
          }
        }
      });
    };
    showForm();
  }
});

/*------------------------
 Open the menu
-------------------------*/

// via. item
world.beforeEvents.itemUse.subscribe(event => {
  const save_data = load_save_data();
  const idx = save_data.findIndex(e => e.id === event.source.id);

  if (event.itemStack.typeId === "minecraft:stick" && save_data[idx].gesture.stick) {
      system.run(() => {
        if (save_data[idx].op && system_privileges !== 0) {
          event.source.playSound("random.pop2")
          system_privileges == 1 ? multiple_menu(player) : main_menu(player);
        }
      });
  }
});

// via. jump gesture
const gestureCooldowns_jump = new Map();
const gestureState_reset = new Map(); // Speichert, ob Sneak+Jump zurückgesetzt wurden

async function gesture_jump() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    const lastUsed = gestureCooldowns_jump.get(player.id) || 0;
    const state = gestureState_reset.get(player.id) || { reset: true }; // true = darf wieder ausgelöst werden

    const isSneaking = player.isSneaking;
    const isJumping = player.isJumping;

    // Wenn beide false sind, erlauben wir wieder eine Auslösung beim nächsten Mal
    if (!isSneaking && !isJumping) {
      gestureState_reset.set(player.id, { reset: true });
    }

    // Wenn beide true sind UND vorher ein Reset war UND Cooldown abgelaufen
    if (isSneaking && isJumping && state.reset && (now - lastUsed >= 100)) {
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.sneak && save_data[idx].op && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : main_menu(player);
      }

      gestureCooldowns_jump.set(player.id, now);
      gestureState_reset.set(player.id, { reset: false }); // Warten bis beide wieder false sind
      await system.waitTicks(10);
    }
  }
}


// via. emote gesture
const gestureCooldowns_emote = new Map();
const gestureState_reset_emote = new Map(); // Speichert, ob Emote zurückgesetzt wurde

async function gesture_emote() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    const lastUsed = gestureCooldowns_emote.get(player.id) || 0;
    const state = gestureState_reset_emote.get(player.id) || { reset: true };

    const isEmoting = player.isEmoting;

    // Wenn Emoting zwischendurch false ist → Reset erlauben
    if (!isEmoting) {
      gestureState_reset_emote.set(player.id, { reset: true });
    }

    // Wenn Emoting aktiv ist, Reset gesetzt ist und Cooldown abgelaufen ist → Menü öffnen
    if (isEmoting && state.reset && (now - lastUsed >= 100)) {
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.emote && save_data[idx].op && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : main_menu(player);
      }

      gestureCooldowns_emote.set(player.id, now);
      gestureState_reset_emote.set(player.id, { reset: false }); // Bis zum nächsten Emote-Ende blockieren
      await system.waitTicks(10);
    }
  }
}


// via. nod gesture
const playerHeadMovement = new Map();

async function gesture_nod() {
  const now = Date.now();

  for (const player of world.getAllPlayers()) {
    if (player.getGameMode() !== "Spectator") continue;

    const { x: pitch } = player.getRotation();

    const prev = playerHeadMovement.get(player.id) || {
      state: "idle",
      timestamp: now,
    };
    let { state, timestamp: lastTime } = prev;

    if (state === "idle" && pitch < -13) {
      state = "lookingUp";
      lastTime = now;
    }
    else if (state === "lookingUp" && pitch > 13) {
      const save_data = load_save_data();
      const idx = save_data.findIndex(e => e.id === player.id);
      if (save_data[idx].gesture.nod && save_data[idx].op && system_privileges !== 0) {
        player.playSound("random.pop2")
        system_privileges == 1 ? multiple_menu(player) : main_menu(player);
      }

      state = "idle";
      lastTime = now;
    }
    else if (state === "lookingUp" && now - lastTime > 1000) {
      state = "idle";
      lastTime = now;
    }

    playerHeadMovement.set(player.id, { state, timestamp: lastTime });
  }
}



/*------------------------
 general helper functions
-------------------------*/

function print(input) {
  if (version_info.release_type === 0) {
    console.log(version_info.name + " - " + input)
  }
}

function getRelativeTime(diff) {
  let seconds = diff;
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let months = Math.floor(days / 30);
  let years = Math.floor(days / 365);

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''}`;
  }
  if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''}`;
  }
  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''}`;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  return `a few seconds`;
}



function convertUnixToDate(unixSeconds, utcOffset) {
  const date = new Date(unixSeconds*1000);
  const localDate = new Date(date.getTime() + utcOffset * 60 * 60 * 1000);

  // Format the date (YYYY-MM-DD HH:MM:SS)
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localDate.getUTCDate()).padStart(2, '0');
  const hours = String(localDate.getUTCHours()).padStart(2, '0');
  const minutes = String(localDate.getUTCMinutes()).padStart(2, '0');
  const seconds = String(localDate.getUTCSeconds()).padStart(2, '0');

  return {
    day: day,
    month: month,
    year: year,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    utcOffset: utcOffset
  };
}








/*------------------------
 Menus
-------------------------*/


function main_menu(player) {
  let form = new ActionFormData();
  let actions = [];

  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Main menu");
  form.body("Select an option!");

  // Button: Settings
  form.button("Settings", "textures/ui/debug_glyph_color");
  actions.push(() => {
    settings_main(player);
  });

  if (system_privileges !== 2) {
    form.button("");
    actions.push(() => {
      player.runCommand("/scriptevent multiple_menu:open_main")
    });
  }

  form.show(player).then((response) => {
    if (response.selection === undefined) {
      return -1;
    }

    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}


/*------------------------
 Settings
-------------------------*/


function settings_main(player) {
  let form = new ActionFormData();
  let actions = [];
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Settings");
  form.body("Your self");

  // Button 3: Gestures
  if (system_privileges == 2) {
    form.button("Gestures", "textures/ui/sidebar_icons/emotes");
    actions.push(() => {
      settings_gestures(player)
    });
  }

  form.divider()
  form.label("Multiplayer");

  // Button 1: Permission
  if (save_data[player_sd_index].op) {
    form.button("Permission\n" + (() => {
      const players = world.getAllPlayers();
      const ids = players.map(p => p.id);
      const names = save_data.slice(1).sort((a, b) =>
        ids.includes(a.id) && !ids.includes(b.id) ? -1 :
        ids.includes(b.id) && !ids.includes(a.id) ? 1 : 0
      ).map(e => e.name);
      return names.length > 1 ? names.slice(0, -1).join(", ") + " u. " + names[names.length - 1] : names.join(", ");
    })(), "textures/ui/op");
    actions.push(() => {
      settings_rights_main(player, true)
    });
  }

  form.divider()
  form.label("Version");

  // Button 5: Debug
  if (version_info.release_type == 0 && save_data[player_sd_index].op) {
    form.button("Debug\n", "textures/ui/ui_debug_glyph_color");
    actions.push(() => {
      debug_main(player);
    });
  }

  // Button 6: Dictionary
  form.button("About\n", "textures/ui/infobulb");
  actions.push(() => {
    dictionary_about_version(player)
  });

  form.divider()

  // Back to main menu
  form.button("");
  actions.push(() => {
    main_menu(player)
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }

    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

/*------------------------
 Gestures
-------------------------*/

function settings_gestures(player) {
  const form = new ActionFormData();
  const save_data = load_save_data();
  const idx = save_data.findIndex(e => e.id === player.id);
  const playerGestures = save_data[idx].gesture;
  let actions = [];

  const configured_gestures = {
    emote:    ["su","a","c"],
    sneak:    ["su","a","c"],
    nod:      ["sp"],
    stick:    ["su","a","c"]
  };

  form.title("Gestures");
  form.body("Choose your own configuration of how the menu should open!");

  const available = Object.keys(configured_gestures);

  // Hilfsfunktion für Großschreibung
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Zähle für jeden Modus (su, a, c, sp) wie viele Gesten aktiv sind
  const modeCounts = {
    su: 0, a: 0, c: 0, sp: 0
  };

  available.forEach(gesture => {
    if (playerGestures[gesture]) {
      configured_gestures[gesture].forEach(mode => {
        modeCounts[mode]++;
      });
    }
  });

  available.forEach(gesture => {
    const isOn = playerGestures[gesture];
    let label = `${capitalize(gesture)}\n${isOn ? "§aon" : "§coff"}`;
    let icon = isOn ? "textures/ui/toggle_on" : "textures/ui/toggle_off";
    let alwaysActive = false;

    // Wenn diese Geste aktiv ist und in einem Modus die einzige aktive Geste ist → restricted
    const restricted = isOn && configured_gestures[gesture].some(mode => modeCounts[mode] === 1);
    if (restricted) {
      label = `${capitalize(gesture)}\n§orestricted`;
      icon = "textures/ui/hammer_l_disabled";
      alwaysActive = true;
    }

    form.button(label, icon);

    actions.push(() => {
      if (!alwaysActive) {
        playerGestures[gesture] = !playerGestures[gesture];
        update_save_data(save_data);
      }
      settings_gestures(player);
    });
  });

  form.divider()
  form.button("");
  actions.push(() => {
    if (system_privileges == 2) {
      settings_main(player);
    } else {
      player.runCommand("scriptevent multiple_menu:open_main");
    }
  });

  form.show(player).then(response => {
    if (response.selection === undefined) {
      return -1
    }
    const sel = response.selection;
    if (typeof actions[sel] === "function") actions[sel]();
  });
}

/*------------------------
 Dictionary
-------------------------*/

function dictionary_about_version(player) {
  let form = new ActionFormData()
  let actions = []
  let save_data = load_save_data()
  let build_date = convertUnixToDate(version_info.unix, save_data[0].utc || 0);
  form.title("About")
  form.body(
    "Name: " + version_info.name + "\n" +
    "Version: " + version_info.version + ((Math.floor(Date.now() / 1000)) > (version_info.update_message_period_unix + version_info.unix)? " §a(update time)§r" : " (" + version_info.build + ")") + "\n" +
    "Release type: " + ["dev", "preview", "stable"][version_info.release_type] + "\n" +
    "UUID: "+version_info.uuid + "\n" +
    "Build date: " + (save_data[0].utc == undefined ? getRelativeTime(Math.floor(Date.now() / 1000) - version_info.unix, player) +" ago\n\n§7Note: Set the time zone to see detailed information" : `${build_date.day}.${build_date.month}.${build_date.year} ${build_date.hours}:${build_date.minutes}:${build_date.seconds} (UTC${build_date.utcOffset >= 0 ? '+' : ''}${build_date.utcOffset})`) +

    "\n\n§7© "+ (build_date.year > 2025? "2025 - "+build_date.year : build_date.year )+" TheFelixLive. Licensed under the MIT License."
  )

  if (version_info.changelog.new_features.length > 0 || version_info.changelog.general_changes.length > 0 || version_info.changelog.bug_fixes.length > 0) {
    form.button("§9Changelog");
    actions.push(() => {
      dictionary_about_version_changelog(player, build_date)
    });
  }

  form.button("§3Contact");
  actions.push(() => {
    dictionary_contact(player, build_date)
  });

  form.divider()
  form.button("");
  actions.push(() => {
    return settings_main(player);
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function dictionary_contact(player, build_date) {
  let form = new ActionFormData()
  let save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  // Yes, that's right, you're not dumping the full "save_data". The player names are removed here for data protection reasons
  save_data = save_data.map(entry => {
    if ("name" in entry) {
      return { ...entry, name: "" };
    }
    return entry;
  });
  // and this adds information about the dump date and version to ensure whether a dump matches a bug
  save_data.push({ dump_unix:Math.floor(Date.now() / 1000), name:version_info.name, version:version_info.version, build:version_info.build });

  let actions = []
  form.title("Contact")
  form.body("If you need want to report a bug, need help, or have suggestions to improvements to the project, you can reach me via these platforms:\n");

  for (const entry of links) {
    if (entry !== links[0]) form.divider()
    form.label(`${entry.name}\n${entry.link}`);
  }

  if (save_data[player_sd_index].op) {
    form.button("Dump SD" + (version_info.release_type !== 2? "\nvia. privat chat" : ""));
    actions.push(() => {
      player.sendMessage("§l§7[§f"+ ("System") + "§7]§r SD Dump:\n"+JSON.stringify(save_data))
    });

    if (version_info.release_type !== 2) {
      form.button("Dump SD\nvia. server console");
      actions.push(() => {
        console.log(JSON.stringify(save_data))
      });
    }
  }
  form.divider()
  form.button("");
  actions.push(() => {
    dictionary_about_version(player, build_date)
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function dictionary_about_version_changelog(player, build_date) {
  const { new_features, general_changes, bug_fixes, unix } = version_info.changelog;
  const sections = [
    { title: "§l§bNew Features§r", items: new_features },
    { title: "§l§aGeneral Changes§r", items: general_changes },
    { title: "§l§cBug Fixes§r", items: bug_fixes }
  ];

  const form = new ActionFormData().title("Changelog - " + version_info.version);

  let bodySet = false;
  for (let i = 0; i < sections.length; i++) {
    const { title, items } = sections[i];
    if (items.length === 0) continue;

    const content = title + "\n\n" + items.map(i => `- ${i}`).join("\n\n");

    if (!bodySet) {
      form.body(content);
      bodySet = true;
    } else {
      form.label(content);
    }

    // Add divider if there's at least one more section with items
    if (sections.slice(i + 1).some(s => s.items.length > 0)) {
      form.divider();
    }
  }

  const dateStr = `${build_date.day}.${build_date.month}.${build_date.year}`;
  const relative = getRelativeTime(Math.floor(Date.now() / 1000) - unix);
  form.label(`§7As of ${dateStr} (${relative} ago)`);
  form.button("");

  form.show(player).then(res => {
    if (res.selection === 0) dictionary_about_version(player);
  });
}

/*------------------------
 Debug
-------------------------*/


function debug_main(player) {
  let form = new ActionFormData()
  let actions = []
  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.body("DynamicPropertyTotalByteCount: "+world.getDynamicPropertyTotalByteCount() +" of 32767 bytes used ("+Math.floor((world.getDynamicPropertyTotalByteCount()/32767)*100) +" Procent)")


  form.button("§e\"save_data\" Editor");
  actions.push(() => {
    debug_sd_editor(player, () => debug_main(player), [])
  });


  form.button("§aAdd player (save data)");
  actions.push(() => {
    return debug_add_fake_player(player);
  });

  form.button("§cRemove \"save_data\"");
  actions.push(() => {
    world.setDynamicProperty("com2hard:save_data", undefined);
    return close_world()
  });

  form.button("Test HTTP request");
  actions.push(() => {

    async function updateScore() {
      const req = new HttpRequest('https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml');

      try {
          const response = await http.request(req);
          const text = await response.body;
          console.log('Response:', text);
      } catch (error) {
          console.error('Request failed:', error);
      }
    }

    updateScore()
  });


  form.button("§cClose Server");
  actions.push(() => {
    return close_world()
  });

  form.divider()
  form.button("");
  actions.push(() => {
    return settings_main(player)
  });


  form.show(player).then((response) => {
    if (response.selection == undefined ) {
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}


function debug_sd_editor(player, onBack, path = []) {
  const save_data = load_save_data();

  let current = save_data;
  for (const key of path) {
    current = current[key];
  }

  const returnToCurrentMenu = () => debug_sd_editor(player, onBack, path);

  if (Array.isArray(current)) {
    const form = new ActionFormData()
      .title("Debug Editor v.1.1")
      .body(`Path: §7save_data/`);

    current.forEach((entry, idx) => {
      const label = idx === 0
        ? `Server [${idx}]`
        : `${entry.name ?? `Player ${idx}`} [${entry.id ?? idx}]`;
      form.button(label, "textures/ui/storageIconColor");
    });

    form.button(""); // Back

    form.show(player).then(res => {
      if (res.canceled) return;
      if (res.selection === current.length) {
        return onBack();
      }
      debug_sd_editor(
        player,
        returnToCurrentMenu,
        [...path, res.selection]
      );
    });

  // === B) Object-Branch ===
  } else if (current && typeof current === "object") {
    const keys = Object.keys(current);
    const displaySegments = path.map((seg, idx) => {
      if (idx === 0) {
        return seg === 0 ? "server" : save_data[Number(seg)]?.id ?? seg;
      }
      return seg;
    });
  const displayPath = `save_data/${displaySegments.join("/")}`;
    const form = new ActionFormData()
      .title("Debug Editor v.1.1")
      .body(`Path: §7${displayPath}`);

    keys.forEach(key => {
      const val = current[key];
      if (typeof val === "boolean") {
        form.button(
          `${key}\n${val ? "§aON" : "§cOFF"}`,
          val ? "textures/ui/toggle_on" : "textures/ui/toggle_off"
        );
      } else if (typeof val === "number") {
        form.button(`${key}: ${val}§r\n§9type: number`, "textures/ui/editIcon");
      } else if (typeof val === "string") {
        form.button(`${key}: ${val}§r\n§9type: string`, "textures/ui/editIcon");
      } else {
        form.button(`${key}`, "textures/ui/storageIconColor"); // verschachteltes Objekt/Array
      }
    });

    form.button(""); // Back

    form.show(player).then(res => {
      if (res.selection == undefined ) {
        return -1
      }
      // 1. Back-Button?
      if (res.selection === keys.length) {
        return onBack();
      }

      const key = keys[res.selection];
      const nextPath = [...path, key];
      const fresh = load_save_data();
      let target = fresh;
      for (const k of nextPath.slice(0, -1)) {
        target = target[k];
      }
      const val = target[key];
      if (typeof val === "boolean") {
        // Boolean-Toggle
        target[key] = !val;
        update_save_data(fresh);
        returnToCurrentMenu();

      } else if (typeof val === "number" || typeof val === "string") {
        // Number-Editor
        openTextEditor(
          player,
          String(val),
          nextPath,
          newText => {
            target[key] = newText;
            update_save_data(fresh);
            returnToCurrentMenu();
          },
          () => {
            return -1
          }
        );

      } else {
        debug_sd_editor(player, returnToCurrentMenu, nextPath);
      }
    });
  }
}

function openTextEditor(player, current, path, onSave, onCancel) {
  let save_data = load_save_data()
  const displaySegments = path.map((seg, idx) => {
    if (idx === 0) {
      return seg === 0 ? "server" : save_data[Number(seg)]?.id ?? seg;
    }
    return seg;
  });

  const fullPath = `save_data/${displaySegments.join("/")}`;
  const form = new ModalFormData();
  form.title("Edit Text");
  form.textField(`Path: ${fullPath} > Value:`, "Enter text...", {defaultValue: current});
  form.submitButton("Save");

  form.show(player).then(res => {
    if (res.canceled) {
      return onCancel();
    }

    let input = res.formValues[0];
    // Wenn der String nur aus Ziffern besteht, in Zahl umwandeln
    if (/^\d+$/.test(input)) {
      input = Number(input);
    }

    onSave(input);
  });
}





function debug_add_fake_player(player) {
  let form = new ModalFormData();

  form.textField("Player name", player.name);
  form.textField("Player id", player.id);
  form.submitButton("Add player")

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    create_player_save_data(response.formValues[1], response.formValues[0])
    return debug_main(player)
  });
}

function settings_rights_main(player, came_from_settings) {
  let form = new ActionFormData();
  let save_data = load_save_data();

  form.title("Permissions");
  form.body("Select a player!");


  const players = world.getAllPlayers();
  const playerIds = players.map(player => player.id);

  let newList = save_data.slice(1);

  newList.sort((a, b) => {
    const now = Math.floor(Date.now() / 1000);

    const aOnline = playerIds.includes(a.id);
    const bOnline = playerIds.includes(b.id);

    const aOp = a.op;
    const bOp = b.op;

    const aLastSeen = now - a.last_unix;
    const bLastSeen = now - b.last_unix;

    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    if (aOnline && !bOnline) return -1;
    if (!aOnline && bOnline) return 1;

    if (aOnline && bOnline) {
      if (aOp && !bOp) return -1;
      if (!aOp && bOp) return 1;

      return aName.localeCompare(bName);
    }
    return aLastSeen - bLastSeen;
  });


  newList.forEach(entry => {
    const isOnline = playerIds.includes(entry.id);
    let displayName = entry.name;

    if (isOnline) {
      displayName += "\n§a(online)§r";
    } else {
      displayName += "\n§o(last seen " + getRelativeTime(Math.floor(Date.now() / 1000) - entry.last_unix) + " ago)§r";
    }

    if (entry.op) {
      form.button(displayName, "textures/ui/op");
    } else {
      form.button(displayName, "textures/ui/permissions_member_star");
    }
  });

  form.divider()
  form.button("");

  if (newList.length == 1) {
    if (came_from_settings) {
      return settings_rights_data(player, newList[0]);
    } else {
      return settings_main(player);
    }
  }


  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection === newList.length) {
      return settings_main(player);
    } else {
      return settings_rights_data(player, newList[response.selection]);
    }
  });
}

function settings_rights_data(viewing_player, selected_save_data) {
  let save_data = load_save_data()
  let selected_player = world.getAllPlayers().find(player => player.id == selected_save_data.id);
  let form = new ActionFormData();

  let body_text = "";

  body_text += "Name: " + selected_save_data.name + " (id: " + selected_save_data.id + ")\n";

  if (selected_player) {
      if (version_info.release_type == 0) {
          let memory_text = "";
          switch (selected_player.clientSystemInfo.memoryTier) {
              case 0:
                  memory_text = "Client Total Memory: Under 1.5 GB (Super Low)";
                  break;
              case 1:
                  memory_text = "Client Total Memory: 1.5 - 2.0 GB (Low)";
                  break;
              case 2:
                  memory_text = "Client Total Memory: 2.0 - 4.0 GB (Mid)";
                  break;
              case 3:
                  memory_text = "Client Total Memory: 4.0 - 8.0 GB (High)";
                  break;
              case 4:
                  memory_text = "Client Total Memory: Over 8.0 GB (Super High)";
                  break;
          }

          let input_text = "";
          switch (selected_player.inputInfo.lastInputModeUsed) {
              case "Gamepad":
                  input_text = "Input: Gamepad";
                  break;
              case "KeyboardAndMouse":
                  input_text = "Input: Mouse & Keyboard";
                  break;
              case "MotionController":
                  input_text = "Input: Motion controller";
                  break;
              case "Touch":
                  input_text = "Input: Touch";
                  break;
          }

          body_text += "Online: yes\n";
          body_text += "Platform: " + selected_player.clientSystemInfo.platformType + "\n";
          body_text += memory_text + "\n";
          body_text += input_text + "\n";

      } else {
          body_text += "Online: yes\n";
      }

  } else {
      body_text += "Online: no §7(last seen " + getRelativeTime(Math.floor(Date.now() / 1000) - selected_save_data.last_unix) + " ago)§r\n";
  }

  body_text += "\n";

  form.body(body_text);
  let actions = [];

  if (selected_save_data.id !== viewing_player.id) {
    form.title("Edit "+ selected_save_data.name +"'s permission");
    if (selected_save_data.op) {

      form.button("§cMake deop");
      actions.push(() => {
        let player_sd_index = save_data.findIndex(entry => entry.id === selected_save_data.id)
        save_data[player_sd_index].op = false
        update_save_data(save_data);
        return settings_rights_data(viewing_player, save_data[player_sd_index])
      });

    } else {

      form.button("§aMake op");
      actions.push(() => {
        form = new MessageFormData();
        form.title("Op advantages");
        form.body("Your are trying to add op advantages to "+selected_save_data.name+". With them he would be able to:\n\n- Run all kinds off command\n- Mange save data\n\nAre you sure you want to add them?\n ");
        form.button2("");
        form.button1("§aMake op");
        form.show(viewing_player).then((response) => {
          if (response.selection == undefined ) {
            return -1
          }
          if (response.selection == 0) {
            let player_sd_index = save_data.findIndex(entry => entry.id === selected_save_data.id)
            save_data[player_sd_index].op = true
            selected_save_data = save_data[player_sd_index]
            update_save_data(save_data);
          }

          return settings_rights_data(viewing_player, selected_save_data)
        });
      });

    }
  } else {
    form.title("Edit your permission");
  }

  form.button("Manage save data");
  actions.push(() => {
    settings_rights_manage_sd(viewing_player, selected_save_data);
  });

  form.divider()
  form.button("");
  actions.push(() => {
    settings_rights_main(viewing_player, false);
  });

  form.show(viewing_player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function settings_rights_manage_sd(viewing_player, selected_save_data) {
  const form = new ActionFormData()
    .title(`${selected_save_data.name}'s save data`)
    .body("Select an option!")
    .button("§dReset save data")
    .button("§cDelete save data")
    .button("");

  form.show(viewing_player).then(response => {
    if (response.selection == undefined ) {
      return -1
    }

    const is_reset = response.selection === 0;
    const is_delete = response.selection === 1;

    if (response.selection === 2) {
      settings_rights_data(viewing_player, selected_save_data);
    } else {
      handle_data_action(is_reset, is_delete, viewing_player, selected_save_data);
    }
  });
}

function handle_data_action(is_reset, is_delete, viewing_player, selected_save_data) {
  const selected_player = world.getAllPlayers().find(p => p.id === selected_save_data.id);
  if (is_reset) {
    delete_player_save_data(selected_save_data);
    create_player_save_data(selected_save_data.id, selected_save_data.name);
    return settings_rights_main(viewing_player, false);
  }

  if (is_delete) {
    if (selected_player) {
      const confirm_form = new MessageFormData()
        .title("Online player information")
        .body(`Are you sure you want to remove ${selected_player.name}'s save data?\nThey must disconnect from the world!`)
        .button1("")
        .button2("§cKick & Delete");

      confirm_form.show(viewing_player).then(confirm => {
        if (confirm.selection == undefined ) {
          return -1
        }
        if (confirm.selection === 1) {
          if (!world.getDimension("overworld").runCommand(`kick ${selected_player.name}`).successCount) {
            const host_form = new MessageFormData()
              .title("Host player information")
              .body(`${selected_player.name} is the host. To delete their data, the server must shut down. This usually takes 5 seconds`)
              .button1("")
              .button2("§cShutdown & Delete");

            host_form.show(viewing_player).then(host => {
              if (host.selection == undefined ) {
                return -1
              }
              if (host.selection === 1) {
                delete_player_save_data(selected_save_data);
                return close_world();
              } else {
                settings_rights_manage_sd(viewing_player, selected_save_data);
              }
            });
          } else {
            delete_player_save_data(selected_save_data);
            settings_rights_main(viewing_player, false);
          }
        } else {
          settings_rights_manage_sd(viewing_player, selected_save_data);
        }
      });

    } else {
      delete_player_save_data(selected_save_data);
      settings_rights_main(viewing_player, false);
    }
  }
}




/*------------------------
 Update loop
-------------------------*/

function close_world() {
  world.sendMessage("Closing World! Auto Save is disabled! Please wait...");
  while (true) {}
}

async function update_loop() {
    while (true) {
      gesture_nod()
      gesture_jump()
      gesture_emote()

      let save_data = load_save_data();

      world.getAllPlayers().forEach(player => {
        let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
        // When a player's sd gets removed he will kick out of the game triggering this...
        if (player_sd_index) {
          save_data[player_sd_index].last_unix = Math.floor(Date.now() / 1000)
          update_save_data(save_data);
        }
      });

      await system.waitTicks(1);
    }
}

system.run(() => update_loop())