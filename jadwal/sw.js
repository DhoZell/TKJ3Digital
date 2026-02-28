// ================================================================
// SERVICE WORKER - Jadwal Kelas XI TKJ
// Ini yang bikin notifikasi bisa jalan walau browser ditutup
// ================================================================

const CACHE_NAME = 'jadwal-v1';
const ASSETS = [
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
];

// ── Install: cache semua file ──
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// ── Activate: hapus cache lama ──
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// ── Fetch: serve dari cache kalau offline ──
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// ── Terima pesan dari app untuk schedule alarm ──
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFS') {
    scheduleNotifications(e.data.schedule);
  }
  if (e.data && e.data.type === 'CANCEL_NOTIFS') {
    cancelAllNotifs();
  }
});

// ── Push notification (dari background) ──
self.addEventListener('push', e => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || './icon-192.png',
      badge: './icon-192.png',
      tag: data.tag || 'jadwal',
      renotify: true,
      vibrate: [200, 100, 200],
      data: { url: './' }
    })
  );
});

// ── Klik notifikasi → buka app ──
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(list => {
      if (list.length > 0) {
        return list[0].focus();
      }
      return clients.openWindow('./');
    })
  );
});

// ================================================================
// SCHEDULED NOTIFICATIONS via setInterval di SW
// Ini jalan terus di background
// ================================================================

let notifTimers = [];
let scheduledToday = null;

function cancelAllNotifs() {
  notifTimers.forEach(t => clearTimeout(t));
  notifTimers = [];
}

function scheduleNotifications(schedule) {
  cancelAllNotifs();
  const now = new Date();
  const today = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'][now.getDay()];

  if (!schedule[today]) return;

  const data = schedule[today];
  const curMins = now.getHours() * 60 + now.getMinutes();
  const curSecs = now.getSeconds();

  const EMOJI = {
    "AIJ":"🤖","TLJ":"🌐","PKK":"💼","PAI":"📿","PJOK":"⚽",
    "ASJ/Siskom":"💻","B.Indo":"📚","B.Inggris":"🌍","MTK":"📐",
    "PKN":"🏛️","B.Jepang":"🗾","Sejarah":"🏺",
    "Pemrograman Dasar":"⌨️","B.Arab":"📜","default":"📖"
  };

  function toMins(str) {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + m;
  }

  function msUntil(mins) {
    const diffMins = mins - curMins;
    const diffMs = diffMins * 60 * 1000 - curSecs * 1000;
    return diffMs;
  }

  // Schedule notif untuk tiap pelajaran
  data.pelajaran.forEach((p, i) => {
    const isLanjut = p.durasi && p.durasi.includes('lanjut');
    if (isLanjut) return;

    const startStr = p.jam.split(' - ')[0].trim();
    const startM = toMins(startStr);
    const emoji = EMOJI[p.mapel] || EMOJI.default;

    // 5 menit sebelum
    const ms5 = msUntil(startM - 5);
    if (ms5 > 0) {
      const t = setTimeout(() => {
        self.registration.showNotification(`${emoji} ${p.mapel} dalam 5 menit!`, {
          body: `Jam ${startStr} · ${p.guru}`,
          icon: './icon-192.png',
          badge: './icon-192.png',
          tag: `pelajaran-${i}-5min`,
          renotify: true,
          vibrate: [150, 100, 150],
          data: { url: './' }
        });
      }, ms5);
      notifTimers.push(t);
    }

    // Tepat mulai
    const msStart = msUntil(startM);
    if (msStart > 0) {
      const t = setTimeout(() => {
        self.registration.showNotification(`${emoji} ${p.mapel} dimulai sekarang!`, {
          body: `${p.jam} · ${p.guru}`,
          icon: './icon-192.png',
          badge: './icon-192.png',
          tag: `pelajaran-${i}-start`,
          renotify: true,
          vibrate: [200, 100, 200, 100, 200],
          data: { url: './' }
        });
      }, msStart);
      notifTimers.push(t);
    }
  });

  // Schedule notif istirahat
  data.breaks.forEach((b, i) => {
    const startStr = b.jam.split(' - ')[0].trim();
    const startM = toMins(startStr);
    const ms = msUntil(startM);
    const icon = b.label.includes('Sholat') ? '🕌' : '☕';

    if (ms > 0) {
      const t = setTimeout(() => {
        self.registration.showNotification(`${icon} ${b.label}`, {
          body: b.jam,
          icon: './icon-192.png',
          badge: './icon-192.png',
          tag: `break-${i}`,
          renotify: true,
          vibrate: [100, 50, 100],
          data: { url: './' }
        });
      }, ms);
      notifTimers.push(t);
    }
  });
}

// Refresh schedule tiap tengah malam otomatis
function scheduleMidnightRefresh() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  const msToMidnight = midnight - now;

  setTimeout(() => {
    // Minta app kirim schedule baru
    self.clients.matchAll().then(clients => {
      clients.forEach(c => c.postMessage({ type: 'REQUEST_SCHEDULE' }));
    });
    scheduleMidnightRefresh();
  }, msToMidnight);
}

scheduleMidnightRefresh();
