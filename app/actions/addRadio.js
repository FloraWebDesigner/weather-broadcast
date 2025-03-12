'use server'
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache";
import { DatePickerDemo } from "@/components/ui/datePicker";

const prisma = new PrismaClient();

export default async function addRadio(formData) {
    const host = formData.get('host');
    const voice = formData.get('voice');
    const province = formData.get('province');
    const date = formData.get('date');

    function formatProvince(province) {
      return province.replace(/ /g, "_");
    }

    await prisma.broadcast.create({
        data: {
            host: host,
            voice: voice,
            province: formatProvince(province),
            date: new Date(date).toISOString()
        },
      });
      revalidatePath('/');
    }