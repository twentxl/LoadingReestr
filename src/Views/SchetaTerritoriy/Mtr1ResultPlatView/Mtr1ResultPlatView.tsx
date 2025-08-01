import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { type MRT_ColumnDef } from 'mantine-react-table';
import Table from '../../../components/Table/Table';
import Mtr1ResultPlatSearch from './Mtr1ResultPlatSearch';
import { Mtr1ResultPlat, ExportExcel, type Mtr1ResultPlatProps } from '../../../api/Mtr1ResultPlatApi';
import { formatDateTime } from '../../../helper/formatting';
import { Button } from '@mantine/core';
import Loader from '../../../components/ui/Loader/Loader';
import { FcPrint } from 'react-icons/fc';

interface Mtr1ResultPlatViewProps {
    typeIST: number;
}
const Mtr1ResultPlatView: React.FC<Mtr1ResultPlatViewProps> = ({ typeIST }) => {
    const [data, setData] = useState<any[]>([]);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);

    const contentRef = useRef<HTMLDivElement | null>(null);
    const exportGridRef = useRef<any>(null);

    const fetchData = useCallback(async(values: any) => {
        setLoaderVisible(true);
        try {
            if(contentRef.current) { contentRef.current.style.display = "block" }
            const params: Mtr1ResultPlatProps = {
                typeIST: typeIST,
                D_PLPR1: formatDateTime(values.D_PLPR1),
                D_PLPR2: formatDateTime(values.D_PLPR2),
                N_PLPR: values.N_PLPR,
                DATA_OPL1: formatDateTime(values.DATA_OPL1),
                DATA_OPL2: formatDateTime(values.DATA_OPL2)
            };
            const result = await Mtr1ResultPlat(params);
            setData(result);
            exportGridRef.current = result;
        }
        finally {
            setLoaderVisible(false);
        }
    }, [setData]);

    const resultClick = useCallback((values: any) => {
        fetchData(values)
    }, [fetchData]);

    const exportExcel = useCallback(async() => {
        setLoaderVisible(true);
        try {
            if(exportGridRef.current) { await ExportExcel(exportGridRef.current); }
        }
        finally {
            setLoaderVisible(false);
        }
    }, []);

    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        { accessorKey: "KOD_TER", header: "Код территории" },
        { accessorKey: "T_PLPR", header: "Тип платежного поручения" },
        { accessorKey: "N_PLPR", header: "Номер платежного поручения" },
        { accessorKey: "D_PLPR", header: "Дата платежного поручения" },
        { accessorKey: "DATA_OPL", header: "Дата фактической оплаты" },
        { accessorKey: "sum_sch", header: "Сумма оплаты" },
        { accessorKey: "n_sch", header: "Номер счета" },
        { accessorKey: "d_sch", header: "Дата счета" },
        { accessorKey: "PRED", header: "Предмет платежа" },
        { accessorKey: "IST_OP", header: "Источник оплаты" },
        { accessorKey: "l_oktmo", header: "Код по ОКТМО получателя" },
        { accessorKey: "t_naim", header: "Наименование плательщика" },
        { accessorKey: "t_a", header: "Адрес плательщика" },
        { accessorKey: "t_b", header: "Банк плательщика" },
        { accessorKey: "t_rs", header: "Расчётный счёт плательщика" },
        { accessorKey: "t_bic", header: "БИК плательщика" },
        { accessorKey: "t_in", header: "ИНН плательщика" },
        { accessorKey: "t_kp", header: "КБК плательщика" },
        { accessorKey: "t_oktmo", header: "Код по ОКТМО плательщика" },
        { accessorKey: "l_naim", header: "Наименование получателя" },
        { accessorKey: "l_a", header: "Адрес получателя" },
        { accessorKey: "l_b", header: "Банк получателя" },
        { accessorKey: "l_rs", header: "Расчётный счёт получателя" },
        { accessorKey: "l_bic", header: "БИК получателя" },
        { accessorKey: "l_in", header: "ИНН получателя" },
        { accessorKey: "l_kp", header: "КПП получателя" },
        { accessorKey: "l_kb", header: "КБК получателя" },
        { accessorKey: "PLFNAME", header: "Имя файла" },
    ], []);

    useEffect(() => {
        if(contentRef.current) { contentRef.current.style.display = "none" }
    }, [])
    
    const bodyCell: any = {
        style: { backgroundColor: 'inherit' }
    };
    const headCell = () => {
        style: { backgroundColor: '#f5f5f5' }
    };
    const topToolbar = () => (
        <>
            <Button variant='default' leftIcon={<FcPrint />} onClick={exportExcel}>Сохранить в Excel</Button>
        </>
    );

    return (
        <>
        <div><Mtr1ResultPlatSearch onClick={resultClick} /></div>
        <div ref={contentRef}>
            <Loader visible={loaderVisible} />
            <Table columns={columns} data={data} pageSize={10} containerHeight={65} headCellProps={headCell} bodyCellProps={bodyCell} topToolbarCustomActions={topToolbar}/>
        </div>
        </>
    )
};

export default Mtr1ResultPlatView;