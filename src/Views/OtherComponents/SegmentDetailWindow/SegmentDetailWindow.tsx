import React, { useMemo } from 'react';
import Popup from '../../../components/Popup/Popup';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';

interface SegmentDetailWindowProps {
    visible: boolean;
    onClose: () => void;
    data: any[];
}
const SegmentDetailWindow: React.FC<SegmentDetailWindowProps> = ({ visible, onClose, data }) => {
    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            { accessorKey: "FieldName", header: "Наименование поля" },
            { accessorKey: "Value", header: "Значение поля" }
        ], []);
        
    const table = useMantineReactTable({
        columns,
        data,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: false,
        mantineTableProps: {
            withColumnBorders: true,
            sx: {
                'thead > tr': { backgroundColor: '#d8d8d8', },
                'thead > tr > th': { backgroundColor: '#d8d8d8', },
                'tbody > tr > td': { backgroundColor: '#d8d8d8', },
            },
        },
        mantineTableHeadCellProps: () => ({
            style: {
              backgroundColor: '#f5f5f5',
            }
        }),
        mantineTableBodyCellProps: {
            style: {
                backgroundColor: 'inherit',
            },
        },
    });

    return (
        <Popup title="Развернутая информация" visible={visible} onClose={onClose}>
            <div style={{ height: '500px', width: '800px', overflow: 'auto' }}>
                <MantineReactTable table={table} />
            </div>
        </Popup>
    )
};

export default SegmentDetailWindow;