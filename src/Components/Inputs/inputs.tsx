import { IconSearch } from "@tabler/icons-react"

export function SearchInput({ placeholder }: any) {
    return (
        <>
            <input type="text" placeholder={placeholder} className="bg-[#1a1a1a] w-full min-w-[300px] text-base pr-9 pl-3 py-3 rounded-lg focus:outline-none" />
            <IconSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8C8C8C] w-6 h-6 " />
        </>
    )
}

export function SelectInput(placeholder: any) {
    return (
        <input type="text" placeholder="placeholder" className="bg-[#1a1a1a] text-sm pl-9 pr-3 py-2 rounded-lg focus:outline-none" />
    )
}

export default { SearchInput, SelectInput }