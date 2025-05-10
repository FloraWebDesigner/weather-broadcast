import Step from "@/components/step";
import AutoBroadcastPlayer from "@/components/radio/AutoBroadcastPlayer";

export default function RadioPage() {
  return (
    <>
      <Step title="Welcome to Weather Broadcast" value={100} label="✓" />
      <AutoBroadcastPlayer/>
    </>
  );
}
