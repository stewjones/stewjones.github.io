 const audio = document.getElementById("audio");

  const trackList = document.getElementById("trackList");
  const rows = Array.from(trackList.querySelectorAll(".track-row"));

  const npPlay = document.getElementById("npPlay");
  const npTitle = document.getElementById("npTitle");
  const npTime = document.getElementById("npTime");
  const npDuration = document.getElementById("npDuration");
  const npProgress = document.getElementById("npProgress");

  let selectedRow = null;
  let userSeeking = false;

  function fmtTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function setSelected(row) {
    if (selectedRow) selectedRow.classList.remove("is-selected");
    selectedRow = row;
    selectedRow.classList.add("is-selected");
    rows.forEach(r => r.setAttribute("aria-selected", r === selectedRow ? "true" : "false"));
  }

  function loadTrack(row, autoplay = true) {
    const src = row.dataset.src;
    const title = row.dataset.title || src;

    setSelected(row);

    audio.src = src;
    npTitle.textContent = title;

    // Reset UI while metadata loads
    npTime.textContent = "0:00";
    npDuration.textContent = "0:00";
    npProgress.value = 0;

    if (autoplay) {
      audio.play().catch(() => {
        // Autoplay can be blocked; user can hit play.
      });
    }
  }

  function updatePlayButton() {
    npPlay.textContent = audio.paused ? "▶" : "❚❚";
  }

  // Click a row to select + play
  rows.forEach(row => {
    row.addEventListener("click", () => loadTrack(row, true));
  });

  // Play/pause button
  npPlay.addEventListener("click", () => {
    if (!audio.src) {
      // If nothing selected, pick the first track
      if (rows[0]) loadTrack(rows[0], true);
      return;
    }
    if (audio.paused) audio.play();
    else audio.pause();
  });

  // When metadata loads, show duration
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

  // Update play icon on play/pause/end
  audio.addEventListener("play", updatePlayButton);
  audio.addEventListener("pause", updatePlayButton);
  audio.addEventListener("ended", () => {
    updatePlayButton();
    npProgress.value = 0;
    npTime.textContent = "0:00";
  });

  // Seek bar behavior
  npProgress.addEventListener("input", () => {
    userSeeking = true;
  });

  npProgress.addEventListener("change", () => {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      const target = (npProgress.value / 1000) * audio.duration;
      audio.currentTime = target;
    }
    userSeeking = false;
  });

  // Optional: select first track but don't autoplay
  // if (rows[0]) loadTrack(rows[0], false);