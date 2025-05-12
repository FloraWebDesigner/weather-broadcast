"use client";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function VoiceSSRTableRow({ 
  voice, 
  onSelect 
}: { 
  voice: string;
  onSelect: (voice: string) => void;
}) {
  return (
    <TableRow>
      <TableCell className="w-1/4 text-center font-medium capitalize">{voice}</TableCell>
      <TableCell className="w-1/2 text-center">
        <audio controls>
          <source src={`https://cdn.openai.com/API/docs/audio/${voice}.wav`} />
        </audio>
      </TableCell>
      <TableCell className="w-1/4 text-center">
        <Button
          onClick={() => onSelect(voice)}
          className="bg-green-500 hover:bg-green-400"
        >
          Pick
        </Button>
      </TableCell>
    </TableRow>
  );
}
