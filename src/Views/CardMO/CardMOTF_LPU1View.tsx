import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GetTF_LPU1 } from '../../api/CardMO';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import Loader from '../../components/ui/Loader/Loader';
import ContextMenu, { ContextMenuItem } from '../../components/ui/ContextMenu/ContextMenu';
import { FcDiploma1, FcDeleteRow, FcPrint } from "react-icons/fc";

interface CardMOTF_LPU1Props {
    idTF_F003: string;
}
const CardMOTF_LPU1View: React.FC<CardMOTF_LPU1Props> = ({ idTF_F003 }) => {
    const [data, setData] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [activeRow, setActiveRow] = useState<any | null>(null);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);

    const contentRef = useRef<HTMLDivElement | null>(null);

    const fetchData = useCallback(async() => {
        setLoaderVisible(true);
        try {
            const result = await GetTF_LPU1(idTF_F003);
            setData(result);
        }
        finally {
            setLoaderVisible(false);
        }
    }, [])

    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        { accessorKey: "LPU_1", header: "Код подразделения" },
        { accessorKey: "nam_mosk", header: "Наименование подразделения (краткое)" },
        { accessorKey: "nam_mosp", header: "Наименование подразделения (полное)" },
        { accessorKey: "index_j", header: "Индекс" },
        { accessorKey: "district", header: "Район" },
        { accessorKey: "adressaddr_fspo", header: "Адрес" },
        { accessorKey: "fam_ruk_sp", header: "Фамилия руководителя" },
        { accessorKey: "im_ruk_sp", header: "Имя руководителя" },
        { accessorKey: "ot_ruk_sp", header: "Отчество руководителя" },
        { accessorKey: "Phone_sp", header: "Номер телефона" },
        { accessorKey: "datebeg", header: "Дата начала действия" },
        { accessorKey: "dateend", header: "Дата окончания действия" },
        { accessorKey: "uploads", header: "Дата обновления" },
        { accessorKey: "OID_LPU_1", header: "OID_LPU_1" },
    ], []);

    const table = useMantineReactTable({
        columns,
        data,
        enableColumnActions: true,
        enableColumnFilters: true,
        enableSorting: true,
        enableEditing: true,
        //enableStickyHeader: true,
        mantineTableProps: {
            withColumnBorders: true,
        },
        mantineTableBodyRowProps: ({ row }) => ({
            onContextMenu: (event) => { 
                event.preventDefault();
                setSelectedRow(row);
                setActiveRow(row);
              },
              onClick: () => {
                setActiveRow(null);
              }
        }),
        mantineTableBodyCellProps: ({ row }) => {
            const isActive = activeRow?.id === row.id;
            return {
              style: {
                backgroundColor: isActive ? '#dee2e6' : 'inherit',
              },
            };
        },
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: 5,
            },
        },
    });

    useEffect(() => {
        fetchData();
    }, [fetchData])

    return (
    <>
        <ContextMenu area={contentRef}>
            <ContextMenuItem text="Удалить подразделение" icon={FcDeleteRow}/>
            <ContextMenuItem text="Лицензии" icon={FcDiploma1}/>
            <ContextMenuItem text="Выгрузить в Excel" icon={FcPrint}/>
        </ContextMenu>
        <div ref={contentRef}>
            <Loader visible={loaderVisible} />
            <MantineReactTable table={table} />
        </div>
    </>
    )
};

export default CardMOTF_LPU1View;