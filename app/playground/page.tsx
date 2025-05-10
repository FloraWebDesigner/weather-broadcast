import { PrismaClient } from "@prisma/client";
import { Province } from ".prisma/client";
import { ClientWrapper } from "@/components/playground/playground-client-wrapper";

const prisma = new PrismaClient();

export default async function Playground() {
  const radios = await prisma.broadcast.findMany();
  const provinceOptions = Object.values(Province);

  return <ClientWrapper radios={radios} provinceOptions={provinceOptions} />;
}
