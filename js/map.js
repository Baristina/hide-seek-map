function getRoleFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("role"); // seeker или hider
}

async function loadMapData(role) {
  const response = await fetch(`./data/${role}.json`);
  if (!response.ok) {
    alert("Не удалось загрузить карту для роли: " + role);
    return [];
  }
  return await response.json();
}

async function initMap() {
  const urlParams = new URLSearchParams(window.location.search);
  const role = urlParams.get("role");

  if (!role || (role !== "seeker" && role !== "hider")) {
    alert("Укажите роль в URL, например ?role=seeker");
    return;
  }

  const dataUrl = `data/${role}.json`;

  let response;
  try {
    response = await fetch(dataUrl);
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    return;
  }

  const players = await response.json();
  if (!players.length) {
    alert("Нет данных для отображения");
    return;
  }

  const [lat, lon] = players[0].location;
  const map = L.map("map").setView([lat, lon], 13);



  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  players.forEach((player) => {
  const [lat, lon] = player.location;
  const marker = L.marker([lat, lon]).addTo(map);
  marker.bindPopup(`${player.name} (${player.role})`);
});

}

initMap();
