import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { type MRT_ColumnDef } from 'mantine-react-table';
import Table from '../../../components/Table/Table';
import { getSL } from '../../../api/PlatezhkiDetailApi';
import { Title } from '@mantine/core';

interface SLGridProps {
    idBUOP: number | undefined;
}
const SLGrid: React.FC<SLGridProps> = ({ idBUOP }) => {
    const [data, setData] = useState<any[]>([]);

    const fetchData = useCallback(async() => {
        const result = await getSL(idBUOP);
        setData(result);
    }, [idBUOP]);

    useEffect(() => {
        fetchData();
    }, [fetchData])

    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        { accessorKey: 'logical', header: 'Отметка' },
        { accessorKey: 'N_ZAP', header: 'N_ZAP', size: 50},
        { accessorKey: 'IDCASE', header: 'IDCASE', size: 50},
        { accessorKey: 'VPOLIS', header: 'Тип документа, подтверждающего факт страхования по ОМС'},
        { accessorKey: 'ENP', header: 'Номер/Серия/ЕНП документа, подтверждающего факт страхования по ОМС',},
        { accessorKey: 'FAM', header: 'Фамилия'},
        { accessorKey: 'IM', header: 'Имя'},
        { accessorKey: 'OT', header: 'Отчество'},
        { accessorKey: 'W', header: 'Пол', size: 20},
        { accessorKey: 'UMPNAME', header: 'Условие оказания МП'},
        { accessorKey: 'vmpname', header: 'Вид МП'},
        { accessorKey: 'frmmpname', header: 'Форма помощи'},
        { accessorKey: 'DATE_Z_1', header: 'Дата начала лечения'},
        { accessorKey: 'DATE_Z_2', header: 'Дата окончания лечения'},
        { accessorKey: 'spname', header: 'Код способа оплаты'},
        { accessorKey: 'SUMP', header: 'Сумма принятая (терр. оказания МП)'},
        { accessorKey: 'A_SUMP', header: 'Сумма принятая (терр. страхования)'},
        { accessorKey: 'A_SANK_IT', header: 'Сумма санкций по законченному случаю (терр. страхования)'},
        { accessorKey: 'A_STNAME', header: 'Тип оплаты (терр. страхования)'},
        { accessorKey: 'VOLUME_SL', header: 'Объемы по бух.'},
        { accessorKey: 'SUMP_BUOP', header: 'Сумма принятая по бух.'},
        { accessorKey: 'COMENTSL', header: 'Комментарий (терр. страхования)'}, 
        { accessorKey: 'subname', header: 'Регион страхования'},
    ], []);
    const headCell = () => ({
        style: {
            backgroundColor: '#f5f5f5',
        }
    });
    const bodyCell: any = {
        style: {
            backgroundColor: 'inherit',
        }
    };

    return (
        <>
        <Title order={4}>Случаи</Title>
        <Table columns={columns} data={data} pageSize={3} containerHeight={30} headCellProps={headCell} bodyCellProps={bodyCell}/>
        </>
    )
};

export default SLGrid;