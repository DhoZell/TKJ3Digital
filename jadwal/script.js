// ================================================================
// PWA - Service Worker + Install Prompt
// ================================================================

let deferredInstallPrompt = null;

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => {
        console.log('SW registered:', reg.scope);
        // Kirim jadwal ke SW setelah register
        sendScheduleToSW();
      })
      .catch(err => console.log('SW error:', err));

    // Terima pesan dari SW
    navigator.serviceWorker.addEventListener('message', e => {
      if (e.data && e.data.type === 'REQUEST_SCHEDULE') {
        sendScheduleToSW();
      }
    });
  });
}

function sendScheduleToSW() {
  if (!navigator.serviceWorker.controller) return;
  navigator.serviceWorker.controller.postMessage({
    type: 'SCHEDULE_NOTIFS',
    schedule: JADWAL
  });
}

// Tangkap install prompt (Android Chrome)
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredInstallPrompt = e;
  document.getElementById('install-banner').style.display = 'block';
});

// Kalau udah diinstall, sembunyikan banner
window.addEventListener('appinstalled', () => {
  document.getElementById('install-banner').style.display = 'none';
  deferredInstallPrompt = null;
  showToast('Berhasil diinstall! 🎉', 'Notifikasi sekarang jalan otomatis.', '📲', 'var(--acc)', 5000);
});

// Tombol install
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('install-btn')?.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    const result = await deferredInstallPrompt.userChoice;
    if (result.outcome === 'accepted') {
      deferredInstallPrompt = null;
    }
  });

  document.getElementById('install-dismiss')?.addEventListener('click', () => {
    document.getElementById('install-banner').style.display = 'none';
  });
});

// ================================================================
// JADWAL ASLI - Sesuai foto kamu
// Format: setiap pelajaran langsung 1 blok (udah digabung per mapel)
// ================================================================

const JADWAL = {

  Senin: {
    sessions: [
      { label: "Sesi Pagi", start: "07:30", end: "09:40" },
      { label: "Sesi Siang", start: "10:10", end: "12:00" },
      { label: "Sesi Akhir", start: "12:40", end: "13:45" },
    ],
    breaks: [
      { jam: "09:40 - 10:10", label: "Istirahat" },
      { jam: "12:00 - 12:40", label: "Istirahat & Sholat" },
    ],
    pelajaran: [
      { mapel: "AIJ",  guru: "Pak Fadil",  jam: "07:30 - 09:30", durasi: "3 Jam" },
      { mapel: "TLJ",  guru: "Pak Wahyu",  jam: "09:30 - 09:40", durasi: "— lanjut" },
      { mapel: "TLJ",  guru: "Pak Wahyu",  jam: "10:10 - 11:30", durasi: "3 Jam total" },
      { mapel: "PKK",  guru: "Bu Indah",   jam: "11:30 - 13:45", durasi: "2 Jam" },
    ],
  },

  Selasa: {
    sessions: [
      { label: "Sesi Pagi", start: "07:00", end: "09:40" },
      { label: "Sesi Siang", start: "10:10", end: "12:00" },
      { label: "Sesi Akhir", start: "12:40", end: "13:40" },
    ],
    breaks: [
      { jam: "09:40 - 10:10", label: "Istirahat" },
      { jam: "12:00 - 12:40", label: "Istirahat & Sholat" },
    ],
    pelajaran: [
      { mapel: "PAI",         guru: "Bu Yuhana", jam: "07:00 - 08:20", durasi: "2 Jam" },
      { mapel: "PJOK",        guru: "Bu Lis",    jam: "08:20 - 09:40", durasi: "2 Jam" },
      { mapel: "ASJ/Siskom",  guru: "Bu Ade",    jam: "10:10 - 13:40", durasi: "5 Jam" },
    ],
  },

  Rabu: {
    sessions: [
      { label: "Sesi Pagi", start: "07:00", end: "09:40" },
      { label: "Sesi Siang", start: "10:10", end: "12:00" },
      { label: "Sesi Akhir", start: "12:40", end: "13:40" },
    ],
    breaks: [
      { jam: "09:40 - 10:10", label: "Istirahat" },
      { jam: "12:00 - 12:40", label: "Istirahat & Sholat" },
    ],
    pelajaran: [
      { mapel: "B.Inggris", guru: "Pak Hendra", jam: "07:00 - 08:20", durasi: "2 Jam" },
      { mapel: "MTK",       guru: "Pak Arif",   jam: "08:20 - 09:00", durasi: "1 Jam" },
      { mapel: "B.Indo",    guru: "Pak Syahri", jam: "09:00 - 09:40", durasi: "— lanjut" },
      { mapel: "B.Indo",    guru: "Pak Syahri", jam: "10:10 - 11:30", durasi: "3 Jam total" },
      { mapel: "TLJ",       guru: "Pak Wahyu",  jam: "11:30 - 12:00", durasi: "— lanjut" },
      { mapel: "TLJ",       guru: "Pak Wahyu",  jam: "12:40 - 13:00", durasi: "1 Jam total" },
      { mapel: "PKK",       guru: "Bu Indah",   jam: "13:00 - 13:40", durasi: "2 Jam" },
    ],
  },

  Kamis: {
    sessions: [
      { label: "Sesi Pagi", start: "07:00", end: "09:40" },
      { label: "Sesi Siang", start: "10:10", end: "12:00" },
      { label: "Sesi Akhir", start: "12:40", end: "13:40" },
    ],
    breaks: [
      { jam: "09:40 - 10:10", label: "Istirahat" },
      { jam: "12:00 - 12:40", label: "Istirahat & Sholat" },
    ],
    pelajaran: [
      { mapel: "MTK",        guru: "Pak Arif",       jam: "07:00 - 08:20", durasi: "2 Jam" },
      { mapel: "ASJ/Siskom", guru: "Bu Ade",         jam: "08:20 - 09:40", durasi: "2 Jam" },
      { mapel: "PKN",        guru: "Pak Aziz",       jam: "10:10 - 11:30", durasi: "2 Jam" },
      { mapel: "B.Jepang",   guru: "Sensei Sanadi",  jam: "11:30 - 12:00", durasi: "— lanjut" },
      { mapel: "B.Jepang",   guru: "Sensei Sanadi",  jam: "12:40 - 13:20", durasi: "2 Jam total" },
      { mapel: "AIJ",        guru: "Pak Fadil",      jam: "13:20 - 13:40", durasi: "1 Jam" },
    ],
  },

  Jumat: {
    sessions: [
      { label: "Sesi Pagi", start: "07:30", end: "09:40" },
      { label: "Sesi Siang", start: "10:10", end: "11:00" },
    ],
    breaks: [
      { jam: "09:40 - 10:10", label: "Istirahat" },
    ],
    pelajaran: [
      { mapel: "TLJ",               guru: "Pak Wahyu", jam: "07:30 - 08:50", durasi: "2 Jam" },
      { mapel: "Pemrograman Dasar", guru: "Bu Olip",   jam: "08:50 - 09:40", durasi: "— lanjut" },
      { mapel: "Pemrograman Dasar", guru: "Bu Olip",   jam: "10:10 - 10:30", durasi: "2 Jam total" },
      { mapel: "AIJ",               guru: "Pak Fadil", jam: "10:30 - 11:00", durasi: "2 Jam" },
    ],
  },

  Sabtu: {
    sessions: [
      { label: "Sesi Pagi", start: "07:00", end: "09:40" },
      { label: "Sesi Siang", start: "10:10", end: "12:00" },
      { label: "Sesi Akhir", start: "12:40", end: "13:40" },
    ],
    breaks: [
      { jam: "09:40 - 10:10", label: "Istirahat" },
      { jam: "12:00 - 12:40", label: "Istirahat & Sholat" },
    ],
    pelajaran: [
      { mapel: "Sejarah",    guru: "Bu Nurmeida",  jam: "07:00 - 08:20", durasi: "2 Jam" },
      { mapel: "ASJ/Siskom", guru: "Bu Ade",       jam: "08:20 - 09:00", durasi: "1 Jam" },
      { mapel: "B.Inggris",  guru: "Pak Hendra",   jam: "09:00 - 09:40", durasi: "— lanjut" },
      { mapel: "B.Inggris",  guru: "Pak Hendra",   jam: "10:10 - 10:50", durasi: "2 Jam total" },
      { mapel: "PAI",        guru: "Bu Yuhana",    jam: "10:50 - 11:30", durasi: "1 Jam" },
      { mapel: "PKK",        guru: "Bu Indah",     jam: "11:30 - 12:00", durasi: "— lanjut" },
      { mapel: "PKK",        guru: "Bu Indah",     jam: "12:40 - 13:00", durasi: "1 Jam total" },
      { mapel: "B.Arab",     guru: "Pak Tajudin",  jam: "13:00 - 13:40", durasi: "2 Jam" },
    ],
  },
};

// ================================================================
// CONFIG
// ================================================================

const EMOJI = {
  "AIJ":               "🤖",
  "TLJ":               "🌐",
  "PKK":               "💼",
  "PAI":               "📿",
  "PJOK":              "⚽",
  "ASJ/Siskom":        "💻",
  "B.Indo":            "📚",
  "B.Inggris":         "🌍",
  "MTK":               "📐",
  "PKN":               "🏛️",
  "B.Jepang":          "🗾",
  "Sejarah":           "🏺",
  "Pemrograman Dasar": "⌨️",
  "B.Arab":            "📜",
  "default":           "📖",
};

const COLOR = {
  "AIJ":               "var(--c-aij)",
  "TLJ":               "var(--c-tlj)",
  "PKK":               "var(--c-pkk)",
  "PAI":               "var(--c-pai)",
  "PJOK":              "var(--c-pjok)",
  "ASJ/Siskom":        "var(--c-siskom)",
  "B.Indo":            "var(--c-bind)",
  "B.Inggris":         "var(--c-bing)",
  "MTK":               "var(--c-mtk)",
  "PKN":               "var(--c-pkn)",
  "B.Jepang":          "var(--c-bjp)",
  "Sejarah":           "var(--c-sej)",
  "Pemrograman Dasar": "var(--c-pd)",
  "B.Arab":            "var(--c-barab)",
  "default":           "var(--c-default)",
};

const DAYS_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS_ID = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

// ================================================================
// STATE
// ================================================================

let activeDay = null;
let notifCount = 0;
let shownNotifs = new Set();
let browserNotifAllowed = false;

// ================================================================
// BOOT
// ================================================================

document.addEventListener("DOMContentLoaded", () => {
  const todayIdx = new Date().getDay();
  const todayName = DAYS_ID[todayIdx];
  // Pilih hari sekarang kalau ada jadwalnya, fallback ke Senin
  activeDay = JADWAL[todayName] ? todayName : "Senin";

  setupTabs();
  renderDay(activeDay);
  setActiveTab(activeDay);
  updateHero(activeDay);
  startClock();
  updateNextClass();
  updateProgress();
  requestNotifPermission();

  // Cek tiap 30 detik
  setInterval(() => {
    renderDay(activeDay);
    updateNextClass();
    updateProgress();
    checkNotifs();
  }, 30000);

  checkNotifs();
});

// ================================================================
// CLOCK
// ================================================================

function startClock() {
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,"0");
    const m = String(now.getMinutes()).padStart(2,"0");
    document.getElementById("live-clock").textContent = `${h}:${m}`;
  }
  tick();
  setInterval(tick, 1000);
}

// ================================================================
// TABS
// ================================================================

function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeDay = btn.dataset.day;
      setActiveTab(activeDay);
      renderDay(activeDay);
      updateHero(activeDay);
      updateNextClass();
      updateProgress();
    });
  });
}

function setActiveTab(day) {
  document.querySelectorAll(".tab-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.day === day);
  });
}

// ================================================================
// HERO
// ================================================================

function updateHero(day) {
  document.getElementById("hero-day").textContent = day;
  const now = new Date();
  document.getElementById("hero-date").textContent =
    `${DAYS_ID[now.getDay()]}, ${now.getDate()} ${MONTHS_ID[now.getMonth()]} ${now.getFullYear()}`;
}

// ================================================================
// PROGRESS
// ================================================================

function toMins(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

function nowMins() {
  const n = new Date();
  return n.getHours() * 60 + n.getMinutes();
}

function updateProgress() {
  const todayName = DAYS_ID[new Date().getDay()];
  const row = document.getElementById("progress-row");

  if (activeDay !== todayName || !JADWAL[activeDay]) {
    row.style.display = "none";
    return;
  }

  row.style.display = "flex";
  const data = JADWAL[activeDay];
  const allSessions = data.sessions;
  const start = toMins(allSessions[0].start);
  const end = toMins(allSessions[allSessions.length - 1].end);
  const cur = nowMins();

  let pct = 0;
  if (cur >= start && cur <= end) {
    pct = Math.round(((cur - start) / (end - start)) * 100);
  } else if (cur > end) {
    pct = 100;
  }

  document.getElementById("prog-fill").style.width = pct + "%";
  document.getElementById("prog-pct").textContent = pct + "%";
}

// ================================================================
// NEXT CLASS
// ================================================================

function updateNextClass() {
  const todayName = DAYS_ID[new Date().getDay()];
  const pill = document.getElementById("nc-text");

  if (activeDay !== todayName || !JADWAL[activeDay]) {
    pill.textContent = "Pilih hari untuk lihat jadwal";
    return;
  }

  const items = JADWAL[activeDay].pelajaran;
  const cur = nowMins();

  // Cari yang belum mulai
  const next = items.find(p => {
    const startStr = p.jam.split(" - ")[0].trim();
    return toMins(startStr) > cur;
  });

  // Cari yang sedang berlangsung
  const active = items.find(p => {
    const [s, e] = p.jam.split(" - ").map(t => toMins(t.trim()));
    return cur >= s && cur < e;
  });

  if (active) {
    const emoji = EMOJI[active.mapel] || EMOJI.default;
    pill.textContent = `${emoji} Sekarang: ${active.mapel} · ${active.jam.split(" - ")[1]}`;
  } else if (next) {
    const emoji = EMOJI[next.mapel] || EMOJI.default;
    const startStr = next.jam.split(" - ")[0].trim();
    const diff = toMins(startStr) - cur;
    if (diff <= 5) {
      pill.textContent = `${emoji} ${next.mapel} dalam ${diff} menit!`;
    } else {
      pill.textContent = `${emoji} Selanjutnya: ${next.mapel} jam ${startStr}`;
    }
  } else {
    pill.textContent = "✅ Jadwal hari ini selesai. GWS!";
  }
}

// ================================================================
// RENDER SCHEDULE
// ================================================================

function getColor(mapel) {
  return COLOR[mapel] || COLOR.default;
}

function getEmoji(mapel) {
  return EMOJI[mapel] || EMOJI.default;
}

function isActive(jamStr) {
  const todayName = DAYS_ID[new Date().getDay()];
  if (activeDay !== todayName) return false;
  const parts = jamStr.split(" - ");
  if (parts.length < 2) return false;
  const s = toMins(parts[0].trim());
  const e = toMins(parts[1].trim());
  const c = nowMins();
  return c >= s && c < e;
}

function isPast(jamStr) {
  const todayName = DAYS_ID[new Date().getDay()];
  if (activeDay !== todayName) return false;
  const parts = jamStr.split(" - ");
  if (parts.length < 2) return false;
  const e = toMins(parts[1].trim());
  return nowMins() >= e;
}

function renderDay(day) {
  const container = document.getElementById("sched-list");
  const data = JADWAL[day];

  if (!data) {
    container.innerHTML = `<div style="color:var(--muted);font-size:15px;padding:20px 0;text-align:center;">Libur bro. Santuy 😎</div>`;
    return;
  }

  container.innerHTML = "";

  // Build combined timeline: pelajaran + istirahat, sorted by start time
  let timeline = [];

  data.pelajaran.forEach((p, i) => {
    const startStr = p.jam.split(" - ")[0].trim();
    timeline.push({ type: "pelajaran", data: p, sortTime: toMins(startStr), idx: i });
  });

  data.breaks.forEach(b => {
    const startStr = b.jam.split(" - ")[0].trim();
    timeline.push({ type: "break", data: b, sortTime: toMins(startStr) });
  });

  timeline.sort((a, b) => a.sortTime - b.sortTime);

  // Track session for headers
  let lastSession = null;
  const sessions = data.sessions;

  function getSessionForTime(t) {
    for (const s of sessions) {
      if (t >= toMins(s.start) && t <= toMins(s.end)) return s.label;
    }
    return null;
  }

  let jamCounter = 0;

  timeline.forEach((item, i) => {
    const curSession = getSessionForTime(item.sortTime);

    // Insert session header if changed
    if (curSession && curSession !== lastSession) {
      lastSession = curSession;
      const hdr = document.createElement("div");
      hdr.className = "session-header";
      hdr.innerHTML = `<div class="sh-line"></div><div class="sh-label">${curSession}</div><div class="sh-line"></div>`;
      container.appendChild(hdr);
    }

    if (item.type === "break") {
      const bc = document.createElement("div");
      bc.className = "break-card";
      const icon = item.data.label.includes("Sholat") ? "🕌" : "☕";
      bc.innerHTML = `
        <div class="break-icon">${icon}</div>
        <div class="break-info">
          <div class="break-title">${item.data.label}</div>
          <div class="break-time">${item.data.jam}</div>
        </div>
      `;
      container.appendChild(bc);
    } else {
      jamCounter++;
      const p = item.data;
      const color = getColor(p.mapel);
      const emoji = getEmoji(p.mapel);
      const active = isActive(p.jam);
      const past = isPast(p.jam);

      const card = document.createElement("div");
      card.className = `p-card${active ? " is-active" : ""}${past ? " is-past" : ""}`;
      card.style.setProperty("--pcolor", color);
      card.style.animationDelay = `${i * 0.04}s`;

      // Tunjukkan "jam ke-N" hanya untuk yang non-lanjutan
      const isLanjut = p.durasi && p.durasi.includes("lanjut");
      const jamLabel = isLanjut ? `↳ Lanjutan` : `JAM KE ${jamCounter}`;

      card.innerHTML = `
        ${active ? `<div class="active-badge">SEDANG BERLANGSUNG</div>` : ""}
        <div class="p-top">
          <div>
            <div class="p-num">${jamLabel}</div>
            <div class="p-name">${p.mapel}</div>
          </div>
          <div class="p-emoji">${emoji}</div>
        </div>
        <div class="p-bottom">
          <div class="p-guru">${p.guru}</div>
          <div class="p-time">${p.jam.split(" - ")[0].trim()} – ${p.jam.split(" - ")[1]?.trim() || ""}</div>
        </div>
        <div class="p-dur">⏱ ${p.durasi}</div>
      `;

      container.appendChild(card);
    }
  });
}

// ================================================================
// NOTIFICATIONS
// ================================================================

function requestNotifPermission() {
  if (!("Notification" in window)) return;
  Notification.requestPermission().then(p => {
    browserNotifAllowed = p === "granted";
    if (browserNotifAllowed) {
      showToast("Notifikasi aktif!", "Kamu bakal dikabarin setiap ganti pelajaran.", "🔔", "var(--acc)", 4000);
    }
  });
}

function checkNotifs() {
  const todayName = DAYS_ID[new Date().getDay()];
  if (!JADWAL[todayName]) return;

  const data = JADWAL[todayName];
  const cur = nowMins();
  const now = new Date();

  data.pelajaran.forEach((p, i) => {
    const startStr = p.jam.split(" - ")[0].trim();
    const startM = toMins(startStr);
    const isLanjut = p.durasi && p.durasi.includes("lanjut");
    if (isLanjut) return; // skip lanjutan, sudah dinotif di slot aslinya

    const color = getColor(p.mapel);
    const emoji = getEmoji(p.mapel);

    // 5 menit sebelum
    const key5 = `${todayName}-${i}-5`;
    if (!shownNotifs.has(key5) && cur >= startM - 5 && cur < startM) {
      shownNotifs.add(key5);
      showToast(
        `${emoji} ${p.mapel} dalam 5 menit`,
        `Mulai jam ${startStr} · ${p.guru}`,
        emoji, color, 7000
      );
      sendBrowserNotif(`${p.mapel} dalam 5 menit!`, `Jam ${startStr} — ${p.guru}`);
      addBadge();
    }

    // Tepat mulai
    const keyStart = `${todayName}-${i}-start`;
    if (!shownNotifs.has(keyStart) && cur >= startM && cur < startM + 1) {
      shownNotifs.add(keyStart);
      showToast(
        `${emoji} ${p.mapel} dimulai sekarang!`,
        `${p.jam} · ${p.guru}`,
        emoji, color, 8000
      );
      sendBrowserNotif(`${p.mapel} dimulai!`, `${p.jam} | ${p.guru}`);
      addBadge();
    }
  });

  // Notif istirahat
  data.breaks.forEach((b, i) => {
    const startStr = b.jam.split(" - ")[0].trim();
    const startM = toMins(startStr);
    const bKey = `${todayName}-break-${i}`;
    if (!shownNotifs.has(bKey) && cur >= startM && cur < startM + 1) {
      shownNotifs.add(bKey);
      const icon = b.label.includes("Sholat") ? "🕌" : "☕";
      showToast(`${icon} ${b.label}`, `${b.jam}`, icon, "var(--acc3)", 5000);
      sendBrowserNotif(`${b.label}`, b.jam);
      addBadge();
    }
  });
}

function addBadge() {
  notifCount++;
  const badge = document.getElementById("notif-badge");
  badge.textContent = notifCount > 9 ? "9+" : notifCount;
  badge.style.display = "flex";
  document.getElementById("notif-bell").classList.add("has-notif");
}

function sendBrowserNotif(title, body) {
  if (!browserNotifAllowed) return;
  try {
    new Notification(title, {
      body,
      icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>",
      badge: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>",
    });
  } catch (e) {}
}

// Bell klik = reset badge
document.getElementById("notif-bell").addEventListener("click", () => {
  notifCount = 0;
  const badge = document.getElementById("notif-badge");
  badge.style.display = "none";
  document.getElementById("notif-bell").classList.remove("has-notif");
  showToast("Semua notifikasi dibaca", "Kamu udah up to date 👍", "✅", "var(--acc3)", 3000);
});

// ================================================================
// TOAST
// ================================================================

function showToast(title, sub, icon, color, duration = 5000) {
  const container = document.getElementById("notif-container");
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.style.setProperty("--tcolor", color);
  toast.style.setProperty("--dur", duration + "ms");

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-body">
      <div class="toast-tag">Jadwal Pelajaran</div>
      <div class="toast-title">${title}</div>
      <div class="toast-sub">${sub}</div>
    </div>
    <button class="toast-close" onclick="closeToast(this)">✕</button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  // Maksimal 3 toast sekaligus
  const toasts = container.querySelectorAll(".toast");
  if (toasts.length > 3) toasts[0].remove();

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("hiding");
      setTimeout(() => toast.remove(), 280);
    }
  }, duration);
}

function closeToast(btn) {
  const t = btn.closest(".toast");
  t.classList.add("hiding");
  setTimeout(() => t.remove(), 280);
}
