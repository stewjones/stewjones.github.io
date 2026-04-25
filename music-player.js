// ===== 1) EDIT THIS LIST ONLY to add/remove tracks =====
const tracks = [
  { src: "music/ac.mp3", title: "2:30 PM", desc: "A track I made inspired by the hourly themes of Animal Crossing. I was really happy with how the bass would feel if you were running around in your world." },
  { src: "music/krillion.mp3", title: "Krillion (The Deep Dark)", desc:"The title track I made for the game 'The Deep Dark'. Despite the game intending to have a scary/dark nature, I felt like a track like this could get the player excited and relate to the pixel art theme, while still at least feeling watery due to the chord brushes."},
  { src: "music/predation2.mp3", title: "Predation (The Deep Dark)", desc:"This track is going to be used for the trailer for 'The Deep Dark'. I built a much more intense vibe for this track compared to the title theme, and intended to have the percussion near the end sounding like gnashing teeth."},
  { src: "music/caves_demo.mp3", title: "Caves Demo (The Deep Dark)", desc:"This track was my first idea for a potential theme for the levels in 'The Deep Dark', but I felt like the vibe of it was too happy to fit the darker atmosphere of our game. The intro of the track was meant to be used for the shop screens, and the main section for the levels."},
  { src: "music/ayers.mp3", title: "Smile", desc:"A melodic hip-hop track I made after being inspired by the song 'D.C. City' by Roy Ayers."},
  { src: "music/nyx_leitmotif1.wav", title: "Nyx Leitmotif (Changeling VR)", desc:"My main musical contribution to Changeling, this track is meant to be the lead up to Nyx's primary reveal in the game. I was given plenty of creative freedom for the track, so I made the vibe much darker than the music that surrounds it. The track is split between just the drum portion and the full song in game, with the full song playing when you hit the sound queue at the dragon reveal."},
  { src: "music/gunn.mp3", title: "War Outside", desc:"This is a sample heavy hip-hop track that is heavily inspired by tracks made by Westside Gunn."},
  { src: "music/lw.mp3", title: "Catch the Dog (You Get The Love)", desc: "The instrumental version of a track off my EP 'You Get The Love', I was really into the idea of multiple parts within a song for this track. The more pop sounding first leg of the song is replaced with a stripped down, faster section, with live bass played by myself." },
  { src: "music/swaw.mp3", title: "I Get The Door (You Get The Love)", desc: "The outro track off my EP 'You Get The Love', this track was inspired by the sound of groups like The Avalanches and The Go! Team with their more sample heavy style. The track includes a sample from The Holydrug Couple and Bonnie Pointer." },
  { src: "music/bb.mp3", title: "Shoppin'", desc: "A playful track I made when thinking about bossa nova styled music, makes a pretty good shop theme." },
  { src: "music/HOOOKER_REMIX.mp3", title: "Hookers Remix", desc: "This is a house remix of the song 'Hookers' by Tierra Whack, off her album Whack World. That album has been super inspirational to me, as it crams a lot of interesting music ideas/phrases into a full album of 1 minute tracks."},
  { src: "music/matt_martians.mp3", title: "Leave Ya", desc: "This is a jazzy pop track inspired pretty heavily by the work of Matt Martians. I had some good singing leads on this track, which I turned into the saxophone lead for this version."},
  { src: "music/kool.mp3", title: "Are U Sure?", desc: "This track is based around a guitar lick of the track 'You Don't Have To Change' by Kool & The Gang. I might've done too much with the strings at the end."},
  { src: "music/cool_st.mp3", title: "Cool Street", desc: "A random track I made at some point that makes me think of a city block or town where there's a mystery going on, and you're urged to figure out and solve it."},
    { src: "music/stupid_mode.mp3", title: "1 Phone", desc: "I was experimenting with live instruments for this track, and a lot of the foundational harmonics on this song are with the first guitar I ever had. The guitar was way too small and you can hear how the strings were barely holding on to the saddle." },

];

// ===== 2) Everything below is the player logic =====
const audio = document.getElementById("audio");

// Set default volume (0.0 → 1.0)
audio.volume = 0.5;

const trackList = document.getElementById("trackList");
const trackDescription = document.getElementById("trackDescription");
const trackDescriptionTitle = document.getElementById("trackDescriptionTitle");
const npPlay = document.getElementById("npPlay");
const npTitle = document.getElementById("npTitle");
const npTime = document.getElementById("npTime");
const npDuration = document.getElementById("npDuration");
const npProgress = document.getElementById("npProgress");
const npVolume = document.getElementById("npVolume");

let rows = []; // will be created
let selectedRow = null;
let userSeeking = false;

function fmtTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function updatePlayButton() {
  npPlay.textContent = audio.paused ? "▶" : "❚❚";
}

function setSelected(row) {
  if (selectedRow) selectedRow.classList.remove("is-selected");
  selectedRow = row;
  selectedRow.classList.add("is-selected");

  rows.forEach((r) => r.setAttribute("aria-selected", r === selectedRow ? "true" : "false"));
}

function loadTrackByIndex(index, autoplay = true) {
  const track = tracks[index];
  if (!track) return;

  const row = rows[index];
  if (row) setSelected(row);

  audio.src = track.src;

  // Update title + description panel
  npTitle.textContent = track.title || track.src;
  trackDescriptionTitle.textContent = track.title || track.src;
  trackDescription.textContent = track.desc || "No track description.";

  // Reset UI
  npTime.textContent = "0:00";
  npDuration.textContent = "0:00";
  npProgress.value = 0;

  if (autoplay) {
    audio.play().catch(() => {});
  }
}

function buildTrackList() {
  trackList.innerHTML = "";

  rows = tracks.map((t, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "track-row";
    btn.setAttribute("role", "option");

    // Structure to match your CSS
    const idx = document.createElement("span");
    idx.className = "track-index";
    idx.textContent = `${i + 1}.`;

    const name = document.createElement("span");
    name.className = "track-name";
    name.textContent = t.title || t.src;

    btn.appendChild(idx);
    btn.appendChild(name);

    btn.addEventListener("click", () => loadTrackByIndex(i, true));
    trackList.appendChild(btn);

    return btn;
  });
}

// Build UI first
buildTrackList();

// Play/pause button
npPlay.addEventListener("click", () => {
  if (!audio.src) {
    loadTrackByIndex(0, true);
    return;
  }

  if (audio.paused) audio.play();
  else audio.pause();
});

// Metadata -> duration
audio.addEventListener("loadedmetadata", () => {
  npDuration.textContent = fmtTime(audio.duration);
});

npVolume.addEventListener("input", () => {
  audio.volume = npVolume.value;
});

// Time/progress updates
audio.addEventListener("timeupdate", () => {
  if (userSeeking) return;

  npTime.textContent = fmtTime(audio.currentTime);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    npProgress.value = Math.floor((audio.currentTime / audio.duration) * 1000);
  }
});

// Update play icon
audio.addEventListener("play", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);
audio.addEventListener("ended", () => {
  updatePlayButton();
  npProgress.value = 0;
  npTime.textContent = "0:00";
});

// Seek bar
npProgress.addEventListener("input", () => {
  userSeeking = true;
});

npProgress.addEventListener("change", () => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    audio.currentTime = (npProgress.value / 1000) * audio.duration;
  }
  userSeeking = false;
});

// Optional: preselect first track without autoplay
// loadTrackByIndex(0, false);