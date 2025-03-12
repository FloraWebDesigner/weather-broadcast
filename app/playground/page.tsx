import { PrismaClient } from "@prisma/client";
import { broadcast, Voice, Province } from ".prisma/client";
import RadioList from "@/components/RadioList";
import { Progress } from "@/components/ui/progress";
import Weather from "@/components/api-weather";

const prisma = new PrismaClient();

export default async function Playground() {
  const radios = await prisma.broadcast.findMany();
  const voiceOptions = Object.values(Voice);
  const provinceOptions = Object.values(Province);

  return (
        <div className="home">
        <h1 className="text-3xl text-white font-bold text-center">Step 3: Select Your Radio Content</h1>
        <div className="my-3 w-1/2 mx-auto">
        <Progress value={77} />
        </div>

      <RadioList radios={radios} voiceOptions={voiceOptions} provinceOptions={provinceOptions} />
      <Weather broadcasts={radios} />
      </div>
  );
}