"use client"
import { useState, useEffect } from 'react';

export type FormData = {
  host?: string;
  voice?: string;
  province?: string;
  date?: string;
};

export function useFormStore() {
  const [formData, setFormData] = useState<FormData>({});

  useEffect(() => {
    const saved = localStorage.getItem('multiStepFormData');
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const updateFormData = (newData: Partial<FormData>) => {
    const updated = { ...formData, ...newData };
    setFormData(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('multiStepFormData', JSON.stringify(updated));
    }
  };

  const clearFormData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('multiStepFormData');
    }
    setFormData({});
  };

  return { formData, updateFormData, clearFormData };
}