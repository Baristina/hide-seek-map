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
  const role = getRoleFromURL();
  if (!role) {
    alert("Роль не указана. Используйте ?role=seeker или ?role=hider");
    return;
  }

  const data = await loadMapData(role);

  const map = L.map("map").setView([55.75, 37.6], 11); // Москва

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OSM contributors'
  }).addTo(map);

  data.forEach(({ lat, lon, name, role }) => {
    const marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup(`${name} (${role})`);
  });
}

initMap();
