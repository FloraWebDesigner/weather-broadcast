'use server'

import { PrismaClient, Province, Voice } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { generateEnglishBroadcast } from "@/components/api-prompt"
import { fetchWeatherForecast } from "@/components/dashboard/weather-service"

interface FormState {
  error?: string;
  success?: boolean;
  audioUrl?: string;
}

const prisma = new PrismaClient()

export default async function addRadio(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  try {
    const host = formData.get('host')?.toString()
    const voice = formData.get('voice')?.toString()
    const rawProvince = formData.get('province')?.toString()
    const date = formData.get('date')?.toString()

    if (!host || !voice || !rawProvince || !date) {
      return { error: 'All fields are required' }
    }

    const province = rawProvince.replace(/ /g, "_") as Province
    if (!Object.values(Province).includes(province)) {
      return { error: 'Invalid province value' }
    }

    await prisma.broadcast.create({
      data: {
        host,
        voice,
        province,
        date: new Date(date).toISOString()
      }
    })
    
   

    revalidatePath('/');
    return { 
      success: true
    };
  } catch (error) {
    console.error('Error:', error);
    return { 
      error: error instanceof Error ? error.message : 'Failed to create broadcast' 
    };
  }
}