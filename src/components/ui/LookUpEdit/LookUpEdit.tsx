import React, { useMemo, useState } from 'react';
import { Popover, TextInput } from '@mantine/core';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';

interface LookUpEditProps {
    label?: string;
    data: Array<any>;
    width?: string;
    memoAccessorKey: Array<any>;
    displayMember?: string | "null";
    valueMember: string;
    value: any;
    onChange: any;
}
const LookUpEdit: React.FC<LookUpEditProps> = ({ label, data, width, memoAccessorKey, displayMember, valueMember, value, onChange }) => {
    const [selectedValue, getSelectedValue] = useState(null);
    const [selectedDisplay, getSelectedDisplay] = useState(null);

    //TODO: пример memoAccessorKey value
    // const memoAccessorKey = [
    //     { accessorKey: 'code', header: 'code', size: 50, },
    //     { accessorKey: 'name', header: 'name', size: 50,},
    //     { accessorKey: 'datebeg', header: 'datebeg', size: 50,},
    //     { accessorKey: 'dateend', header: 'dateend', size: 50,},
    // ]; 
    const columns = useMemo(
        () => memoAccessorKey, [memoAccessorKey]);

    const handleRowClick = (row: any) => {
        const getValue = row.getValue(`${valueMember}`);
        const getDisplay = row.getValue(`${displayMember}`)
        getSelectedValue(getValue);
        getSelectedDisplay(getDisplay);
        if (onChange) {
            onChange(getValue);
          }
    };

    React.useEffect(() => {
        getSelectedValue(value)
    }, []);

    const table = useMantineReactTable({
        columns,
        data,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: false,
        //enableStickyHeader: true,
        mantineTableProps: {
            withColumnBorders: true,
            sx: {
                'thead > tr': { backgroundColor: '#d8d8d8', },
                'thead > tr > th': { backgroundColor: '#d8d8d8', },
                'tbody > tr > td': { backgroundColor: '#d8d8d8', },
            },
        },
        mantineTableBodyRowProps: ({ row }) => ({
            onClick: () => {
              handleRowClick(row);
            },
        }),
        mantineTableBodyCellProps: ({ row }) => {
            const dateendValueNotEnd = row.original.dateend == '2222-01-01'
            const dateendIsExists = row.original.dateend;
            return {
                style: {
                    backgroundColor: 'inherit',
                    color: dateendIsExists ? (!dateendValueNotEnd ? '#f00' : 'inherit') : 'inherit',
                }
            }
        },
        mantineTableHeadCellProps: () => ({
            style: {
              backgroundColor: '#f5f5f5',
            }
        }),
    });

    return (
        <Popover width={500} trapFocus position="bottom" withArrow shadow="md">
            <Popover.Target>
                <TextInput style={{ width: `${width}px`}} label={label} placeholder="Выберите необходимые значения" value={selectedDisplay || ''} readOnly/>
            </Popover.Target>
            <Popover.Dropdown>
                <div style={{ height: '300px', overflowY: 'auto' }}>
                    <MantineReactTable table={table}/>
                </div>
            </Popover.Dropdown>
        </Popover>
    )
};

export default LookUpEdit;