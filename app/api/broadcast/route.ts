import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import type { Broadcast } from "@/components/radio/weather-radio-service";

const prisma = new PrismaClient();

export async function GET() {
  const broadcasts = await prisma.broadcast.findMany({
    orderBy: {
      id: 'asc'
    }
  });
  
  const formattedBroadcasts = broadcasts.map(broadcast => ({
    id: broadcast.id,
    host: broadcast.host,
    voice: broadcast.voice,
    province: broadcast.province,
    date: broadcast.date,
    created_at: broadcast.created_at
  }));

  return NextResponse.json(formattedBroadcasts);
}