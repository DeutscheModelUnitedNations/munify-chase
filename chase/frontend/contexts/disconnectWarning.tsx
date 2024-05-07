import { faWifiSlash } from "@fortawesome/pro-duotone-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createContext, useContext, useState } from "react";

export function DisconnectWarningIcon() {
  return (
    <div className="absolute bottom-0 right-0 p-8 m-2 flex items-center justify-center bg-red-500 rounded-lg shadow-xl text-white text-4xl font-bold z-50">
      <FontAwesomeIcon icon={faWifiSlash} beatFade />
    </div>
  );
}

interface DisconnectWarningContextType {
  disconnectWarning: boolean;
  setDisconnectWarning: (disconnectWarning: boolean) => void;
}

export const DisconnectWarning =
  createContext<DisconnectWarningContextType | null>(null);

export const useDisconnectWarning = () => useContext(DisconnectWarning);

export const DisconnectWarningProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [disconnectWarning, setDisconnectWarning] = useState(false);

  return (
    <DisconnectWarning.Provider
      value={{ disconnectWarning, setDisconnectWarning }}
    >
      {disconnectWarning ? <DisconnectWarningIcon /> : null}
      {children}
    </DisconnectWarning.Provider>
  );
};
