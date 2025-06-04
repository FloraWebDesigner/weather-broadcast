"use client";
import { create } from "zustand";
import { useState, useEffect } from "react";

export type FormData = {
  host?: string;
  voice?: string;
  province?: string;
  date?: string;
  audioUrl?: string;
  radios?: Array<{ id: string; date: string }>;
};

interface FormState {
  formData: FormData;
  isMounted: boolean;
  setIsMounted: (mounted: boolean) => void;
  updateFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
  clearFormData: () => void;
}

export const formStore = create<FormState>((set) => ({
  formData:
    typeof window !== "undefined" && localStorage.getItem("multiStepFormData")
      ? JSON.parse(localStorage.getItem("multiStepFormData")!)
      : {},
  isMounted: false,
  setIsMounted: (mounted) => set({ isMounted: mounted }),
  updateFormData: (newData) =>
    set((state) => {
      const updated = { ...state.formData, ...newData };
      localStorage.setItem("multiStepFormData", JSON.stringify(updated));
      return { formData: updated };
    }),
  resetFormData: () => {
    localStorage.removeItem("multiStepFormData");
    set({ formData: {} });
  },
  clearFormData: () => {
    localStorage.removeItem("multiStepFormData");
    set({ formData: {} });
  },
}));

export function useFormStore() {
  const {
    formData,
    updateFormData,
    resetFormData,
    clearFormData,
    isMounted,
    setIsMounted,
  } = formStore();

  return {
    formData,
    updateFormData,
    resetFormData,
    clearFormData,
    isMounted,
    setIsMounted,
  };
}
