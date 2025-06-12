"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Clinic = {
  clinicId: string;
  name: string;
};

interface ClinicContextType {
  activeClinic: Clinic | null;
  setActiveClinic: (clinic: Clinic) => void;
}

const ClinicContext = createContext<ClinicContextType>({
  activeClinic: null,
  setActiveClinic: () => {},
});

export const ClinicProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeClinic, setActiveClinicState] = useState<Clinic | null>(null);

  useEffect(() => {
    const storedClinic = localStorage.getItem("activeClinic");
    if (storedClinic) {
      try {
        setActiveClinicState(JSON.parse(storedClinic));
      } catch {}
    }
  }, []);

  const setActiveClinic = (clinic: Clinic) => {
    localStorage.setItem("activeClinic", JSON.stringify(clinic));
    setActiveClinicState(clinic);
  };

  return (
    <ClinicContext.Provider value={{ activeClinic, setActiveClinic }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => useContext(ClinicContext);
