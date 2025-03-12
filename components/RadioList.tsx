'use client';

import { useState } from "react";
import { format } from "date-fns/format";
import { DatePickerDemo } from "@/components/ui/datePicker";
import addRadio from "@app/actions/addRadio"; // Use @app/
import deleteRadio from "@app/actions/deleteRadio"; // Use @app/
import { broadcast, Voice, Province } from ".prisma/client";


interface RadioListProps {
  radios: broadcast[];
  voiceOptions: Voice[];
  provinceOptions: Province[];
}

function formatProvince(province: Province): string {
  return province.replace(/_/g, " ");
}

export default function RadioList({ radios, voiceOptions, provinceOptions }: RadioListProps) {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  return (
    <>
      <form action={addRadio} className="flex gap-2 w-full">
        <input type="text" name="host" placeholder="Enter your name" className="rounded shadow appearance-none border border-slate-500 py-2 px-3 w-3/12" required/>
        
        <select name="voice" className="rounded shadow border py-2 px-3 w-2/12">
          {voiceOptions.map((voice) => (
            <option key={voice} value={voice}>
              {voice}
            </option>
          ))}
        </select>

        <select name="province" className="rounded shadow border py-2 px-3 w-3/12">
          {provinceOptions.map((province) => (
            <option key={province} value={formatProvince(province)}>
              {formatProvince(province)}
            </option>
          ))}
        </select>

        <DatePickerDemo onDateChange={setSelectedDate} />
        <input 
          type="date" 
          name="date" 
          className="rounded shadow border py-2 px-3 w-2/12 hidden"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)} 
          required
        />
        <button type="submit" className="bg-green-500 py-2 px-4 rounded font-bold hover:border-green-700 w-2/12">Add Radio</button>
      </form>
      <ul className="mt-4 ">
        {radios.map((radio) => (
          <li key={radio.id} className="flex justify-between items-center border border-gray-300 text-white py-2 px-3 rounded mb-2">
            <div>
            <span className="mr-2">{format(new Date(radio.date), "MMM-dd")}</span>
              {/* <span className="mr-2">{radio.host}</span>
              <span className="mr-2">{radio.voice}</span> */}
              <span>{formatProvince(radio.province)}</span>
            </div>
            <div>
              <form action={deleteRadio}>
                <input type="hidden" name="id" value={radio.id}/>
                <button type="submit" className="bg-red-500 py-2 px-4 rounded font-bold hover:bg-red-700">Delete</button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}