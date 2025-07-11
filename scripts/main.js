import { system, world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData  } from "@minecraft/server-ui"
import { HttpRequest, http } from '@minecraft/server-net';


const version_info = {
  name: "RSS-Feed",
  version: "v.1.0.0",
  build: "B002",
  release_type: 0, // 0 = Development version (with debug); 1 = Beta version; 2 = Stable version
  unix: 1752242701,
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
  {name: "§l§5Github:§r", link: "github.com/TheFelixLive/RSS-Feed"},
  /*{name: "§l§8Curseforge:§r", link: "curseforge.com/projects/1277546"},
  {name: "§l§aMcpedl:§r", link: "mcpedl.com/com2hard"},*/
]

const timezone_list = [
  {
    name: "Baker Island Time",
    utc: -12,
    short: "BIT",
    location: ["Baker Island"],
    lang: ["en_us"]
  },
  {
    name: "Niue Time",
    utc: -11,
    short: "NUT",
    location: ["Niue", "American Samoa"],
    lang: ["en_us"]
  },
  {
    name: "Hawaii-Aleutian Standard Time",
    utc: -10,
    short: "HAST",
    location: ["Hawaii", "Honolulu"],
    lang: ["en_us"]
  },
  {
    name: "Marquesas Time",
    utc: -9.5,
    short: "MART",
    location: ["Marquesas Islands"],
    lang: ["fr_fr", "ty_ty"]
  },
  {
    name: "Alaska Standard Time",
    utc: -9,
    short: "AKST",
    location: ["Anchorage"],
    lang: ["en_us"]
  },
  {
    name: "Pacific Standard Time",
    utc: -8,
    short: "PST",
    location: ["Los Angeles (Winter)", "Vancouver (Winter)"],
    lang: ["en_us", "en_ca"]
  },
  {
    name: "Pacific Daylight / Mountain Standard Time",
    utc: -7,
    short: "PDT / MST",
    location: ["Los Angeles (Summer)", "Vancouver (Summer)", "Denver (Winter)", "Phoenix"],
    lang: ["en_us", "en_ca"]
  },
  {
    name: "Mountain Daylight / Central Standard Time",
    utc: -6,
    short: "MDT / CST",
    location: ["Denver (Summer)", "Chicago (Winter)", "Mexico City (Winter)"],
    lang: ["en_us", "es_mx"]
  },
  {
    name: "Central Daylight / Eastern Standard Time",
    utc: -5,
    short: "CDT / EST",
    location: ["Chicago (Summer)", "New York (Winter)", "Toronto (Winter)"],
    lang: ["en_us", "fr_ca", "fr_fr"]
  },
  {
    name: "Atlantic Standard / Eastern Daylight Time",
    utc: -4,
    short: "AST / EDT",
    location: ["Santiago (Winter)", "Caracas (Winter)", "New York (Summer)", "Toronto (Summer)"],
    lang: ["en_us", "es_cl", "es_ve", "fr_ca"]
  },
  {
    name: "Newfoundland Standard Time",
    utc: -3.5,
    short: "NST",
    location: ["St. John's (Winter)"],
    lang: ["en_ca"]
  },
  {
    name: "Atlantic Daylight / Argentina Time",
    utc: -3,
    short: "ADT / ART",
    location: ["Santiago (Summer)", "Buenos Aires", "São Paulo"],
    lang: ["es_cl", "es_ar", "pt_br"]
  },
  {
    name: "Newfoundland Daylight Time",
    utc: -2.5,
    short: "NDT",
    location: ["St. John's (Summer)"],
    lang: ["en_ca"]
  },
  {
    name: "South Georgia Time",
    utc: -2,
    short: "GST",
    location: ["South Georgia"],
    lang: ["en_gb"]
  },
  {
    name: "Azores Standard Time",
    utc: -1,
    short: "AZOT",
    location: ["Azores (Winter)"],
    lang: ["pt_pt"]
  },
  {
    name: "Greenwich Mean Time / Azores Summer Time",
    utc: 0,
    short: "GMT / AZOST",
    location: ["London (Winter)", "Reykjavík", "Azores (Summer)"],
    lang: ["en_gb", "is_is", "pt_pt"]
  },
  {
    name: "Central European Time / British Summer Time",
    utc: 1,
    short: "CET / BST",
    location: ["Berlin (Winter)", "Paris (Winter)", "Rome (Winter)", "London (Summer)"],
    lang: [ "de_de", "de_at", "de_ch", "fr_fr", "fr_be", "fr_ch", "it_it", "en_gb"]
  },
  {
    name: "Central European Summer / Eastern European Time",
    utc: 2,
    short: "CEST / EET",
    location: ["Berlin (Summer)", "Paris (Summer)", "Rome (Summer)", "Athens (Winter)", "Cairo (Winter)", "Helsinki (Winter)"],
    lang: ["de_de", "de_at", "de_ch", "fr_fr", "fr_be", "fr_ch", "it_it", "el_gr", "ar_eg", "ar_sa", "fi_fi", "sv_se"]
  },
  {
    name: "Eastern European Summer / Moscow Time",
    utc: 3,
    short: "EEST / MSK",
    location: ["Athens (Summer)", "Cairo (Summer)", "Moscow", "Istanbul"],
    lang: ["el_gr", "ar_eg", "ar_sa", "ru_ru", "ru_ua", "tr_tr"]
  },
  {
    name: "Iran Standard Time",
    utc: 3.5,
    short: "IRST",
    location: ["Tehran (Winter)"],
    lang: ["fa_ir"]
  },
  {
    name: "Iran Daylight Time / Gulf Standard Time",
    utc: 4,
    short: "IRDT / GST",
    location: ["Tehran (Summer)", "Dubai", "Abu Dhabi"],
    lang: ["fa_ir", "ar_ae", "ar_sa"]
  },
  {
    name: "Afghanistan Time",
    utc: 4.5,
    short: "AFT",
    location: ["Kabul"],
    lang: ["ps_af", "fa_ir"]
  },
  {
    name: "Pakistan Standard Time",
    utc: 5,
    short: "PKT",
    location: ["Karachi", "Islamabad"],
    lang: ["en_pk", "ur_pk"]
  },
  {
    name: "India Standard Time",
    utc: 5.5,
    short: "IST",
    location: ["New Delhi", "Mumbai", "Colombo"],
    lang: ["en_in", "hi_in", "si_lk", "ta_in", "ta_lk"]
  },
  {
    name: "Nepal Time",
    utc: 5.75,
    short: "NPT",
    location: ["Kathmandu"],
    lang: ["ne_np"]
  },
  {
    name: "Bangladesh Time",
    utc: 6,
    short: "BST",
    location: ["Dhaka"],
    lang: ["bn_bd"]
  },
  {
    name: "Cocos Islands Time",
    utc: 6.5,
    short: "CCT",
    location: ["Cocos Islands"],
    lang: ["en_au"]
  },
  {
    name: "Indochina Time",
    utc: 7,
    short: "ICT",
    location: ["Bangkok", "Hanoi", "Jakarta"],
    lang: ["th_th", "vi_vn", "id_id"]
  },
  {
    name: "China Standard Time",
    utc: 8,
    short: "CST",
    location: ["Beijing", "Shanghai", "Singapore"],
    lang: ["zh_cn", "en_sg", "ms_sg", "ta_sg"]
  },
  {
    name: "Australian Central Western Time",
    utc: 8.75,
    short: "ACWST",
    location: ["Eucla"],
    lang: ["en_au"]
  },
  {
    name: "Japan Standard Time",
    utc: 9,
    short: "JST",
    location: ["Tokyo", "Seoul"],
    lang: ["ja_jp", "ko_kr"]
  },
  {
    name: "Australian Central Standard Time",
    utc: 9.5,
    short: "ACST",
    location: ["Adelaide", "Darwin"],
    lang: ["en_au"]
  },
  {
    name: "Australian Eastern Standard Time",
    utc: 10,
    short: "AEST",
    location: ["Brisbane", "Melbourne", "Sydney"],
    lang: ["en_au"]
  },
  {
    name: "Lord Howe Standard Time",
    utc: 10.5,
    short: "LHST",
    location: ["Lord Howe Island"],
    lang: ["en_au"]
  },
  {
    name: "Solomon Islands Time",
    utc: 11,
    short: "SBT",
    location: ["Honiara", "New Caledonia"],
    lang: ["en_nz", "fr_nc"]
  },
  {
    name: "New Zealand Standard Time",
    utc: 12,
    short: "NZST",
    location: ["Wellington", "Auckland"],
    lang: ["en_nz", "mi_nz"]
  },
  {
    name: "Chatham Islands Standard Time",
    utc: 12.75,
    short: "CHAST",
    location: ["Chatham Islands"],
    lang: ["en_nz", "mi_nz"]
  },
  {
    name: "Tonga Time",
    utc: 13,
    short: "TOT",
    location: ["Tonga", "Tokelau"],
    lang: ["en_nz", "to_to"]
  },
  {
    name: "Line Islands Time",
    utc: 14,
    short: "LINT",
    location: ["Kiritimati", "Line Islands"],
    lang: ["en_ki", "gil_ki"]
  }
];

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
  update_retrieved_rss_data()
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

  const default_save_data_structure = {fetch_message_time: 1, utc: undefined};

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

  // Finde latest version
  const lastest_version = JSON.parse(await req_url_content("https://api.github.com/repos/thefelixlive/RSS-Feed/releases/latest")).name;

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
  if (save_data[player_sd_index].op && compareVersions(version_info.version, lastest_version) == -1 && system_privileges !== 0) {
    let form = new ActionFormData();
    form.title("Update time!");
    form.body("A new version "+lastest_version+" is available.\nFeel free to update to enjoy the latest features!\n\nCheck out: §7"+links[0].link);
    const showForm = async () => {
      form.show(player).then((response) => {
        if (response.canceled && response.cancelationReason === "UserBusy") {
          showForm()
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

function compareVersions(version1, version2) {
  if (!version1 || !version2) return 0

  // Entfernt 'v.' falls vorhanden
  version1 = version1.replace(/^v\./, '');
  version2 = version2.replace(/^v\./, '');

  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  // Vergleicht jeden Teil: Major, Minor, Patch
  for (let i = 0; i < Math.max(v1Parts.length, v2Parts.length); i++) {
    const num1 = v1Parts[i] || 0;
    const num2 = v2Parts[i] || 0;

    if (num1 > num2) return 1;    // version1 ist neuer
    if (num1 < num2) return -1;   // version2 ist neuer
  }

  return 0; // Versionen sind gleich
}

function print(input) {
  if (version_info.release_type === 0) {
    console.log(version_info.name + " - " + JSON.stringify(input))
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

async function req_url_content(url, player) {
  const req = new HttpRequest(url);

  try {
      const response = await http.request(req);
      const text = await response.body;
      return text
  } catch (error) {
      if (player) {
        return error_menu(player, 503, String(error))
      } else {
        return print(error)
      }
  }
}

function rss_to_json(xml) {

  function getTagContent(xml, tag) {
    // Stelle sicher, dass xml ein String ist
    const str = typeof xml === 'string' ? xml : String(xml);
    const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
    const m = str.match(re);
    return m ? m[1].trim() : null;
  }


  function getAllTagContents(xml, tag) {
    const str = typeof xml === 'string' ? xml : String(xml);
    const re = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'g');
    const results = [];
    let m;
    while ((m = re.exec(str)) !== null) {
      results.push(m[1].trim());
    }
    return results;
  }

  function parseRSS(xml) {
    const channelXml = getTagContent(xml, 'channel');
    if (!channelXml) {
      print('Kein <channel> gefunden.')
      return -1
    };

    // Einfache Channel-Felder
    const channel = {
      title:        getTagContent(channelXml, 'title'),
      link:         getTagContent(channelXml, 'link'),
      description:  getTagContent(channelXml, 'description'),
      language:     getTagContent(channelXml, 'language'),
      copyright:    getTagContent(channelXml, 'copyright'),
      lastBuildDate:getTagContent(channelXml, 'lastBuildDate'),
      pubDate:      getTagContent(channelXml, 'pubDate'),
    };

    // Alle <item>…</item> holen
    const itemsXml = getAllTagContents(channelXml, 'item');
    channel.item = itemsXml.map(itemXml => ({
      title:       getTagContent(itemXml, 'title'),
      link:        getTagContent(itemXml, 'link'),
      description: getTagContent(itemXml, 'description'),
      pubDate:     getTagContent(itemXml, 'pubDate'),
      guid:        getTagContent(itemXml, 'guid'),
      // falls du weitere Felder brauchst, hier einfach ergänzen
    }));

    return { channel };
  }

  // === Hauptprogramm ===

  // 2) Parsen
  const rssObj = parseRSS(xml);

  // 3) Return
  return rssObj
}

function populateFormWithArticles(form, entries, utcOffsetMinutes, onSelect, limit) {
  let save_data = load_save_data()
  const now = Math.floor(Date.now() / 1000);
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  // Datumsschwellen berechnen
  const nowLocal    = new Date((now + utcOffsetMinutes * 60) * 1000);
  const midLocal    = new Date(nowLocal.getFullYear(), nowLocal.getMonth(), nowLocal.getDate());
  const todayMid    = Math.floor(midLocal.getTime() / 1000);
  const yestMid     = todayMid - 24 * 3600;
  const week7Mid    = todayMid - 7  * 24 * 3600;

  // Einträge nach Datum sortieren und ggf. limitieren
  const sorted = entries
    .map(a => ({
      ...a,
      unix: Date.parse(a.pubDate) / 1000
    }))
    .sort((a, b) => b.unix - a.unix);

  const sliced = typeof limit === "number" ? sorted.slice(0, limit) : sorted;

  let lastGroup = null;
  sliced.forEach(entry => {
    const localUnix = entry.unix + utcOffsetMinutes * 60;
    const date      = new Date(localUnix * 1000);
    const year      = date.getFullYear();
    const month     = date.getMonth();
    const hour      = date.getHours();
    const minute    = date.getMinutes();
    const diffSec   = now - entry.unix;

    let group, label;
    if (diffSec < 3600) {
      label = `${hour}:${String(minute).padStart(2,'0')} o'clock`;
      group = `minute-${hour}-${minute}`;
    } else if (diffSec < 4*3600 && localUnix >= todayMid) {
      label = `${hour} o'clock`;
      group = `hour-${hour}`;
    } else if (localUnix >= todayMid && hour < 4) {
      label = "Today Night";       group = "today-night";
    } else if (localUnix >= todayMid && hour < 12) {
      label = "Today Morning";     group = "today-morning";
    } else if (localUnix >= todayMid && hour < 16) {
      label = "Today Noon";        group = "today-noon";
    } else if (localUnix >= todayMid && hour < 20) {
      label = "Today Afternoon";   group = "today-afternoon";
    } else if (localUnix >= todayMid) {
      label = "Today Evening";     group = "today-evening";
    } else if (localUnix >= yestMid) {
      label = "Yesterday";         group = "yesterday";
    } else if (localUnix >= week7Mid) {
      label = "Last days";         group = "last-days";
    } else if (diffSec < 14*24*3600) {
      label = "Last week";         group = "last-week";
    } else if (year === nowLocal.getFullYear()) {
      label = monthNames[month];   group = `month-${month}`;
    } else {
      label = String(year);        group = `year-${year}`;
    }

    if (group !== lastGroup && save_data[0].utc) {
      form.label(label);
      lastGroup = group;
    }

    form.button(entry.title, "textures/ui/icon_book_writable");
    onSelect(entry);
  });
}

/*------------------------
 Update RSS-Feeds
-------------------------*/
let retrieved_rss_data = [];

// retrieved_rss_data = [{unix: 999999}, {url: "https://...", content: ""}, {url: "https://...", content: ""}]

async function update_retrieved_rss_data() {
  let save_data = load_save_data();
  const allPlayers = world.getAllPlayers();

  // Aktuellen Unix-Timestamp in Sekunden ermitteln
  const nowUnix = Math.floor(Date.now() / 1000);

  // Falls das erste Element bereits ein Timestamp-Objekt ist, entfernen wir es
  if (retrieved_rss_data[0] && typeof retrieved_rss_data[0].timestamp === 'number') {
    retrieved_rss_data.shift();
  }

  // Neuen Timestamp mit success: true als erstes Element einfügen
  retrieved_rss_data.unshift({ timestamp: nowUnix, success: true });

  // Jetzt die Feeds der Spieler einpflegen
  for (const player of allPlayers) {
    let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

    for (const rss_feed of save_data[player_sd_index].url) {
      // Nur hinzufügen, wenn der Feed noch nicht vorhanden ist
      if (!retrieved_rss_data.some(feed => feed.url === rss_feed)) {
        // HTTP-Request holen
        const rss = await req_url_content(rss_feed);

        // Prüfen, ob rss leer, null oder undefined ist
        if (!rss) {
          retrieved_rss_data = [{ timestamp: nowUnix, success: false }];
          return;
        }

        // In JSON umwandeln
        let content = rss_to_json(rss);

        retrieved_rss_data.push({ url: rss_feed, content: content });
      }
    }
  }
}



/*------------------------
 Menus
-------------------------*/

function main_menu(player) {
  const form = new ActionFormData();
  const save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  const utcOffset = Math.round((save_data[0]?.utc || 0) * 60);
  let build_date = convertUnixToDate(retrieved_rss_data[0].timestamp, save_data[0].utc)

  // Alle Einträge flatten
  const allEntries = retrieved_rss_data
    .slice(1)
    .flatMap(f =>
      f.content.channel.item.map(a => ({
        ...a,
        source: f.content.channel.title
      }))
    )
    .filter(entry =>
      save_data[player_sd_index].url.some(savedUrl => savedUrl !== entry.url)
    );

  form.title("Main menu");
  form.body("Select an option!");

  var max_entries = 3


  let actions = [];

  if (allEntries.length > 0 && retrieved_rss_data[0].success) {
    populateFormWithArticles(form, allEntries, utcOffset, entry => {
      actions.push(() => reader_menu(player, entry.title, entry.description, entry.source, true));
    }, max_entries);

    if (allEntries.length > max_entries) {
      form.button("Show all");
      actions.push(() => all_articles(player));
    }
    form.label("§7" +(save_data[0].utc == undefined ? "Last update: "+getRelativeTime(Math.floor(Date.now() / 1000) - retrieved_rss_data[0].timestamp, player) +" ago" : `As off ${build_date.day}.${build_date.month}.${build_date.year} ${build_date.hours}:${build_date.minutes}:${build_date.seconds}`))

  } else {
    form.label("§7No Articles found" + (retrieved_rss_data[0].success? "" : " - Failed to fech"))
  }
  form.divider();

  form.button("Settings", "textures/ui/debug_glyph_color");
  actions.push(() => settings_main(player));

  if (system_privileges !== 2) {
    form.button("");
    actions.push(() => player.runCommand("/scriptevent multiple_menu:open_main"));
  }

  form.show(player).then(response => {
    if (response.selection != null && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

function all_articles(player) {
  const form = new ActionFormData();
  const save_data = load_save_data();
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);
  const utcOffset = Math.round((save_data[0]?.utc || 0) * 60);

  const allEntries = retrieved_rss_data
    // überspringe den ersten Feed
    .slice(1)
    // flache alle Items der restlichen Feeds und füge die Quelle hinzu
    .flatMap(f =>
      f.content.channel.item.map(a => ({
        ...a,
        source: f.content.channel.title
      }))
    )
    .filter(entry =>
      save_data[player_sd_index].url.some(savedUrl => savedUrl !== entry.url)
    );



  form.title("All Articles");
  form.body("Select one of "+allEntries.length+" articles!");

  let actions = [];
  // Alle Einträge, kein Limit
  populateFormWithArticles(form, allEntries, utcOffset, entry => {
    actions.push(() => reader_menu(player, entry.title, entry.description, entry.source));
  });
  let build_date = convertUnixToDate(retrieved_rss_data[0].timestamp, save_data[0].utc)
  form.label("§7" +(save_data[0].utc == undefined ? "Last update: "+getRelativeTime(Math.floor(Date.now() / 1000) - retrieved_rss_data[0].timestamp, player) +" ago" : `As off ${build_date.day}.${build_date.month}.${build_date.year} ${build_date.hours}:${build_date.minutes}:${build_date.seconds}`))
  form.divider();
  form.button("");
  actions.push(() => main_menu(player));

  form.show(player).then(response => {
    if (response.selection != null && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}


function decodeHTMLEntities(text) {
  let txt = text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
  txt = txt.replace(/&quot;/g, '"')
           .replace(/&apos;/g, "'")
           .replace(/&amp;/g, '&')
           .replace(/&lt;/g, '<')
           .replace(/&gt;/g, '>');
  return txt;
}

function stripHTML(html) {
  return html.replace(/<[^>]*>/g, '');
}

function reader_menu(player, title, text, source, is_main_menu) {
  let form = new ActionFormData();
  let actions = [];

  if (!title || !text) return error_menu(player, 0, "Missing text");

  // Dekodiere HTML-Entities und entferne HTML-Tags
  let decoded = decodeHTMLEntities(text);
  let stripped = stripHTML(decoded);

  form.title(source || "Reader v.1.0");
  form.body("§l" + title);
  form.label(stripped);

  form.button("");
  actions.push(() => is_main_menu ? main_menu(player) : all_articles(player));

  form.show(player).then(response => {
    if (response.selection != null && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}



function error_menu(player, id, description) {
  let form = new MessageFormData();
  let actions = [];

  form.title("Error - "+id);
  form.body(description);

  // Report
  form.button1("Report the bug");
  actions.push(() => {
    dictionary_contact(player);
  });

  // Main Menu
  form.button2("");
  actions.push(() => {
    main_menu(player);
  });

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

  // URLS
  if (retrieved_rss_data[0].success) {

    if (save_data[player_sd_index].url.length == 0) {
      form.button("Add RSS Feed", "textures/ui/world_glyph_color_2x_black_outline");
      actions.push(() => {
        settings_links_add(player)
      });
    } else {
      form.button("Manage RSS Feeds\n§9Subscribed to "+ (save_data[player_sd_index].url.length == 1? (retrieved_rss_data.find(feed => feed.url == save_data[player_sd_index].url[0]).content.channel.title) : (save_data[player_sd_index].url.length) +" feeds"), "textures/ui/world_glyph_color_2x_black_outline");
      actions.push(() => {
        settings_links_main(player)
      });
    }
  }

  // Gestures
  if (system_privileges == 2) {
    form.button("Gestures", "textures/ui/sidebar_icons/emotes");
    actions.push(() => {
      settings_gestures(player)
    });
  }

  // Permission
  if (save_data[player_sd_index].op) {
    form.divider()
    form.label("Multiplayer");

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

    // UTC
    let zone = timezone_list.find(zone => zone.utc === save_data[0].utc), zone_text;

    if (!zone) {
      if (zone !== undefined) {
        zone = timezone_list.reduce((closest, current) => {
          const currentDiff = Math.abs(current.utc - save_data[0].utc);
          const closestDiff = Math.abs(closest.utc - save_data[0].utc);
          return currentDiff < closestDiff ? current : closest;
        });
        zone_text = "Prob. " + ("Prob. "+ zone.name.length > 30 ? zone.short : zone.name)
      }
    } else {
      zone_text = zone.name.length > 30 ? zone.short : zone.name
    }


    form.button(("Time zone") + (zone !== undefined? "\n§9"+zone_text : ""), "textures/ui/timer")
    actions.push(() => {
      settings_time_zone(player, 0);
    });

    // Intervall
    form.button("Intervall\n§9" + (save_data[0].fetch_message_time < 2? "Immediately" : save_data[0].fetch_message_time+" Minutes"), "textures/ui/icon_best3")
    actions.push(() => {
      settings_intervall(player)
    });

  }

  form.divider()
  form.label("Version");

  // Debug
  if (version_info.release_type == 0 && save_data[player_sd_index].op) {
    form.button("Debug\n", "textures/ui/ui_debug_glyph_color");
    actions.push(() => {
      debug_main(player);
    });
  }

  // Dictionary
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
 URLs
-------------------------*/

function settings_links_main(player) {
  let form = new ActionFormData()
  let actions = []
  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("Manage RSS Feeds")
  form.body("Add or remove RSS feeds to your list.");

  if (save_data[player_sd_index].url.length == 0) return settings_main(player);

  save_data[player_sd_index].url.forEach((url) => {
    let feed = retrieved_rss_data.find(feed => feed.url == url)

    form.button(feed.content.channel.title);
    actions.push(() => {
      settings_links_detail(player, feed.url)
    });
  })

  form.button("§aAdd RSS Feed", "textures/ui/color_plus");
  actions.push(() => {
    settings_links_add(player)
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

function settings_links_add(player) {
  let form = new ModalFormData()
  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  form.title("New RSS Feed");

  form.textField("URL of the RSS-Feed", "https://www.test.de/rss.xml", {tooltip: "Make sure that your URL returns a .xml file!"})

  form.show(player).then((response) => {
    if (response.formValues[0] == "" ) {
      return settings_links_main(player)
    }
    return settings_links_detail(player, response.formValues[0])
  });
}

async function settings_links_detail(player, imput_url) {
  let form = new MessageFormData()
  let actions = []

  let save_data = load_save_data()
  let player_sd_index = save_data.findIndex(entry => entry.id === player.id);

  let is_added_in_sd = save_data[player_sd_index].url.find(item => item === imput_url)

  let content;

  if (!is_added_in_sd) {
    // Get URL Request
    const rss = await req_url_content(imput_url, player);
    if (!rss) return -1

    // Convert Request
    content = rss_to_json(rss)
    if (!content) return error_menu(player, 0, "Failed to stringify XML to JSON")
  } else {
    content = retrieved_rss_data.find(feed => feed.url == imput_url).content
  }

  // Menu
  form.title(content.channel.title)
  form.body(content.channel.description)

  form.button1(is_added_in_sd? "§cRemove RSS-Feed" : "§aAdd RSS-Feed")
  actions.push(async () => {
    if (is_added_in_sd) {
      const index = save_data[player_sd_index].url.findIndex(item => item === imput_url);
      if (index !== -1) {
        save_data[player_sd_index].url.splice(index, 1);
      }
    } else {
      save_data[player_sd_index].url.push(imput_url)
    }

    update_save_data(save_data)
    await update_retrieved_rss_data()
    return settings_links_main(player);
  });

  form.button2("")
  actions.push(() => {
    return settings_links_main(player);
  });

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
    }
    if (response.selection !== undefined && actions[response.selection]) {
      actions[response.selection]();
    }
  });
}

/*------------------------
 Intervall
-------------------------*/

function settings_intervall(player) {
  let form = new ActionFormData()
  let actions = []
  let save_data = load_save_data()

  form.title("Intervall")
  form.body("Select a time after which the rss feeds should be updated");

  if (save_data[0].fetch_message_time == 1) {
    form.button("Immediately", "textures/ui/realms_slot_check");
  } else {
    form.button("Immediately");
  }
  actions.push(() => {
    save_data[0].fetch_message_time = 1
    update_save_data(save_data)
    settings_intervall(player)
  });


  if (save_data[0].fetch_message_time == 5) {
    form.button("5 Minutes", "textures/ui/realms_slot_check");
  } else {
    form.button("5 Minutes");
  }
  actions.push(() => {
    save_data[0].fetch_message_time = 5
    update_save_data(save_data)
    settings_intervall(player)
  });

  if (save_data[0].fetch_message_time == 10) {
    form.button("10 Minutes", "textures/ui/realms_slot_check");
  } else {
    form.button("10 Minutes");
  }
  actions.push(() => {
    save_data[0].fetch_message_time = 10
    update_save_data(save_data)
    settings_intervall(player)
  });


  if (save_data[0].fetch_message_time == 30) {
    form.button("30 Minutes", "textures/ui/realms_slot_check");
  } else {
    form.button("30 Minutes");
  }
  actions.push(() => {
    save_data[0].fetch_message_time = 30
    update_save_data(save_data)
    settings_intervall(player)
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
 Timezone
-------------------------*/

function settings_time_zone(player, viewing_mode) {
  const form = new ActionFormData();
  const actions = [];
  const save_data = load_save_data();
  const now = new Date();

  let current_utc = save_data[0].utc;

  if (current_utc === undefined) {
    viewing_mode = 3;
  }

  form.body("Select your current time zone!").title("Time zone");

  const current_zone_index = timezone_list.findIndex(z => z.utc === current_utc)
    ?? timezone_list.reduce((closest, zone, i) =>
         Math.abs(zone.utc - current_utc) < Math.abs(timezone_list[closest].utc - current_utc) ? i : closest, 0);


  const renderZoneButton = (zone, index) => {
  const offsetMinutes = zone.utc * 60;

  // UTC-Zeit in Minuten seit Mitternacht
  const utcTotalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  // Lokale Zeit berechnen (immer positiv mit Modulo 1440)
  const totalMinutes = (utcTotalMinutes + offsetMinutes + 1440) % 1440;

  // Stunden und Minuten extrahieren
  const localHours = Math.floor(totalMinutes / 60);
  const localMinutes = totalMinutes % 60;

  // Funktion zur zweistelligen Formatierung
  const pad = (n) => n.toString().padStart(2, '0');

  // Zeitformatierung mit Farben je nach Tageszeit
  const getTimeFormat = (minutes) => {
    const timeString = `${pad(localHours)}:${pad(localMinutes)} o'clock`;

    if (minutes < 270) return "§9" + timeString;      // 00:00–04:30
    if (minutes < 360) return "§e" + timeString;      // 04:30–06:00
    if (minutes < 1020) return "§b" + timeString;     // 06:00–17:00
    if (minutes < 1140) return "§e" + timeString;     // 17:00–19:00
    return "§9" + timeString;                         // 19:00–00:00
  };

  // Name oder Kurzform je nach Länge
  const label = (zone.name.length > 28 ? zone.short : zone.name) + "\n" + getTimeFormat(totalMinutes);




    const getTimeIcon = (minutes) => {
      if (minutes < 270) return "textures/ui/time_6midnight";        // 00:00–04:30
      if (minutes < 360) return "textures/ui/time_1sunrise";         // 04:30–06:00
      if (minutes < 720) return "textures/ui/time_2day";             // 06:00–12:00
      if (minutes < 1020) return "textures/ui/time_3noon";           // 12:00–17:00
      if (minutes < 1140) return "textures/ui/time_4sunset";         // 17:00–19:00
      return "textures/ui/time_5night";                              // 19:00–00:00
    };

    const icon = index === current_zone_index
      ? "textures/ui/realms_slot_check"
      : getTimeIcon(totalMinutes);

    form.button(label, icon);

    actions.push(() => {
      if (icon === "textures/ui/realms_slot_check") {
        save_data.forEach(entry => {
          if (entry.time_source === 1) {
            entry.time_source = 0;
          }
        });
        save_data[0].utc = undefined;
        update_save_data(save_data);
        settings_time_zone(player);
      } else {
        settings_time_zone_preview(player, zone, viewing_mode);
      }
    });
  };




  const navButton = (label, icon, mode) => {
    form.button(label, icon);
    actions.push(() => settings_time_zone(player, mode));
  };

  const renderZones = (filterFn) => {
    timezone_list.forEach((zone, i) => {
      if (filterFn(i)) renderZoneButton(zone, i);
    });
  };

  if (viewing_mode === 0) {
    let start = Math.max(0, current_zone_index - 2);
    let end = Math.min(timezone_list.length - 1, current_zone_index + 2);

    if (start > 0) navButton("Show previous time zones", "textures/ui/up_arrow", 1);
    form.divider();
    for (let i = start; i <= end; i++) renderZoneButton(timezone_list[i], i);
    form.divider();
    if (end < timezone_list.length - 1) navButton("Show later time zones", "textures/ui/down_arrow", 2);
  } else {
    if (viewing_mode === 1) navButton("Show less", "textures/ui/down_arrow", 0);
    if (viewing_mode === 2 && current_zone_index !== 0) {navButton("Show previous time zones", "textures/ui/up_arrow", 3); form.divider();}
    if (viewing_mode === 3 && current_utc !== undefined) {navButton("Show less", "textures/ui/down_arrow", 2);}

    renderZones(i =>
      viewing_mode === 3 ||
      (viewing_mode === 1 && i <= current_zone_index) ||
      (viewing_mode === 2 && i >= current_zone_index)
    );

    if (viewing_mode === 1 && current_zone_index !== timezone_list.length) {form.divider(); navButton("Show later time zones", "textures/ui/down_arrow", 3);}
    if (viewing_mode === 2) {navButton("Show less", "textures/ui/up_arrow", 0)}
    if (viewing_mode === 3 && current_utc !== undefined) {navButton("Show less", "textures/ui/up_arrow", 1)}
  }

  form.button("");
  actions.push(() => {
    settings_main(player);
  });

  form.show(player).then(res => {
    if (res.selection === undefined) {
      return -1
    } else {
      actions[res.selection]?.();
    }
  });
}


function settings_time_zone_preview (player, zone, viewing_mode) {
  const save_data = load_save_data();
  let form = new MessageFormData();
  const now = new Date();

  const offsetMinutes = zone.utc * 60;

  // UTC-Zeit in Minuten seit Mitternacht
  const utcTotalMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  // Lokale Zeit berechnen (immer positiv mit Modulo 1440)
  const totalMinutes = (utcTotalMinutes + offsetMinutes + 1440) % 1440;

  // Stunden und Minuten extrahieren
  const localHours = Math.floor(totalMinutes / 60);
  const localMinutes = totalMinutes % 60;

  // Funktion zur zweistelligen Formatierung
  const pad = (n) => n.toString().padStart(2, '0');

  // Zeitformatierung mit Farben je nach Tageszeit
  const getTimeFormat = (minutes) => {
    const timeString = `${pad(localHours)}:${pad(localMinutes)} o'clock`;

    if (minutes < 270) return "§9" + timeString;      // 00:00–04:30
    if (minutes < 360) return "§e" + timeString;      // 04:30–06:00
    if (minutes < 1020) return "§b" + timeString;     // 06:00–17:00
    if (minutes < 1140) return "§e" + timeString;     // 17:00–19:00
    return "§9" + timeString;                         // 19:00–00:00
  };


  form.title("Time zone");
  form.body(
    "Time zone: " + zone.name +
    "\nUTC: "+ (zone.utc >= 0 ? "+" : "") + zone.utc +
    "\nTime: " + getTimeFormat(totalMinutes) +
    "§r\nLocation: " + zone.location.join(", ") +
    "\n\nDo you want to use this time zone?\n "
  )

  form.button1("Switch to " +zone.short);
  form.button2("");

  form.show(player).then((response) => {
    if (response.selection == undefined ) {
      return -1
    }
    if (response.selection == 0) {
      save_data[0].utc = zone.utc;
      update_save_data(save_data);
      return settings_main(player);
    }
    settings_time_zone(player, viewing_mode);
  });

}

/*------------------------
 Rights
-------------------------*/

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

  if (!save_data[player_sd_index].url.find(url => url == "https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml")) {
    form.button("Add ts");
    actions.push(async() => {
      settings_links_detail(player, "https://www.tagesschau.de/infoservices/alle-meldungen-100~rss2.xml")
    });
  }

  form.button("§cTest Error");
  actions.push(() => {
    return error_menu(player, 418, "I’m a teapot")
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


/*------------------------
 Dictionary
-------------------------*/

async function dictionary_about_version(player) {
  let form = new ActionFormData()
  let actions = []
  let save_data = load_save_data()
  let build_date = convertUnixToDate(version_info.unix, save_data[0].utc || 0);
  form.title("About")
  form.body(
    "Name: " + version_info.name + "\n" +
    "Version: " + version_info.version + (
      compareVersions(
        JSON.parse(await req_url_content("https://api.github.com/repos/thefelixlive/RSS-Feed/releases/latest")).name,
        version_info.version
      ) == 1
        ? " §a(update time)§r"
        : " (" + version_info.build + ")"
    ) + "\n" +
    "Release type: " + ["dev", "preview", "stable"][version_info.release_type] + "\n" +
    "UUID: "+ version_info.uuid + "\n" +
    "Build date: " + (
      save_data[0].utc == undefined
        ? getRelativeTime(Math.floor(Date.now() / 1000) - version_info.unix, player) + " ago\n\n§7Note: Set the time zone to see detailed information"
        : `${build_date.day}.${build_date.month}.${build_date.year} ${build_date.hours}:${build_date.minutes}:${build_date.seconds} (UTC${build_date.utcOffset >= 0 ? '+' : ''}${build_date.utcOffset})`
    ) +
    "\n\n§7© "+ (build_date.year > 2025 ? "2025 - " + build_date.year : build_date.year ) + " TheFelixLive. Licensed under the MIT License."
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

function dictionary_contact(player) {
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
    dictionary_about_version(player)
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

      if (system.currentTick % (save_data[0].fetch_message_time * 60 * 20) == 0) {
        update_retrieved_rss_data()
      }

      await system.waitTicks(1);
    }
}

system.run(() => update_loop())