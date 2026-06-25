import { TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ label, ...props }: Props) {
  return (
    <label className="field field-full">
      <span>{label}</span>
      <textarea {...props} />
    </label>
  );
}
