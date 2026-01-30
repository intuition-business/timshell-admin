import Trainer from "@/app/Components/Trainer/Trainer";
import TrainerDashboard from "@/app/Components/Trainer/TrainerInterna";

// import Interna from "@/app/Components/Interna/Interna";

export default function page() {
    return (
        <div className=" w-full relative min-h-full">
            {/* <Interna /> */}
            <TrainerDashboard />
        </div>
    );
}
