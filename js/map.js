function getRoleFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("role"); // seeker или hider
}

async function initMap() {
  const role = getRoleFromURL();

  if (!role || (role !== "seeker" && role !== "hider")) {
    alert("Укажите роль в URL, например ?role=seeker");
    return;
  }

  // Принудительная загрузка свежего файла
  const dataUrl = `data/${role}.json?ts=${Date.now()}`;

  let players = [];
  try {
    const response = await fetch(dataUrl);
    if (response.ok) {
      players = await response.json();
    }
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }

  // Координаты по умолчанию (Москва)
  const defaultLat = 55.75;
  const defaultLon = 37.61;

  const map = L.map("map").setView(
    players.length ? players[0].location : [defaultLat, defaultLon],
    13
  );

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // Добавляем маркеры, если есть данные
  players.forEach((player) => {
    if (player.location && player.location.length === 2) {
      const [lat, lon] = player.location;
      const marker = L.marker([lat, lon]).addTo(map);
      marker.bindPopup(`${player.name} (${player.role})`);
    }
  });
}

initMap();
