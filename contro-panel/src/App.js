import React, { useState, useEffect } from "react";
import axios from "axios";

function ControlPanel() {
  const [widgetId, setWidgetId] = useState("");
  const [apiInfo, setApiInfo] = useState("");
  const [fieldMapping, setFieldMapping] = useState({});
  const [uiConfig, setUiConfig] = useState({});
  const [widgets, setWidgets] = useState([]);

  useEffect(() => {
    fetchWidgets();
  }, []);

  const fetchWidgets = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/widgets");
      setWidgets(response.data);
    } catch (err) {
      console.error("Error fetching widgets:", err);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/widget", {
        id: widgetId,
        apiInfo,
        fieldMapping,
        uiConfig,
      });
      alert(response.data.message);
      fetchWidgets();
    } catch (err) {
      console.error("Error saving widget:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Widget Control Panel</h1>
      <input
        type="text"
        placeholder="Widget ID"
        value={widgetId}
        onChange={(e) => setWidgetId(e.target.value)}
      />
      <input
        type="text"
        placeholder="API Info"
        value={apiInfo}
        onChange={(e) => setApiInfo(e.target.value)}
      />
      <textarea
        placeholder="Field Mapping (JSON)"
        value={JSON.stringify(fieldMapping, null, 2)}
        onChange={(e) => setFieldMapping(JSON.parse(e.target.value))}
      ></textarea>
      <textarea
        placeholder="UI Config (JSON)"
        value={JSON.stringify(uiConfig, null, 2)}
        onChange={(e) => setUiConfig(JSON.parse(e.target.value))}
      ></textarea>
      <button onClick={handleSave}>Save Widget</button>

      <h2>Saved Widgets</h2>
      <ul>
        {widgets.map((widget) => (
          <li key={widget.id}>{widget.id}</li>
        ))}
      </ul>
    </div>
  );
}

export default ControlPanel;
