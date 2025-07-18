import { API_URL } from "./api_url";

export interface Mtr1ResultPlatProps {
    typeIST: number;
    D_PLPR1: string | null;
    D_PLPR2: string | null;
    N_PLPR: string | null;
    DATA_OPL1: string | null;
    DATA_OPL2: string | null;
}
export async function Mtr1ResultPlat(params: Mtr1ResultPlatProps) {
    try {
        const response = await fetch(`${API_URL}api/Mtr1ResultPlat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...params })
        });
        if(!response.ok) { throw new Error("Ошибка при выполнении запроса!"); }

        const result = await response.json();
        return JSON.parse(result.data);
    }
    catch(error) {
        console.error("Ошибка: ", error);
        throw error;
    }
}

export async function ExportExcel(data: any) {
    try {
        await fetch(`${API_URL}api/Mtr1ResultPlat/ExportExcel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        })
        .then(response => {
            if(!response.ok) { throw new Error("Ошибка при выполнении запроса!"); }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const date = new Date();
            const dateStr = date.toLocaleDateString('ru-RU');
            a.download = `Сведения об оплате, ${dateStr}.xlsx`;

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        });
    }
    catch(error) {
        console.error("Ошибка: ", error);
        throw error;
    }
}