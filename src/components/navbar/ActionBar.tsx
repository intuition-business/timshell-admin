import Buttons from "@/components/ui/Buttons";

export default function AccionBar({ accionState, textButton, useAccionState }: any) {
    return (
      <div
        className={`flex justify-end items-center sticky bottom-0 bg-black w-[calc(100%+96px)] -translate-x-[48px] pr-12 py-3 text-base ${
          accionState ? " pointer-events-none" : ""
        }`}
      >
        <Buttons
          data={textButton}
          onClick={() => {
            useAccionState(true);
          }}
          className="max-w-[220px] w-full py-2.5 px-6 cursor-pointer"
        />
      </div>
    );
}
