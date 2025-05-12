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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("multiStepFormData");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse form data", e);
      }
    }
  }, []);

  const updateFormData = (newData: Partial<FormData>) => {
    const updated = { ...formData, ...newData };
    setFormData(updated);
    if (isMounted) {
      localStorage.setItem("multiStepFormData", JSON.stringify(updated));
    }
  };

  const clearFormData = () => {
    setFormData({});
    if (isMounted) {
      localStorage.removeItem("multiStepFormData");
    }
  };

  return { formData, updateFormData, clearFormData, isMounted }; // 确保返回 isMounted
}