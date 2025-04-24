import { Progress } from "@/components/ui/progress";
import React from "react";

type StepProps = {
  title?: string;
  value: number;
  label?: string;
};

export default function Step({ title, value, label }: StepProps) {
  return (
    <section>
      <h1 className="text-3xl text-foreground font-bold text-center">
        {title}
      </h1>
      <div className="mt-8 mb-14 w-1/2 mx-auto">
        <Progress value={value} label={label} />
      </div>
    </section>
  );
}
