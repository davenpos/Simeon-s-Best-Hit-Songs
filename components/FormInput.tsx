import { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';

export default function FormInput({
  name,
  label,
  type,
  onChange,
}: {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute;
  onChange?: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        name={name}
        className={`bg-white text-black px-1${type === 'checkbox' ? ' mr-[92%]' : ''}`}
        onChange={onChange || undefined}
      />
    </>
  );
}
