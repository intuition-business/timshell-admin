interface TableRow {
  name: string;
  id: string;
  email?: string;
  users?: string;
  plan?: string;
  entrena?: string;
  up?: boolean | null;
  change?: string;
}

interface TableListProps {
  encabezado: string[];
  data: TableRow[];
}
interface CardItem {
  name: string;
  id: string;
  email: string;
  plan: string; // ahora es string
  entrena: string;
  users?: number;
  rating?: number;
}
export function TableList({ encabezado }: TableListProps) {
  return (
    <>
      <div className="mt-4 w-full flex flex-col gap-3">
        {/* encabezado */}
        <div className="!bg-[#0f0f0f] py-3 px-5 rounded-lg text-white flex items-center justify-between border border-[#333]">
          {encabezado?.map((item, index: number) => (
            <h3 key={index} className="font-semibold text-xl">
              {item}
            </h3>
          ))}
        </div>
      </div>
    </>
  );
}
interface CardItem {
  name: string;
  id: string;
  email: string;
  entrena: string;
}

interface CardListProps {
  data: CardItem[];
  columns: string[];
}

export function CardList({ data }: CardListProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      {data.map((t, i) => (
        <div
          key={i}
          className="flex items-center justify-between h-20 bg-[#333] rounded-lg px-4 py-2"
        >
          <div className="flex mx-2 space-x-4 items-center">
            <div className="h-10 w-10 rounded-full bg-gray-700"></div>
            <span>{t.name}</span>
          </div>
          <div className="">
            <span>{t.id}</span>
          </div>
          <div>
            <span>{t.email}</span>
          </div>
          <div>
            <span className="text-[#dff400]">{t.plan} usuarios</span>
          </div>
          <div className="flex mx-2 space-x-4 items-center">
            <div className="h-10 w-10 rounded-full bg-gray-700"></div>
            <span>{t.entrena}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
const InputsModule = { TableList, CardList };
export default InputsModule;
