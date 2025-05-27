const playBtn = document.querySelector("#play");
const audio = document.querySelector("audio");
const voiceRange = document.querySelector("#voice");
const voiceValue = document.querySelector("#voice-value");
const container = document.querySelector(".container");
const backward = document.querySelector("#backward");
const forward = document.querySelector("#forward");
const cover = document.querySelector("#cover");
const progress = document.querySelector(".progress");
const progressContainer = document.querySelector(".progress-container");
const trackTitle = document.querySelector("#track-title");
const artist = document.querySelector("#artist");
const currentTimeDisplay = document.querySelector("#current-time");
const durationDisplay = document.querySelector("#duration");
const likeBtn = document.querySelector("#like");
const loopBtn = document.querySelector("#loop");
const randomBtn = document.querySelector("#random");

const musics = [
  { title: "Самый пьяный округ в мире", artist: "MACAN" },
  { title: "Shazam", artist: "MACAN" },
  { title: "Как je", artist: "MACAN, Kiliana" },
  { title: "L", artist: "MACAN" },
  { title: "Привыкаю", artist: "MACAN, A.V.G" },
  { title: "ASPHALT 8", artist: "MACAN" },
  { title: "Спой", artist: "A.V.G, MACAN" },
  { title: "Кино", artist: "MACAN" },
  { title: "За всех", artist: "MACAN" },
];

let currentMusic = 0;
let likedTracks = new Set();
let isLooping = false;

function changeMusic(currentMusic) {
  cover.src = `./images/${musics[currentMusic].title}.png`;
  cover.alt = musics[currentMusic].title;
  audio.src = `./music/${musics[currentMusic].title}.mp3`;
  trackTitle.textContent = musics[currentMusic].title;
  artist.textContent = musics[currentMusic].artist;
  likeBtn.classList.toggle(
    "active",
    likedTracks.has(musics[currentMusic].title)
  );
}

changeMusic(currentMusic);

audio.volume = 0.5;
voiceValue.textContent = 50;

function play() {
  audio.play();
  container.classList.add("play");
  playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
}

function pause() {
  audio.pause();
  container.classList.remove("play");
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${min}:${sec}`;
}

forward.addEventListener("click", () => {
  if (musics.length - 1 > currentMusic) {
    currentMusic++;
  } else {
    currentMusic = 0;
  }
  changeMusic(currentMusic);
  play();
});

backward.addEventListener("click", () => {
  if (currentMusic !== 0) {
    currentMusic--;
  } else {
    currentMusic = musics.length - 1;
  }
  changeMusic(currentMusic);
  play();
});

playBtn.addEventListener("click", () => {
  const isPlaying = container.classList.contains("play");

  if (isPlaying) {
    pause();
  } else {
    play();
  }
});

voiceRange.addEventListener("input", () => {
  audio.volume = voiceRange.value / 100;
  voiceValue.textContent = voiceRange.value;
});

audio.addEventListener("timeupdate", () => {
  progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  currentTimeDisplay.textContent = formatTime(audio.currentTime);
  durationDisplay.textContent = formatTime(audio.duration);
});

audio.addEventListener("loadedmetadata", () => {
  durationDisplay.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", () => {
  if (isLooping) {
    audio.currentTime = 0;
    play();
  } else if (musics.length - 1 > currentMusic) {
    currentMusic++;
  } else {
    currentMusic = 0;
  }
  changeMusic(currentMusic);
  play();
});

progressContainer.addEventListener("click", (e) => {
  const rect = progressContainer.getBoundingClientRect();
  const offsetX = e.clientX - rect.left;
  const newTime = (offsetX / rect.width) * audio.duration;
  audio.currentTime = newTime;
});

likeBtn.addEventListener("click", () => {
  const currentTrack = musics[currentMusic].title;
  if (likedTracks.has(currentTrack)) {
    likedTracks.delete(currentTrack);
  } else {
    likedTracks.add(currentTrack);
  }
  likeBtn.classList.toggle("active");
});

loopBtn.addEventListener("click", () => {
  isLooping = !isLooping;
  audio.loop = isLooping;
  loopBtn.classList.toggle("active", isLooping);
});

randomBtn.addEventListener("click", () => {
  let newMusic;
  do {
    newMusic = Math.floor(Math.random() * musics.length);
  } while (newMusic === currentMusic);
  currentMusic = newMusic;
  changeMusic(currentMusic);
  play();
});
