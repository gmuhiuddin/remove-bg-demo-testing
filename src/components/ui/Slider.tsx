import React from "react";

export const Slider: React.FC<{
  value: number[];
  onValueChange: (value: number[]) => void;
  min: number;
  max: number;
  step: number;
}> = ({ value, onValueChange, min, max, step }) => (
  <input
    type="range"
    value={value[0]}
    onChange={(e) => onValueChange([parseInt(e.target.value, 10)])}
    min={min}
    max={max}
    step={step}
    className="w-full"
  />
);