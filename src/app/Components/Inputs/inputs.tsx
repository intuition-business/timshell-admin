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

export function SearchInput({ placeholder, onChange, value }: any) {
  return (
    <div className="relative w-full">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="bg-[#2B2B2B] border border-[#777777] w-full text-white pr-10 pl-3 py-4 rounded-xl focus:outline-none"
      />
      <IconSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8C8C] w-6 h-6" />
    </div>
  );
}


export function SelectInput({ placeholder, options }: SelectInputProps) {
  return (
    <>
      <div className="relative text-white  w-full max-w-[250px]">
        <select
          defaultValue=""
          className="bg-[#2B2B2B] border border-[#777777] w-full pl-3 pr-10 py-4 rounded-xl focus:outline-none appearance-none"
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
    <div className="relative text-white flex w-full max-w-[200px]">
      <input
        type="text"
        placeholder={placeholder}
        className="bg-[#2B2B2B] border border-[#777777] w-full py-4 pl-3 pr-10 min-w-[100px] rounded-xl focus:outline-none appearance-none text-white"
      />
      <IconCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-white w-5 h-5 pointer-events-none" />
    </div>
  );
}
const InputsModule = { SearchInput, SelectInput, InputDate };
export default InputsModule;
