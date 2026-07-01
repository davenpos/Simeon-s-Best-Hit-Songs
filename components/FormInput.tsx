import { HTMLInputTypeAttribute } from 'react';

export default function FormInput({
  name,
  label,
  type,
}: {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute;
}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input type={type} name={name} className="bg-white text-black px-1" />
    </>
  );
}
