// ===== 1) EDIT THIS LIST ONLY to add/remove tracks =====
const tracks = [
  { src: "music/bb.mp3", title: "Shoppin'", desc: "A playful track I made when thinking about bossa nova styled music, makes a pretty good shop theme." },
  { src: "music/swaw.mp3", title: "I Get The Door (You Get The Love)", desc: "The outro track off my EP 'You Get The Love', this track was inspired by the sound of groups like The Avalanches and The Go! Team with their more sample heavy style. The track includes a sample from The Holydrug Couple and Bonnie Pointer." },
  { src: "music/lw.mp3", title: "Catch the Dog (You Get The Love)", desc: "The instrumental version of a track off my EP 'You Get The Love', I was really into the idea of multiple parts within a song for this track. The more pop sounding first leg of the song is replaced with a stripped down, faster section, with live bass played by myself." },
  { src: "music/stupid_mode.mp3", title: "1 Phone", desc: "I was experimenting with live instruments for this track, and a lot of the foundational harmonics on this song are with the first guitar I ever had. The guitar was way too small and you can hear how the strings were barely holding on to the saddle." },
  { src: "music/krillion.mp3", title: "Krillion (The Deep Dark)", desc:"The title track I made for the game 'The Deep Dark'. Despite the game intending to have a scary/dark nature, I felt like a track like this could get the player excited and relate to the pixel art theme, while still at least feeling watery due to the chord brushes."},
  { src: "music/predation2.mp3", title: "Predation (The Deep Dark)", desc:"This track is going to be used for the trailer for 'The Deep Dark'. I built a much more intense vibe for this track compared to the title theme, and intended to have the percussion near the end sounding like gnashing teeth."}
];

// ===== 2) Everything below is the player logic =====
const audio = document.getElementById("audio");

const trackList = document.getElementById("trackList");
const trackDescription = document.getElementById("trackDescription");
const trackDescriptionTitle = document.getElementById("trackDescriptionTitle");
const npPlay = document.getElementById("npPlay");
const npTitle = document.getElementById("npTitle");
const npTime = document.getElementById("npTime");
const npDuration = document.getElementById("npDuration");
const npProgress = document.getElementById("npProgress");


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