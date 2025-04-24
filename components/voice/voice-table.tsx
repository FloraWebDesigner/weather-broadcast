import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VoiceTableRow } from "@/components/voice/voice-table-row";

export const voices = [
  "alloy",
  "ash",
  "coral",
  "nova",
  "shimmer",
  "echo",
  "onyx",
  "fable",
];

export function VoiceTable({
  onVoiceSelect,
}: {
  onVoiceSelect: (voice: string) => void;
}) {
  return (
    <div className="relative mt-8 w-2/3 mx-auto rounded-lg overflow-hidden">
      <div className="sticky top-0 z-10 bg-background">
        <Table>
          <TableHeader>
            <TableRow className="text-lg">
              <TableHead className="w-1/4 text-center">Voice</TableHead>
              <TableHead className="w-1/2 text-center">Audio</TableHead>
              <TableHead className="w-1/4 text-center pr-8">
                Operation
              </TableHead>
            </TableRow>
          </TableHeader>
        </Table>
      </div>

      <div className="h-[60vh] overflow-y-auto">
        <Table>
          <TableBody>
            {voices.map((voice) => (
              <VoiceTableRow
                key={voice}
                voice={voice}
                onSelect={onVoiceSelect}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
