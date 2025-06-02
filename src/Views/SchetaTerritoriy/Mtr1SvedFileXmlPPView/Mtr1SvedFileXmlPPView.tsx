import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMantineReactTable, MantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import Popup from '../../../components/ui/Popup/Popup';
import Loader from '../../../components/ui/Loader/Loader';
import { Mtr1SvedFileXml_select } from '../../../api/Mtr1SvedFileXmlPPApi';
import { Box } from '@mantine/core';

interface Mtr1SvedFileXmlPPProps {
    visible: boolean;
    onClose: () => void;
}
const Mtr1SvedFileXmlPPView: React.FC<Mtr1SvedFileXmlPPProps> = ({ visible, onClose }) => {
    const [data, setData] = useState<any[]>([]);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);

    const fetchData = useCallback(async() => {
        setLoaderVisible(true);
        try {
            const result = await Mtr1SvedFileXml_select(1);
            setData(result);
        }
        finally {
            setLoaderVisible(false);
        }
    }, [setData, setLoaderVisible]);

    useEffect(() => {
        fetchData()
    }, [fetchData]);

    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        { accessorKey: "ID", header: "ID" },
        { accessorKey: "FNAME", header: "Имя файла" },
        { accessorKey: "DATEZAG", header: "Дата загрузки" },
        { accessorKey: "DATE_PL", header: "Дата формирование PL" },
        { accessorKey: "ERROR", header: "Комментарий/ошибка к платежке" },
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
    })

    return (
        <Popup title="МТР1, Сведения о файлах xml от бухгалтерии" visible={visible} onClose={onClose}>
            <Loader visible={loaderVisible} />
            <Box style={{ height: '500px', overflowY: 'auto'}}><MantineReactTable table={table} /></Box>
        </Popup>
    )
}
export default Mtr1SvedFileXmlPPView;