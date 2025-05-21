import { API_URL } from "./api_url";

export async function OutputSprav(param: number, param2: number | null) {
    try {
        const response = await fetch(`${API_URL}api/OutputSprav`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                param, param2
            })
        });
        if(!response.ok) {
            throw new Error("Ошибка при выполнении запроса!");
        }

        const result = await response.json();
        return JSON.parse(result.data);
    }
    catch(error) {
        console.error("Ошибка: ", error);
        throw error;
    }
}