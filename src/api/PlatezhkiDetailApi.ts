import { API_URL } from "./api_url";

export interface getPlatPorGridProps {
    typeIST: number;
    kod_ter: string | null;
    T_PLPR: number | undefined;
    D_PLPR: string | null;
    N_PLPR: string | null;
    DATA_OPL: string | null;
    N_SCH: string | null;
    D_SCH: string | null;
    N_SCH_MO: string | null;
    D_SCH_MO: string | null;
    N_PLPR_MO: string | null;
    code_mo: string | null;
}
export async function getPlatPorGrid(param: getPlatPorGridProps) {
    try {
        const response = await fetch(`${API_URL}api/PlatezhkiDetail/PlatPorGrid`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...param })
        });
        if(!response.ok) { throw new Error ("Ошибка при выполнении запроса!"); }

        const result = await response.json();
        return JSON.parse(result.data);
    }
    catch(error) {
        console.error("Ошибка: ", error);
        throw error;
    }
};

export interface getSchetaProps {
    typeIST: number | undefined;
    IDBUOP_PL_SCH: number | undefined;
    NSCHET: string | null;
    DSCHET: string | null;
}
export async function getScheta(param: getSchetaProps) {
    try {
        const response = await fetch(`${API_URL}api/PlatezhkiDetail/Scheta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...param })
        });
        if(!response.ok) { throw new Error("Ошибка при выполнении запроса!"); }

        const result = await response.json();
        return JSON.parse(result.data);
    }
    catch(error) {
        console.error("Ошибка: ", error);
        throw error;
    }
};

export async function getSL(IDBUOP_PL_SCH: number | undefined) {
    try {
        const response = await fetch(`${API_URL}api/PlatezhkiDetail/SL`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ IDBUOP_PL_SCH })
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

export async function ExportExcel_PlatPorGrid(data: any) {
    try {
        await fetch(`${API_URL}api/PlatezhkiDetail/ExportExcel`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        })
        .then(response => {
            if (!response.ok) { throw new Error("Ошибка при выполнении запроса!"); }
            return response.blob();
        })
        .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        const date = new Date();
        const dateStr = date.toLocaleDateString('ru-RU');
        a.download = `Платежные поручения, ${dateStr}.xlsx`;

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