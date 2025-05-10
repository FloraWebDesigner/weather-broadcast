"use client";
import { useState, useEffect } from "react";

export type FormData = {
  host?: string;
  voice?: string;
  province?: string;
  date?: string;
  audioUrl?: string;
};

export function useFormStore() {
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    const saved = localStorage.getItem("multiStepFormData");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const updateFormData = (newData: Partial<FormData>) => {
    const updated = { ...formData, ...newData };
    setFormData(updated);
    localStorage.setItem("multiStepFormData", JSON.stringify(updated));
  };

  const clearFormData = () => {
    setFormData({});
    localStorage.removeItem("multiStepFormData");
  };

  return { formData, updateFormData, clearFormData };
}