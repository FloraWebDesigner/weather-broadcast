'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"

interface FormState {
  error?: string
  success?: boolean
  audioUrl?: string
}

const prisma = new PrismaClient()

export default async function deleteRadio(
  prevState: FormState,  
  formData: FormData     
): Promise<FormState> {
  try {
    const id = formData.get('id')?.toString()
    
    if (!id) {
      return { error: 'ID is required' }
    }

    const parsedId = parseInt(id)
    if (isNaN(parsedId)) {
      return { error: 'Invalid ID format' }
    }

    await prisma.broadcast.delete({
      where: { id: parsedId }
    })

    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { 
      error: error instanceof Error 
        ? error.message 
        : 'Failed to delete broadcast' 
    }
  }
}