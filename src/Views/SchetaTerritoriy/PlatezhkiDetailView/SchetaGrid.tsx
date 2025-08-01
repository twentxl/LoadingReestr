import React, { useState, useEffect, useMemo } from 'react';
import { type MRT_ColumnDef } from 'mantine-react-table';
import Table from '../../../components/Table/Table';
import { getScheta, type getSchetaProps } from '../../../api/PlatezhkiDetailApi';
import { Title } from '@mantine/core';

interface SchetaProps {
    idBUOP: number | undefined;
    onSelectRow?: (row: any) => void;
}
const SchetaGrid: React.FC<SchetaProps> = ({ idBUOP, onSelectRow }) => {
    const [data, setData] = useState<any[]>([]);

    const fetchData = React.useCallback(async() => {
        const param: getSchetaProps = {
            typeIST: undefined,
            IDBUOP_PL_SCH: idBUOP,
            NSCHET: '',
            DSCHET: ''
        }
        const result = await getScheta(param);
        setData(result);
        if(onSelectRow) { onSelectRow(result[0]) }
    }, [idBUOP]);

    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        { accessorKey:"IDBUOP_PL_SCH", header:"IDBUOP_PL_SCH" },
        { accessorKey:"dateregistration", header:"Дата регистрации"},
        { accessorKey:"OKATO_OMS", header:"Код ОКАТО терр. страх. по ОМС"},
        { accessorKey:"subname1", header:"Наименование терр. страх. по ОМС "},
        { accessorKey:"YEAR", header:"Отчетный год (ТО МП)"},
        { accessorKey:"MONTH", header:"Отчетный месяц (ТО МП)"},
        { accessorKey:"NSCHET", header:"Номер счёта (ТО МП)"},
        { accessorKey:"DSCHET", header:"Дата выставления счета (ТО МП)"},
        { accessorKey:"SD_Z", header:"К-во поданных случаев (ТО МП)"},
        { accessorKey:"SD_Zopl", header:"К-во принятых случаев (ТС)"},
        { accessorKey:"SD_Zerror", header:"К-во отклоненых случаев  (ТС) "},
        { accessorKey:"SUMMAV", header:"Сумма счета выставленная на оплату (ТО МП)"},
        { accessorKey:"SUMMAP", header:"Сумма принята к оплате (ТО МП)"},
        { accessorKey:"SUMMAP_tf", header:"Сумма принята к оплате (ТС)"},
        { accessorKey:"SANK_MEK_tf", header:"Санкции МЭК (ТС)"},
        { accessorKey:"sum_schopl", header:"Сумма оплаченная по бух."},
        { accessorKey:"sum_schvzvr", header:"Сумма возврата по бух."},
        { accessorKey:"sum_itogo", header:"Сумма оплаченная по бух. с учетом возврата"},
        { accessorKey:"firstnamefile", header:"Имя основного файла"},
        { accessorKey:"namefilearh", header:"Наименование архива"},
        { accessorKey:"idSCHET", header:"idSCHET "},
        { accessorKey:"idSCHETStatus", header:"idSCHETStatus"},
    ], []);

    const headCell = () => ({
        style: {
            backgroundColor: '#f5f5f5',
        }
    });
    const bodyCell:any = {
        style: {
            backgroundColor: 'inherit',
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData])

    return (
        <>
        <Title order={4}>Счет терр.страх</Title>
        <Table columns={columns} data={data} pageSize={3} containerHeight={20} headCellProps={headCell} bodyCellProps={bodyCell} />
        </>
    )
};

export default SchetaGrid;