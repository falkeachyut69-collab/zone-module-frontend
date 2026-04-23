import { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://zone-module-1.onrender.com";

function App() {
  // ================= STATE =================
  const [groups, setGroups] = useState([]);
  const [chains, setChains] = useState([]);
  const [brands, setBrands] = useState([]);
  const [zones, setZones] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedChain, setSelectedChain] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  const [zoneName, setZoneName] = useState("");
  const [zoneBrandId, setZoneBrandId] = useState("");

  const [view, setView] = useState("dashboard");

  // ================= LOAD =================
  const loadGroups = async () => {
    const res = await fetch(`${BASE_URL}/groups`);
    const data = await res.json();
    setGroups(Array.isArray(data) ? data : []);
  };

  const loadChains = async (groupId) => {
    if (!groupId) return setChains([]);
    const res = await fetch(`${BASE_URL}/chains/group/${groupId}`);
    const data = await res.json();
    setChains(Array.isArray(data) ? data : []);
  };

  const loadBrands = async (chainId) => {
    if (!chainId) return setBrands([]);
    const res = await fetch(`${BASE_URL}/brands/chain/${chainId}`);
    const data = await res.json();
    setBrands(Array.isArray(data) ? data : []);
  };

  const loadZones = async (brandId) => {
    let url = `${BASE_URL}/zones`;
    if (brandId) url = `${BASE_URL}/zones/brand/${brandId}`;

    const res = await fetch(url);
    const data = await res.json();
    setZones(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadGroups();
    loadZones();
  }, []);

  // ================= FILTER FLOW =================
  const handleGroupChange = (id) => {
    setSelectedGroup(id);
    setSelectedChain("");
    setSelectedBrand("");
    setBrands([]);
    loadChains(id);
    loadZones();
  };

  const handleChainChange = (id) => {
    setSelectedChain(id);
    setSelectedBrand("");
    loadBrands(id);
    loadZones();
  };

  const handleBrandChange = (id) => {
    setSelectedBrand(id);
    loadZones(id);
  };

  // ================= ADD ZONE (🔥 FIXED) =================
  const addZone = async () => {
    if (!zoneName || !zoneBrandId) {
      alert("All fields required");
      return;
    }

    console.log("Sending:", {
      zoneName,
      brandId: Number(zoneBrandId)
    });

    try {
      const res = await fetch(`${BASE_URL}/zones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          zoneName: zoneName,
          brandId: Number(zoneBrandId)   // ✅ FIXED HERE
        })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Backend Error:", text);
        throw new Error("Failed to add zone");
      }

      alert("Zone added successfully");

      setZoneName("");
      setZoneBrandId("");

      loadZones(selectedBrand);
      setView("dashboard");

    } catch (err) {
      console.error(err);
      alert("Error adding zone");
    }
  };

  const deleteZone = async (id) => {
    await fetch(`${BASE_URL}/zones/${id}`, {
      method: "DELETE"
    });
    loadZones(selectedBrand);
  };

  // ================= UI =================
  return (
    <div className="container">

      <h1>Zone Management Dashboard</h1>

      <div className="nav-buttons">
        <button onClick={() => setView("zoneForm")}>Add Zone</button>
        <button onClick={() => setView("dashboard")}>Dashboard</button>
      </div>

      {/* ================= ZONE FORM ================= */}
      {view === "zoneForm" && (
        <div className="card">
          <h2>Add Zone</h2>

          <select
            value={selectedGroup}
            onChange={(e) => handleGroupChange(e.target.value)}
          >
            <option value="">Select Group</option>
            {groups.map(g => (
              <option key={g.groupId} value={g.groupId}>
                {g.groupName}
              </option>
            ))}
          </select>

          <select
            value={selectedChain}
            onChange={(e) => handleChainChange(e.target.value)}
          >
            <option value="">Select Company</option>
            {chains.map(c => (
              <option key={c.chainId} value={c.chainId}>
                {c.companyName}
              </option>
            ))}
          </select>

          <select
            value={zoneBrandId}
            onChange={(e) => setZoneBrandId(e.target.value)}
          >
            <option value="">Select Brand</option>
            {brands.map(b => (
              <option key={b.brandId} value={b.brandId}>
                {b.brandName}
              </option>
            ))}
          </select>

          <input
            placeholder="Zone Name"
            value={zoneName}
            onChange={(e) => setZoneName(e.target.value)}
          />

          <button onClick={addZone}>Add</button>
        </div>
      )}

      {/* ================= FILTERS ================= */}
      <div className="card">
        <h2>Filters</h2>

        <select
          value={selectedGroup}
          onChange={(e) => handleGroupChange(e.target.value)}
        >
          <option value="">All Groups</option>
          {groups.map(g => (
            <option key={g.groupId} value={g.groupId}>
              {g.groupName}
            </option>
          ))}
        </select>

        <select
          value={selectedChain}
          onChange={(e) => handleChainChange(e.target.value)}
        >
          <option value="">All Companies</option>
          {chains.map(c => (
            <option key={c.chainId} value={c.chainId}>
              {c.companyName}
            </option>
          ))}
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => handleBrandChange(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map(b => (
            <option key={b.brandId} value={b.brandId}>
              {b.brandName}
            </option>
          ))}
        </select>
      </div>

      {/* ================= ZONE TABLE ================= */}
      <div className="card">
        <h2>Zones</h2>

        <table className="table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Brand</th>
              <th>Company</th>
              <th>Group</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {zones.map(z => (
              <tr key={z.zoneId}>
                <td>{z.zoneName}</td>
                <td>{z.brand?.brandName}</td>
                <td>{z.brand?.chain?.companyName}</td>
                <td>{z.brand?.chain?.group?.groupName}</td>
                <td>
                  <button onClick={() => deleteZone(z.zoneId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default App;