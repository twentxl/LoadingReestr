import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { type MRT_ColumnDef } from 'mantine-react-table';
import Popup from '../../../components/Popup/Popup';
import Loader from '../../../components/ui/Loader/Loader';
import { Mtr1SvedFileXml_select } from '../../../api/Mtr1SvedFileXmlPPApi';
import { Box } from '@mantine/core';
import Table from '../../../components/Table/Table';

interface Mtr1SvedFileXmlPPProps {
    typeIST: number;
    title: string;
    visible: boolean;
    onClose: () => void;
}
const Mtr1SvedFileXmlPPView: React.FC<Mtr1SvedFileXmlPPProps> = ({ typeIST, title, visible, onClose }) => {
    const [data, setData] = useState<any[]>([]);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);

    const fetchData = useCallback(async() => {
        setLoaderVisible(true);
        try {
            const result = await Mtr1SvedFileXml_select(typeIST);
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

    const headCell = () => ({
        style: {
            backgroundColor: '#f5f5f5',
        }
    });
    const bodyCell: any = {
        style: {
            backgroundColor: 'inherit',
        }
    }
    return (
        <Popup title={title} visible={visible} onClose={onClose}>
            <Loader visible={loaderVisible} />
            <Box style={{ height: '500px', overflowY: 'auto'}}>
                <Table columns={columns} data={data} pageSize={10} containerHeight={70} headCellProps={headCell} bodyCellProps={bodyCell}/>
            </Box>
        </Popup>
    )
}
export default Mtr1SvedFileXmlPPView;