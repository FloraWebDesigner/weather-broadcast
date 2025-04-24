"use client";

import { useFormStore } from "@/hooks/useFormStore";
import RadioList from "@/components/playground/RadioList";
import Weather from "@/components/api-weather";
import Step from "@/components/step";
import {Province } from ".prisma/client";

interface ClientWrapperProps {
    radios: any[];
    provinceOptions: Province[]; 
  }
  export function ClientWrapper({
    radios,
    provinceOptions,
  }: ClientWrapperProps) {
    const { formData } = useFormStore();
    console.log(formData.host);
    console.log(formData.voice);

  return (
    <>
      <Step title="Select Your Radio Content" value={77} label="3/4" />
      <RadioList
        radios={radios}
        provinceOptions={provinceOptions}
      />
      <Weather broadcasts={radios} />
    </>
  );
}
