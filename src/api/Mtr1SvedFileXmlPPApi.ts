import { API_URL } from "./api_url";

export async function Mtr1SvedFileXml_select(typeIST: number) {
    try {
        const response = await fetch(`${API_URL}api/Mtr1SvedFileXmlPP`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ typeIST })
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