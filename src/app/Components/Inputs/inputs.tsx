"use client";

import {
  IconCalendar,
  IconChevronDown,
  IconSearch,
  ReactNode,
} from "@tabler/icons-react";
interface SelectInputProps {
  placeholder?: string;
  options: string[];
  IconChevronDown: React.ReactNode;
}
interface InputDateProps {
  placeholder?: string;
  icon?: ReactNode; // permite pasar un ícono opcional
}

export function SearchInput({ placeholder }: InputDateProps) {
  return (
    <>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-[#2B2B2B] w-full h-15 min-w-[300px] text-white pr-5 pl-3 py-3 rounded-lg focus:outline-none"
      />
      <IconSearch className="absolute  right-2 top-1/2 -translate-y-1/2 text-[#8C8C8C] w-6 h-6 " />
    </>
  );
}

export function SelectInput({ placeholder, options }: SelectInputProps) {
  return (
    <>
      <div className="relative text-white  w-full min-w-[250px]">
        <select
          defaultValue=""
          className="bg-[#2B2B2B] text-sm h-15 w-full pl-3 pr-10 py-2 rounded-lg focus:outline-none appearance-none"
        >
          <option value="" disabled>
            {placeholder || "Selecciona..."}
          </option>
          {options.map((opt, i) => (
            <option key={i} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <IconChevronDown className="absolute  right-2 top-1/2 -translate-y-1/2 text-white w-5 h-5 " />
      </div>
    </>
  );
}

export function InputDate({ placeholder }: { placeholder?: string }) {
  return (
    <div className="relative text-white flex w-full">
      <input
        type=""
        placeholder={placeholder}
        className="bg-[#2B2B2B] border border-[#444444] w-full h-15 text-sm  pl-3 pr-10 py-2 min-w-[300px] rounded-lg focus:outline-none appearance-none text-white"
      />
      <IconCalendar className="absolute right-3 top-1/2 -translate-y-1/2  text-white w-5 h-5 pointer-events-none" />
    </div>
  );
}
const InputsModule = { SearchInput, SelectInput, InputDate };
export default InputsModule;
