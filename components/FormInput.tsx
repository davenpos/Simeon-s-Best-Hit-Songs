import { HTMLInputTypeAttribute } from 'react';

export default function FormInput({
  name,
  label,
  type,
  min,
  max,
  defaultValue,
}: {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute;
  min?: number;
  max?: number;
  defaultValue?: string | number;
}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        id={name}
        {...(type !== 'file' ? { defaultValue } : {})}
        className="bg-white text-black px-1"
        min={min}
        max={max}
      />
    </>
  );
}
