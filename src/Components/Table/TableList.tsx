export function TableList({ encabezado }: any) {
    return (
        <>
            <div className="mt-4 w-full flex flex-col gap-3">
                {/* encabezado */}
                <div className="!bg-[#1A1A1A] py-3 px-5 rounded-lg text-white flex items-center justify-between border border-white">
                    {encabezado?.map((item: any) => (
                        <h3 className="font-semibold text-xl">{item}</h3>
                    ))}
                </div>
                {/* quemado */}
                {[
                    { name: "Laura Fernández", users: "49 usuarios", change: "+24", up: true },
                    { name: "Diego Torres", users: "35 usuarios", change: "-1", up: false },
                    { name: "María López", users: "32 usuarios", change: "+4", up: true },
                    { name: "Sofía Ruiz", users: "29 usuarios", change: "0", up: null },
                ].map((t, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between bg-[#0f0f0f] rounded-lg px-4 py-2"
                    >
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gray-700"></div>
                            <div>
                                <p className="text-sm font-medium">{t.name}</p>
                                <p className="text-gray-400 text-xs">{t.users}</p>
                            </div>
                        </div>
                        <div
                            className={`text-sm font-semibold ${t.up === true
                                ? "text-[#adff2f]"
                                : t.up === false
                                    ? "text-red-500"
                                    : "text-gray-400"
                                }`}
                        >
                            {t.change}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default { TableList }