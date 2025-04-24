'use server'

import { PrismaClient, Province, Voice } from "@prisma/client"
import { revalidatePath } from "next/cache"

interface FormState {
  error?: string;
  success?: boolean;
}

const prisma = new PrismaClient()

export default async function addRadio(
  prevState: FormState, 
  formData: FormData
): Promise<FormState> {
  try {
    const host = formData.get('host')?.toString()
    const rawVoice = formData.get('voice')?.toString()
    const rawProvince = formData.get('province')?.toString()
    const date = formData.get('date')?.toString()

    if (!host || !rawVoice || !rawProvince || !date) {
      return { error: 'All fields are required' }
    }

    const province = rawProvince.replace(/ /g, "_") as Province
    if (!Object.values(Province).includes(province)) {
      return { error: 'Invalid province value' }
    }

    const voice = rawVoice as Voice
    if (!Object.values(Voice).includes(voice)) {
      return { error: 'Invalid voice value' }
    }

    await prisma.broadcast.create({
      data: {
        host,
        voice,
        province,
        date: new Date(date).toISOString()
      }
    })
    
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Database error:', error)
    return { 
      error: error instanceof Error 
        ? error.message 
        : 'Failed to create broadcast' 
    }
  }
}