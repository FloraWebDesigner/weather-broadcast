"use client"
import Step from "@/components/step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStore } from '@/hooks/useFormStore';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { formData, updateFormData } = useFormStore();
  const [host, setHost] = useState(formData.host || '');
  const handleSubmit = () => {
    updateFormData({ host });
    router.push("/voice"); 
  };
  return (
    <>
      <Step title="Input Your Name" value={2} label="1/4" />
      <div className="mt-8 w-1/3 mx-auto">
        <Input
          type="text"
          placeholder="Your Name"
          className="mt-10 w-full rounded shadow appearance-none border border-slate-500 py-2 px-3"
          onChange={(e) => setHost(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          className="mt-4 w-full bg-green-500 py-2 px-4 rounded font-bold hover:bg-green-400"
        >
          Next
        </Button>
      </div>
    </>
  );
}
