import React, { useState } from "react"
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

export default function UsernameLogin({ changeLoginState }) {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  function load() {
    setLoading(true);

    // navigate to the participant login page
    setTimeout(() => {
      setLoading(false);
      changeLoginState(1);
    }, 1000);
  }

  return (
    <div className="flex flex-col">
      <span className="p-float-label mb-5">
        <InputText
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="username">Username</label>
      </span>
      <Button
        label="Weiter"
        icon="pi pi-arrow-right"
        iconPos="right"
        loading={loading}
        onClick={load}
        disabled={username === ""}
      />
    </div>
  );
}