import React from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef} from 'mantine-react-table';

interface TableProps {
    data: any[],
    columns: MRT_ColumnDef<any>[],
    pageSize: number,
    containerHeight: number,
    headCellProps: (props: { column: any }) => any,
    bodyCellProps: (props: { row: any }) => any,
    bodyRowProps?: (props: { row: any }) => any;
    topToolbarCustomActions?: () => React.ReactNode,
    renderDetail?: (props: {row: any}) => React.ReactNode;
}
const Table: React.FC<TableProps> = ({ data, columns, pageSize, containerHeight, headCellProps, bodyCellProps, bodyRowProps, topToolbarCustomActions, renderDetail }) => {
    const table = useMantineReactTable({
        columns,
        data,
        enableColumnActions: true,
        enableColumnFilters: true,
        enableSorting: true,
        enableStickyHeader: true,
        mantineTableContainerProps: {
            style: {
                height: `${containerHeight}vh`,
                maxHeight: `${containerHeight}vh`,
                overflowY: 'auto'
            }
        },
        mantineTableProps: {
            withColumnBorders: true,
            sx: {
                'thead > tr': { backgroundColor: '#d8d8d8', },
                'thead > tr > th': { backgroundColor: '#d8d8d8', },
                'tbody > tr > td': { backgroundColor: '#d8d8d8', },
            },
        },
        mantineTableHeadCellProps: headCellProps,
        mantineTableBodyCellProps: bodyCellProps,
        mantineTableBodyRowProps: bodyRowProps,
        renderDetailPanel: renderDetail,

        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: pageSize,
            },
            columnVisibility: {
                ERRORcontrol: false,
                id: false
            }
        },
        renderTopToolbarCustomActions: topToolbarCustomActions
    });
    return (
        <MantineReactTable table={table} />
    )
};

export default Table;
