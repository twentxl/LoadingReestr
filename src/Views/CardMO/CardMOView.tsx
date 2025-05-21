import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Loader from '../../components/ui/Loader/Loader';
import { GetTF_003, ExportExcel } from '../../api/CardMO';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { Button } from '@mantine/core';
import { FcPrint } from 'react-icons/fc';

const CardMOView = () => {
    const [data, setData] = useState<any[]>([]);

    const loaderRef = useRef<HTMLDivElement | null>(null);
    const exportGridRef = useRef<any[] | null>(null);

    const fetchData = useCallback(async() => {
        if(loaderRef.current) { loaderRef.current.style.display = "flex" }
        try {
            const result = await GetTF_003();
            setData(result);
            exportGridRef.current = result;
        }
        finally {
            if(loaderRef.current) { loaderRef.current.style.display = "none" }
        }
    }, [setData]);

    const CardMOExportExcel = useCallback(async() => {
        if(loaderRef.current) { loaderRef.current.style.display = "flex" }
        try { await ExportExcel(exportGridRef.current) }
        finally {
            if(loaderRef.current) { loaderRef.current.style.display = "none" }
        }
    }, [])

    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        { accessorKey: "code_mo", header: "Код МО" },
        { accessorKey: "nam_mok", header: "Наименование МО (краткое)" },
        { accessorKey: "nam_mop", header: "Наименование МО (полное)" },
        { accessorKey: "inn", header: "ИНН" },
        { accessorKey: "Ogrn", header: "ОГРН" },
        { accessorKey: "KPP", header: "КПП" },
        { accessorKey: "datebeg", header: "Дата начала действия" },
        { accessorKey: "dateend", header: "Дата окончания действия" },
        { accessorKey: "tf_okato", header: "ОКАТО" },
        { accessorKey: "index_j", header: "Почтовый индекс адресата" },
        { accessorKey: "addr_j", header: "Адрес" },
        { accessorKey: "okopf", header: "ОКПФ" },
        { accessorKey: "idF007_Vedom", header: "Вед. принадлежность", },
        { accessorKey: "idR008_Glmo", header: "Признак подчиненности", },
        { accessorKey: "fam_ruk", header: "Фамилия руководителя" },
        { accessorKey: "im_ruk", header: "Имя руководителя" },
        { accessorKey: "ot_ruk", header: "Отчество руководителя" },
        { accessorKey: "phone", header: "Телефон" },
        { accessorKey: "fax", header: "Факс" },
        { accessorKey: "e_mail", header: "Адрес электронной почты" },
        { accessorKey: "www", header: "Сайт" },
        { accessorKey: "fio_obr", header: "Фамилия для письма" },
        { accessorKey: "idV005_Pol", header: "Пол руководителя", },
        { accessorKey: "okfs", header: "Форма собственности", },
        { accessorKey: "idTFOMS_groupTF_F003", header: "Группа МО", },
        { accessorKey: "idTfomsPRIKREPMO", header: "Тип прикрепления",},
        { accessorKey: "OKTMO", header: "OKTMO" },
        { accessorKey: "OID", header: "OID" },
    ], []);   
      
    const table = useMantineReactTable({
        columns,
        data,
        enableColumnActions: true,
        enableColumnFilters: true,
        enableSorting: true,
        mantineTableProps: {
            withColumnBorders: true,
        },
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },
        renderTopToolbarCustomActions: () => (
            <>
            <Button variant='default' leftIcon={<FcPrint />} onClick={CardMOExportExcel}>Сохранить в Excel</Button>
            </>
        )
    });

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Loader ref={loaderRef}/>
            <MantineReactTable table={table}/>
        </>
    )
};

export default CardMOView;