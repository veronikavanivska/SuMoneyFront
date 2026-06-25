import { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: { label: string; value: string }[];
  emptyLabel?: string;
};

export function Select({ label, options, emptyLabel, ...props }: Props) {
  return (
    <label className="field">
      <span>{label}</span>
      <select {...props}>
        {emptyLabel && <option value="">{emptyLabel}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
