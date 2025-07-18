import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { getPlatPorGrid, ExportExcel_PlatPorGrid, type getPlatPorGridProps } from '../../../api/PlatezhkiDetailApi';
import { Button, Title } from '@mantine/core';
import { FcPrint } from 'react-icons/fc';

interface PlatPorGridProps {
    typeIST: number;
    onSelectIdBUOP?: (id: number) => void;
    onSelectRow?: (row: any) => void;
  }
const PlatPorGrid: React.FC<PlatPorGridProps> = ({ typeIST, onSelectIdBUOP, onSelectRow }) => {
    const [data, setData] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [activeRow, setActiveRow] = useState<any | null>(null);

    const exportGridRef = useRef<any>(null);
    
    const fetchData = React.useCallback(async() => {
        const param: getPlatPorGridProps = {
            typeIST: typeIST,
            kod_ter: '',
            T_PLPR: undefined,
            D_PLPR: '',
            N_PLPR: '',
            DATA_OPL: '',
            N_SCH: '',
            D_SCH: '',
            N_SCH_MO: '',
            D_SCH_MO: '',
            N_PLPR_MO: '',
            code_mo: '',
        }
        const result = await getPlatPorGrid(param);
        if(onSelectIdBUOP) { onSelectIdBUOP(result[0].idBUOP_PL_SCH); }
        setData(result);
        exportGridRef.current = result;
    }, [setData])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const exportExcel = React.useCallback(async() => {
        if(exportGridRef.current) { await ExportExcel_PlatPorGrid(exportGridRef.current); }
    }, [])

    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        { accessorKey:"KOD_TER", header:"Код ТФ", size: 50},
        { accessorKey:"subname", header:"Наименование субъекта"},
        { accessorKey:"N_PLPR", header:"Номер плат. пор.", size: 70},
        { accessorKey:"T_PLPR", header:"Тип плат. пор."},
        { accessorKey:"D_PLPR", header:"Дата плат. пор." },
        { accessorKey:"DATA_OPL", header:"Дата факт. оплаты" },
        { accessorKey:"sum_sch", header:"Сумма оплаты"},
        { accessorKey:"n_sch", header:"Номер счёта"},
        { accessorKey:"d_sch", header:"Дата счёта"},
        { accessorKey:"PRED",  header:"Предмет платежа"},
        { accessorKey:"IST_OP", header:"Источник оплаты", size: 20},
        { accessorKey:"t_naim", header:"Наименование плательщика"},
        { accessorKey:"t_a", header:"Адрес плательщика"},
        { accessorKey:"t_b", header:"Банк плательщика"},
        { accessorKey:"t_rs", header:"Расчётный счёт"},
        { accessorKey:"t_bic", header:"БИК плательщика"},
        { accessorKey:"t_in", header:"ИНН плательщика"},
        { accessorKey:"t_kp", header:"КПП плательщика"},
        { accessorKey:"t_oktmo", header:"Код по ОКТМО плательщика"},
        { accessorKey:"l_naim", header:"Наименование получателя"},
        { accessorKey:"l_a", header:"Адрес получателя"},
        { accessorKey:"l_b", header:"Банк получателя"},
        { accessorKey:"l_rs", header:"Расчётный счёт получателя"},
        { accessorKey:"l_bic", header:"БИК получателя"},
        { accessorKey:"l_in", header:"ИНН получателя"},
        { accessorKey:"l_kp", header:"КПП получателя"},
        { accessorKey:"l_kb",  header:"КБК получателя"},
        { accessorKey:"l_oktmo", header:"Код по ОКТМО получателя"},
        { accessorKey:"PLFNAME", header:"Имя файла"},
        { accessorKey:"idSCHET_OSN", header:"idSCHET_OSN"},
        { accessorKey:"idBUOP_PL_SCH", header:"id idBUOP_PL_SCH"},
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
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: () => {
                if(onSelectIdBUOP) { onSelectIdBUOP(row.original.idBUOP_PL_SCH); }
                if(onSelectRow) { onSelectRow(row) }
                setSelectedRow(row);
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
                pageSize: 10,
            },
        },
        renderTopToolbarCustomActions: () => (
            <>
            <Button variant='default' leftIcon={<FcPrint />} onClick={exportExcel}>Сохранить в Excel</Button>
            </>
        )
    });

    return (
        <>
        <Title order={4}>Плат.пор</Title>
        <MantineReactTable table={table} />
        </>
    )
};

export default PlatPorGrid;