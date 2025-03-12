'use server'
import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export default async function deleteRadio(formData) {
    const id = parseInt(formData.get('id'));
    await prisma.broadcast.delete({
        where: {
            id: id,
        },
      });
      revalidatePath('/');
    }