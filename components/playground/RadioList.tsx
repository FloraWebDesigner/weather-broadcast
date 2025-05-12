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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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
    new Date().toISOString().split("T")[0]
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
      <div className="w-full flex gap-4 items-center">
        <form action={formAction} className="flex gap-4 w-full">
          <input type="hidden" name="host" value={formData.host || ""} />
          <input type="hidden" name="voice" value={formData.voice || ""} />

          <motion.div className="w-2/5">
            <select
              name="province"
              className="rounded-lg shadow-md border-0 py-2 px-3 bg-white dark:bg-gray-800 w-full focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all"
              required
              defaultValue=""
            >
              <option value="" disabled className="text-gray-400">
                Select province
              </option>
              {provinceOptions.map((province) => (
                <option
                  key={province}
                  value={formatProvince(province)}
                  className="py-2"
                >
                  {formatProvince(province)}
                </option>
              ))}
            </select>
          </motion.div>

          <motion.div className="w-2/5">
            <DatePickerDemo
              onDateChange={setSelectedDate}
              className="h-16 border-0 shadow-md rounded-lg py-2 px-4 w-full bg-white dark:bg-gray-800"
            />
            <input
              type="date"
              name="date"
              className="hidden"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-1/5"
          >
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-full h-10 text-white shadow-lg hover:shadow-xl transition-all"
            >
              Add Radio
            </Button>
          </motion.div>
        </form>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-1/6"
        >
          <Link href="/radio" className="block">
            <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 w-full h-10 text-white shadow-lg hover:shadow-xl transition-all">
              Generate
            </Button>
          </Link>
        </motion.div>
      </div>

      <ul className="mt-6 space-y-3">
        {radios.map((radio) => (
          <motion.li
            key={radio.id}
            className="flex justify-between items-center bg-white dark:bg-gray-800/70 rounded-xl shadow-md px-4 py-2"
          >
          <div className="flex items-center">
            <motion.div className="w-12 h-12 rounded-full overflow-hidden">
              <img
                src={`/${radio.voice.toLowerCase()}.jpg`}
                alt={radio.voice}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="ml-16 text-gray-800 dark:text-gray-200 font-medium">
              <span className="mr-16">
                {new Date(radio.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </span>
              <span>{formatProvince(radio.province)}</span>
            </div>
          </div>

            <form action={handleDelete}>
              <input type="hidden" name="id" value={radio.id} />
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="px-8 py-2 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Delete
                </Button>
              </motion.div>
            </form>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
