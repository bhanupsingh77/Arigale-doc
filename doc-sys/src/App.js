import React, { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

function App() {
  const [client, setClient] = useState(null);
  return client ? (
    <Dashboard client={client} />
  ) : (
    <div>
      <Auth setClient={setClient} />
    </div>
  );
}

export default App;
