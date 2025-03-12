'use server'
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"; 

const prisma = new PrismaClient();

export default async function addHost(formData) {
    const host = formData.get('host');

    const newHost = await prisma.broadcast.create({
        data: {
            host: host,
        },
      });

      Console.log(newHost.id);
      redirect(`${newHost.id}/voice`);
      
    }