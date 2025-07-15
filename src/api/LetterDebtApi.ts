import { API_URL } from "./api_url";

export interface ExportFileParams {
    date1: string | null;
    date2: string | null;
    mtr: number;
}
export async function ExportFile(params: ExportFileParams) {
    try {
        const response = await fetch(`${API_URL}api/LetterDebt`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...params })
        })
        .then(response => {
            if(!response.ok) { throw new Error("Ошибка при выполнении запроса!"); }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            a.download = `Сведения об задолженности ${params.date2}.docx`;

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        });
    }
    catch(error) {
        console.error("Ошибка запроса: ", error);
        throw error;
    }
}