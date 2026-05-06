import { demoPolicyGetUseCase } from "@/server/modules/demo-policy/use-cases/demo-policy.get.use-case";
import { DemoPolicyForm } from "./components/demo-policy-form";

export default async function DemoPolicyPage() {
    const resp = await demoPolicyGetUseCase();
    
    if (!resp.success) {
        return <div className="p-6 text-red-500">{resp.message}</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Configuración Política Demo</h1>
            <DemoPolicyForm policy={resp.data} />
        </div>
    );
}
