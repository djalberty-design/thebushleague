import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Slider({
  className,
  value,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  ...props
}: Omit<ComponentProps<"input">, "value" | "onChange"> & {
  value: number;
  onValueChange: (v: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className={cn(
        "h-8 w-full cursor-pointer appearance-none bg-transparent accent-accent",
        "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-bg-subtle",
        "[&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:-mt-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-paper",
        className,
      )}
      {...props}
    />
  );
}
