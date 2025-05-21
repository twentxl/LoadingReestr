import { API_URL } from "./api_url";

export async function GetTF_003() {
    try {
        const response = await fetch(`${API_URL}api/CardMO`, {
            method: "GET",
            headers: { 'Content-Type': 'application/json' }
        });
        if(!response.ok) { throw new Error("Ошибка при выполнении запроса!"); }

        const result = await response.json();
        return JSON.parse(result.data);
    }
    catch(error) {
        console.error("Ошибка запроса: ", error);
        throw error;
    }
}

export async function ExportExcel(data: any) {
    try {
        const response = await fetch(`${API_URL}api/CardMO/ExportExcel`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ data })
        })
        .then(response => {
            if(!response.ok) { throw new Error("Ошибка при выполнении запроса!"); }
            return response.blob()
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            const date = new Date();
            const dateStr = date.toLocaleDateString('ru-RU');
            a.download = `Данные о МО и подразделениях, ${dateStr}.xlsx`;

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
    }
    catch(error) {
        console.error("Ошибка запроса: ", error);
        throw error;
    }
}