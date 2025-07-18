import { API_URL } from "./api_url";

export async function GetTFOMSNSI() {
    try {
        const response = await fetch(`${API_URL}api/NSI`, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
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

export async function PostTable(nametable: string) {
    try {
        const response = await fetch(`${API_URL}api/NSI`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nametable })
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

export async function DeleteRow(nametable: string, idRow: string) {
    try {
        const response = await fetch(`${API_URL}api/NSI/DeleteRow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nametable, idRow })
        });
        if(!response.ok) { throw new Error("Ошибка при выполнении запроса!"); }

        const result = await response.json();
        console.log(result.message);
    }
    catch(error) {
        console.error("Ошибка: ", error);
        throw error;
    }
}

export async function ExportExcel(nametable: string) {
    try {
        await fetch(`${API_URL}api/NSI/ExportExcel`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ nametable })
        })
        .then(response => {
            if(!response.ok) {
                throw new Error("Ошибка при выполнении запроса!");
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Справочник.xlsx`;
    
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        })
    }
    catch(error) {
        console.error("Ошибка: ", error);
        throw error;
    }
}