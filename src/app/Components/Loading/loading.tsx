import Image from "next/image";

export default function Loading() {
    return (
        <div className="h-screen w-full bg-[#0f0f0f] relative overflow-hidden 
              before:content-[''] before:absolute before:top-0 before:left-0 before:w-[200px] before:h-[200px] before:bg-[url('/iconos-layout.png')] before:bg-no-repeat before:bg-cover before:opacity-20 before:blur-[2px]
              after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-[200px] after:h-[200px] after:bg-[url('/iconos-layout.png')] after:bg-no-repeat after:bg-cover after:opacity-20 after:blur-[2px]">

            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full 
                  bg-[#D4FF00] opacity-20 blur-[180px]"></div>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full 
                  bg-[#D4FF00] opacity-15 blur-[200px]"></div>

            <div className="relative z-10 flex items-center justify-center h-full">
                <Image
                    src={"/logo.png"}
                    alt="Timshel"
                    width={300}
                    height={150}
                    priority
                />
            </div>
        </div>
    )
}