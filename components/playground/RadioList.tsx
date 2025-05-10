"use client";

import { useState, useActionState, useEffect } from "react";
import { format } from "date-fns/format";
import { DatePickerDemo } from "@/components/ui/datePicker";
import addRadio from "@/app/actions/addRadio";
import deleteRadio from "@app/actions/deleteRadio";
import { broadcast, Province } from ".prisma/client";
import { useFormStore } from "@/hooks/useFormStore";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface RadioListProps {
  radios: broadcast[];
  provinceOptions: Province[];
}

interface FormState {
  error?: string;
  success?: boolean;
  audioUrl?: string;
}

function formatProvince(province: Province): string {
  return province.replace(/_/g, " ");
}

export default function RadioList({ radios, provinceOptions }: RadioListProps) {
  const [isClient, setIsClient] = useState(false);
  const [state, formAction] = useActionState<FormState, FormData>(addRadio, {});
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const { formData } = useFormStore();
  const { toast } = useToast();

  useEffect(() => {
    if (state?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.error,
      });
    }
    if (state?.success) {
      toast({
        title: "Success",
        description: "Broadcast added successfully!",
      });
    }
  }, [state, toast]);
  useEffect(() => {
    setIsClient(true);
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
  }, []);

  if (!isClient) {
    return null; // Or loading skeleton
  }

  if (!formData.host || !formData.voice) {
    return (
      <div className="mt-8 w-2/3 mx-auto text-center">
        <p>Please complete the previous steps first.</p>
      </div>
    );
  }

  const handleDelete = async (formData: FormData) => {
    try {
      const result = await deleteRadio({}, formData);
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
      } else {
        toast({
          title: "Success",
          description: "Broadcast deleted successfully",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    }
  };

  return (
    <section className="mt-8 w-3/4 mx-auto">
      <Toaster />
      <form action={formAction} className="flex gap-2 w-full">
        <input type="hidden" name="host" value={formData.host || ""} />
        <input type="hidden" name="voice" value={formData.voice || ""} />
        <select
          name="province"
          className="rounded shadow border py-2 px-3 border-slate-500 w-2/5"
          required
          defaultValue=""
        >
          <option value="" disabled>
            Select province
          </option>
          {provinceOptions.map((province) => (
            <option key={province} value={formatProvince(province)}>
              {formatProvince(province)}
            </option>
          ))}
        </select>
        <div className="w-2/5">
          <DatePickerDemo
            onDateChange={setSelectedDate}
            className="h-10 py-2 px-3 border border-slate-500 rounded shadow w-full"
          />
          <input
            type="date"
            name="date"
            className="rounded shadow border py-2 px-3 hidden border-slate-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-1/5 bg-green-500 py-2 px-4 rounded font-bold hover:border-green-700"
        >
          Add Radio
        </button>
      </form>

      <ul className="mt-4">
        {radios.map((radio) => (
          <li
            key={radio.id}
            className="flex justify-between items-center border border-slate-700 text-white py-2 px-3 rounded mb-2"
          >
            <div>
              <span className="mr-2">
                {format(new Date(radio.date), "MMM-dd")}
              </span>
              <span>{formatProvince(radio.province)}</span>
            </div>
            <div>
              <form action={handleDelete}>
                <input type="hidden" name="id" value={radio.id} />
                <button
                  type="submit"
                  className="bg-red-500 py-2 px-4 rounded font-bold hover:bg-red-700"
                >
                  Delete
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}