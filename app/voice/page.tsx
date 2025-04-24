"use client"
import Step from "@/components/step"
import { VoiceTable } from "@/components/voice/voice-table";
import { useFormStore } from '@/hooks/useFormStore';
import { useRouter } from "next/navigation";

export default function Voice() {
  const router = useRouter();
  const { updateFormData } = useFormStore();

  const handleVoiceSelect = (voice: string) => {
    updateFormData({ voice });
    router.push("/playground"); 
  };
    return(
      <>
      <Step title="Select a Voice" value={34} label="2/4" />
      <VoiceTable onVoiceSelect={handleVoiceSelect} />
</>
    )
}