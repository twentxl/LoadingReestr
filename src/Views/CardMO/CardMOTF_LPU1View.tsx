import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { GetTF_LPU1 } from '../../api/CardMOApi';
import { type MRT_ColumnDef } from 'mantine-react-table';
import Table from '../../components/Table/Table';
import Loader from '../../components/ui/Loader/Loader';
import ContextMenu, { ContextMenuItem } from '../../components/ContextMenu/ContextMenu';
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

    // const table = useMantineReactTable({
    //     columns,
    //     data,
    //     enableColumnActions: true,
    //     enableColumnFilters: true,
    //     enableSorting: true,
    //     enableEditing: true,
    //     enableStickyHeader: true,
    //     mantineTableProps: {
    //         withColumnBorders: true,
    //         sx: {
    //             'thead > tr': { backgroundColor: '#d8d8d8', },
    //             'thead > tr > th': { backgroundColor: '#d8d8d8', },
    //             'tbody > tr > td': { backgroundColor: '#d8d8d8', },
    //         },
    //     },
    //     mantineTableBodyRowProps: ({ row }) => ({
    //         onContextMenu: (event) => { 
    //             event.preventDefault();
    //             setSelectedRow(row);
    //             setActiveRow(row);
    //           },
    //           onClick: () => {
    //             setActiveRow(null);
    //           }
    //     }),
    //     mantineTableBodyCellProps: ({ row }) => {
    //         const isActive = activeRow?.id === row.id;
    //         const dateendValueNotEnd = row.original.dateend == '2222-01-01';
    //         return {
    //           style: {
    //             backgroundColor: isActive ? '#dee2e6' : 'inherit',
    //             color: !dateendValueNotEnd ? '#f00' : 'inherit',
    //           },
    //         };
    //     },
    //     mantineTableHeadCellProps: () => ({
    //         style: {
    //           backgroundColor: '#f5f5f5',
    //         }
    //     }),
    //     initialState: {
    //         pagination: {
    //             pageIndex: 0,
    //             pageSize: 5,
    //         },
    //     },
    // });
    const headCell = () => ({
        style: {
            backgroundColor: '#f5f5f5',
        }
    });
    const bodyCell = ({ row }: {row: any}) => {
        const isActive = activeRow?.id === row.id;
        const dateendValueNotEnd = row.original.dateend == '2222-01-01';
        return {
            style: {
            backgroundColor: isActive ? '#dee2e6' : 'inherit',
            color: !dateendValueNotEnd ? '#f00' : 'inherit',
            },
        };
    }
    const bodyRow = ({ row }: {row: any}) => ({
        onContextMenu: (event: any) => { 
            event.preventDefault();
            setSelectedRow(row);
            setActiveRow(row);
            },
            onClick: () => {
            setActiveRow(null);
            }
    })

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
            <Table columns={columns} 
                    data={data} 
                    pageSize={5} 
                    containerHeight={50} 
                    headCellProps={headCell} 
                    bodyCellProps={bodyCell} 
                    bodyRowProps={bodyRow}/>
        </div>
    </>
    )
};

export default CardMOTF_LPU1View;