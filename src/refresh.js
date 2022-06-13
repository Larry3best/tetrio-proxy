import got from "got";
import fs from "node:fs";
import { promisify } from 'node:util';
import stream from 'node:stream';

const DIRS = [
  "/sfx",
  "/js",
  "/css",
  "/res",
  "/res/flags",
  "/res/particles/beams",
  "/res/promo",
  "/res/bg",
  "/res/bgm",
  "/res/skins",
  "/res/skins/board/generic",
  "/res/skins/minos",
  "/res/skins/ghost",
  "/res/status",
  "/res/cutin/superlobby",
  "/res/font",
  "/res/icon",
  "/res/emotes",
  "/res/league-ranks"
];

const GLOBALS = [
  "/favicon.ico",

  "/sw.js", // Service Worker
  "/bootstrap.js", // Initializer
  
  "/css/tetrio.css",
  "/js/tetrio.js",
  "/sfx/tetrio.ogg"
];

const RES_BGMS = [
  /** idk but it's here */
  "smoke",

  /** Global audios */
  "honemi-ni-shimiiru-karasukaze",
  "kuchu-toshi", // Main menu
  "inorimichite",
  "muscat-to-shiroi-osara",
  "natsuzora-to-syukudai",
  "akindo",
  "yoru-no-niji",
  "akai-tsuchi-wo-funde",
  "burari-tokyo",
  "prism",
  "back-water",
  "burning-heart",
  "hayate-no-sei",
  "ice-eyes",
  "ima-koso",
  "risky-area",
  "fuyu-no-jinkoueisei",
  "hatsuyuki",
  "kansen-gairo",
  "chiheisen-wo-koete",
  "moyase-toushi-yobisamase-tamashii",
  "naraku-heno-abyssmaze",
  "samurai-sword",
  "super-machine-soul",
  "uchuu-5239",
  "ultra-super-heros",
  "haru-wo-machinagara",
  "sasurai-no-hitoritabi",
  "wakana",
  "zange-no-ma",
  "subarashii-nichijou",
  "asphalt",
  "madobe-no-hidamari",
  "minamoto",
  "sora-no-sakura",
  "21seiki-no-hitobito",
  "suiu",
  "go-go-go-summer",
  "freshherb-wreath-wo-genkan-ni",
  
  /** Calm exclusives */
  "kaze-no-sanpomichi",
  "honemi-ni-shimiiru-karasukaze",
  "muscat-to-shiroi-osara",
  "natsuzora-to-syukudai",
  "yoru-no-niji",
  "akai-tsuchi-wo-funde",
  "fuyu-no-jinkoueisei",
  "haru-wo-machinagara",

  /** Battle exclusives */
  "back-water",
  "burning-heart",
  "hayate-no-sei",
  "ice-eyes",
  "ima-koso",
  "risky-area",
  "chiheisen-wo-koete",
  "moyase-toushi-yobisamase-tamashii",
  "naraku-heno-abyssmaze",
  "samurai-sword",
  "super-machine-soul",
  "uchuu-5239",
  "ultra-super-heros",
  "aijin-sanka"
];

const RES_ICON = [
  "elim-spark.svg",
  "elim-sizzle.svg",
  "disconnect-change.svg",
  "disconnect.svg",
  "connect.svg",
  "profile.svg",
  "gift.svg",
  "invite.svg",
  "people.svg",
  "network_delay.svg",
  "network_disconnect.svg",
  "network_background.svg",
  "network_rejected.svg",
  "network_silence.svg",
  "network_loss.svg",
  "network_split.svg",
  "network_load.svg",
  "snipe.svg",
  "notification.svg"
];

const RES_EMOTES = [
  "crying.png"
];

const RES_PARTICLES = [
  "beam.png",
  "bokeh.png",
  "chirp.png",
  "fire.png",
  "smoke.png",
  "beams/beam.png",
  "box.png",
  "dust.png",
  "flare.png",
  "spark.png",
  "bigbox.png",
  "chip.png",
  "fbox.png",
  "particle.png",
  "star.png"
];

const RES_SKINS = [
  "/ghost/tetrio.2x.png",
  "/ghost/tetrio.png",
  "/minos/tetrio.2x.png",
  "/minos/tetrio.png",
  "/board/generic/board.png",
  "/board/generic/grid.png",
  "/board/generic/queue.png"
];

const ROOT_RES = [
  "40l.svg",
  "multi.svg",
  "about.svg",
  "osk.svg",
  "altpolicy.png",
  "avatar.png",
  "banner.png",
  "quickplay.svg",
  "roomlisting.svg",
  "blitz.svg",
  "silence.ogg",
  "cfg.svg",
  "channel.svg",
  "social_offline.png",
  "customgame.svg",
  "solo.svg",
  "customsolo.svg",
  "supporter-perk-ads.png",
  "finalwarning.png",
  "supporter-perk-amend.png",
  "supporter-perk-badge.png",
  "supporter-perk-customize.png",
  "footer.png",
  "supporter-perk-discordrole.png",
  "header-overlay.png",
  "supporter-perk-emotes.png",
  "hurtrecord.png",
  "supporter-perk-friends.png",
  "supporter-perk-love.png",
  "kagari.png",
  "league.png",
  "supporter-perk-vanityroom.png",
  "supporter-tag.png",
  "league.svg",
  "supporter-tag-shiny.png",
  "league-w.png",
  "zen.svg",
  "logo.png",
  "notfound.png",
  "verified-mod.png",
  "verified.png"
];

/**
 * All the flags are available
 * in `/res/flags/<name>.png
 */
const RES_FLAGS = [
  "xx", // Unknown
  "fr", // French
  "us", // United-States
  "ph",
  "ca",
  "sg",
  "my",
  "ru",
  "tr",
  "de",
  "tw",
  "th",
  "kr",
  "se",
  "id",
  "ua",
  "aq",
  "bm",
  "mx",
  "br",
  "co",
  "fi",
  "pe",
  "ar",
  "it",
  "gt",
  "cl",
  "pl",
  "ro",
  "ec",
  "es",
  "vi",
  "nl",
  "pk",
  "au",
  "cz"
];

const RES_LEAGUE_RANKS = [
  "x", "u", "c", "a", "d", "z", "b"
];

const RES_CUTIN = [
  "/superlobby/backing.png"
];

const RES_FONT = [
  "cb.ttf",
  "ccb.ttf",
  "cr.ttf",
  "ccr.ttf",
  "hun2-cheeky.ttf",
  "hun2.ttf",
  "hun.fnt",
  "hun.png",
  "pfw.ttf"
];

const RES_STATUS = [
  "blocked",
  "offline",
  "online",
  "unknown"
];

const RES_PROMO = [
  "league-big.png"
];

/** @param {string} path */
const checkFileExists = (path) => {
  return fs.promises.access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
};

/** @param {string} path */
const download = async (path, force = false) => {
  const file_path = new URL("../public" + path, import.meta.url).pathname;
  const url_path = "https://tetr.io" + path;

  const exists = await checkFileExists(file_path);
  if (exists && !force) {
    console.warn("already downloaded. skipping...");
    return;
  }

  const pipeline = promisify(stream.pipeline);
  await pipeline(
	  got.stream(url_path),
	  fs.createWriteStream(file_path)
  );
};

// ----- Execution...
// We clear the console for more style.
console.clear();

console.group("create directories");

for (const relative_path of DIRS) {
  const full_path = new URL("../public" + relative_path, import.meta.url).pathname;
  await fs.promises.mkdir(full_path, { recursive: true });
  console.info("+", relative_path);
}

console.groupEnd();

console.group("download globals");

for (const path of GLOBALS) {
  await download(path, true);
  console.info("+", path);
}

console.groupEnd();

console.group("download resources");

  for (const path of ROOT_RES) {
    await download(`/res/${path}`);
    console.info("+", path);
  }

  console.group("download skins");
  for (const img_path of RES_SKINS) {
    await download("/res/skins" + img_path);
    console.info(`+ ${img_path} into '/res/skins'`);
  }
  console.groupEnd();

  console.group("download fonts");
  for (const font_path of RES_FONT) {
    await download("/res/font/" + font_path);
    console.info("+", font_path, "into '/res/font'");
  }
  console.groupEnd();

  console.group("download icons");
  for (const icon_path of RES_ICON) {
    await download(`/res/icon/${icon_path}`);
    console.info("+", icon_path, "into '/res/icon'");
  }
  console.groupEnd();

  console.group("download cutins");
  for (const cutin_path of RES_CUTIN) {
    await download("/res/cutin" + cutin_path);
    console.info("+", cutin_path, "into '/res/cutin'");
  }
  console.groupEnd();

  console.group("download league ranks");
  for (const rank_name of RES_LEAGUE_RANKS) {
    await download(`/res/league-ranks/${rank_name}.png`);
    console.info("+", rank_name, "into '/res/league-ranks'");
  }
  console.groupEnd();

  console.group("download particles");
  for (const particle_path of RES_PARTICLES) {
    await download(`/res/particles/${particle_path}`);
    console.info("+", particle_path, "into '/res/particles'");
  }
  console.groupEnd();

  console.group("download backgrounds (35)");
  for (let i = 1; i <= 35; i++) {
    await download(`/res/bg/${i}.jpg`);
    console.info(`+ background ${i}/35 into '/res/bg'`);
  }
  console.groupEnd();

  console.group("download background musics");
  for (const music_index in RES_BGMS) {
    const music_name = RES_BGMS[music_index];

    await download(`/res/bgm/${music_name}.mp3`);
    console.info(`+ ${music_name} (${music_index}/${RES_BGMS.length}) into '/res/bgm'`);
  }
  console.groupEnd();

  console.group("download flags");
  for (const flag_name of RES_FLAGS) {
    await download(`/res/flags/${flag_name}.png`);
    console.info("+", flag_name, "into '/res/flags'");
  }
  console.groupEnd();

  console.group("download emotes");
  for (const emote_path of RES_EMOTES) {
    await download(`/res/emotes/${emote_path}`);
    console.info("+", emote_path, "into '/res/emotes'");
  }
  console.groupEnd();

  console.group("download statuses");
  for (const status_name of RES_STATUS) {
    await download(`/res/status/${status_name}.png`);
    console.info(`+ ${status_name}.png into '/res/status'`);
  }
  console.groupEnd();

  console.group("download promos");
  for (const promo_path of RES_PROMO) {
    await download(`/res/promo/${promo_path}`);
    console.info(`+ ${promo_path} into '/res/promo'`);
  }
  console.groupEnd();

console.groupEnd();

console.group("tweak endpoints");

const tetrio_js_path = new URL("../public/js/tetrio.js", import.meta.url).pathname;

console.info("get tetrio.js file");
const tetrio_js_old = await fs.promises.readFile(
  tetrio_js_path, { encoding: "utf8" }
);

console.info("replace endpoints...");
const tetrio_js_new = tetrio_js_old
  .replace(/\/api/gi, "/proxy/api")
  .replace(/\/user-content/gi, "/proxy/user-content")
  .replace(/\/about/gi, "/proxy/about");

console.info("overwrite file...");
await fs.promises.writeFile(
  tetrio_js_path, tetrio_js_new, { encoding: "utf8" }
);

console.groupEnd();

