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
  const id = formData.get('id')
  if (!id) return { error: 'Missing ID' }
  
  try {
    const existing = await prisma.broadcast.findUnique({
      where: { id: id.toString() }
    })
    
    if (!existing) {
      console.warn(`Record ${id} not found`)
      return { error: 'Record not found' }
    }
    
    await prisma.broadcast.delete({ where: { id: id.toString() } })
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Delete failed:', error)
    return { error: 'Deletion failed' }
  }
}