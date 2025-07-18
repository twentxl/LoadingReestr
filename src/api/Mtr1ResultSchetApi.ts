import { API_URL } from "./api_url";

export interface Mtr1ResultSchetParams {
    typeIST: number;
    dateregistration1: string | null;
    dateregistration2: string | null;
    datezag1: string | null;
    datezag2: string | null;
    DSCHET1: string | null;
    DSCHET2: string | null;
    D_PLPR1: string | null;
    D_PLPR2: string | null;
    T_PLPR: string | null;
    N_PLPR: string | null;
    C_OKATO1: string | null;
    OKATO_OMS: string | null;
    NSCHET: string | null;
    DSCHET: string | null;
    schetStatus: string | null;
    type_d: string | null;
    namefilearh: string | null;
};
export async function Mtr1ResultSchet(params: Mtr1ResultSchetParams) {
    try {
        const response = await fetch(`${API_URL}api/MtrResultSchet`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                ...params
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

export async function DeleteRow(idSCHETStatus: number) {
    try {
        const response = await fetch(`${API_URL}api/MtrResultSchet/DeleteRow`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idSCHETStatus })
        });
        if(!response.ok) { throw new Error("Ошибка при выполнении запроса!");  }

        const result = await response.json();
        console.log(result.message);
    }
    catch(error) {
        console.error("Ошибка: ", error);
        throw error;
    }
}

export async function Mtr1ExportExcel(data: any) {
    try {
       await fetch(`${API_URL}api/MtrResultSchet/ExportExcel`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Ошибка при выполнении запроса!");
            }
            return response.blob();
        })
        .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const date = new Date();
        const dateStr = date.toLocaleDateString('ru-RU');
        a.download = `Счета, ${dateStr}.xlsx`;

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