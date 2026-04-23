// ✅ Use deployed backend (NOT localhost)
const API_BASE = "https://zone-module-1.onrender.com";

// ================= COMMON FETCH HANDLER =================
const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error: ${res.status} - ${text}`);
  }
  return res.json();
};

// ================= GROUPS =================
export const getGroups = async () => {
  const res = await fetch(`${API_BASE}/groups`);
  return handleResponse(res);
};

// ================= CHAINS =================
export const getChainsByGroup = async (groupId) => {
  const res = await fetch(`${API_BASE}/chains/group/${groupId}`);
  return handleResponse(res);
};

// ================= BRANDS =================
export const getBrands = async () => {
  const res = await fetch(`${API_BASE}/brands`);
  return handleResponse(res);
};

export const getBrandsByChain = async (chainId) => {
  const res = await fetch(`${API_BASE}/brands/chain/${chainId}`);
  return handleResponse(res);
};

export const createBrand = async (data) => {
  const res = await fetch(`${API_BASE}/brands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

// ================= ZONES =================
export const getZones = async () => {
  const res = await fetch(`${API_BASE}/zones`);
  return handleResponse(res);
};

export const getZonesByBrand = async (brandId) => {
  const res = await fetch(`${API_BASE}/zones/brand/${brandId}`);
  return handleResponse(res);
};

export const createZone = async (data) => {
  const res = await fetch(`${API_BASE}/zones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return handleResponse(res);
};

export const deleteZone = async (zoneId) => {
  const res = await fetch(`${API_BASE}/zones/${zoneId}`, {
    method: "DELETE",
  });
  return res.ok;
};``