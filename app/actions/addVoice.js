'use server'
import { PrismaClient } from "@prisma/client"
import { redirect } from "next/navigation"; 

const prisma = new PrismaClient();

export default async function addVoice(hostId, voice) {
    
  await prisma.broadcast.update({
      where: { id: hostId },
      data: { voice },
    });

    console.log(`✅ Updated voice for host ${hostId}: ${voice}`);
      redirect("/playground");
      
    }

