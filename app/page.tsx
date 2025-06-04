"use client";
import Step from "@/components/step";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormStore } from "@/hooks/useFormStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { formData, updateFormData, isMounted,setIsMounted, resetFormData } = useFormStore();
  const [host, setHost] = useState("");

useEffect(() => {
  const hasVisited = sessionStorage.getItem("hasVisitedForm");

  if (!hasVisited) {
    resetFormData(); 
    sessionStorage.setItem("hasVisitedForm", "true"); 
  }
  setIsMounted(true); 
}, []);


  useEffect(() => {
    if (isMounted) {
      setHost(formData.host || "");
    }
  }, [formData.host, isMounted]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFormData({ host });
    router.push("/voice");
  };

  if (!isMounted) {
    return (
      <div className="mt-8 w-1/3 mx-auto">
        <Input placeholder="Loading..." disabled />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Step title="Input Your Name" value={2} label="1/4" />
      <div className="mt-8 w-1/3 mx-auto">
        <Input
          type="text"
          placeholder="Your Name"
          value={host}
          className="mt-10 w-full rounded shadow appearance-none border border-slate-500 py-2 px-3"
          onChange={(e) => setHost(e.target.value)}
          required
        />
        <Button
          type="submit"
          className="mt-4 w-full bg-green-500 py-2 px-4 rounded font-bold hover:bg-green-400"
        >
          Next
        </Button>
      </div>
    </form>
  );
}
