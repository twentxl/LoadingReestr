import React, { useState, useRef, useCallback, useMemo } from 'react';
import ResultNSISearch from './ResultNSISearch';
import ContextMenu, { ContextMenuItem } from '../../../components/ContextMenu/ContextMenu';
import { PostTable, ExportExcel, DeleteRow } from '../../../api/NsiApi';
import { Button } from '@mantine/core';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import Loader from '../../../components/ui/Loader/Loader';
import { FcDeleteRow } from "react-icons/fc";
import { FcPrint } from 'react-icons/fc';

const ResultNSIView = () => {
    const [data, setData] = useState<any[]>([]);
    const [keyList, setKeyList] = useState([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [activeRow, setActiveRow] = useState<any | null>(null);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);

    const contentRef = useRef<HTMLDivElement | null>(null);
    const nametableRef = useRef<string>(null);

    const fetchData = useCallback(async(getValue: any) => {
        setLoaderVisible(true);
        try {
            let keyListArray: any = [];
            const result = await PostTable(getValue.nametable);
            nametableRef.current = getValue.nametable;
            for(var i in result){
                var val = result[i];
                for(var j in val){
                    var sub_key = j;
                    if(!keyListArray.includes(sub_key) && sub_key !== "id") {
                        keyListArray.push(sub_key);
                    }
                }
            }
            setData(result);
            setKeyList(keyListArray);
        }
        catch(error) {
            alert(`Ошибка при загрузке данных: ${error}`)
            console.error("Ошибка при загрузке данных", error);
        }
        finally {
            setLoaderVisible(false);
        }
    }, [setData, setKeyList]);

    const resultClick = useCallback((value: any) => {
        if(contentRef.current && contentRef.current.style.display === "none") {
            contentRef.current.style.display = "block";
        }
        fetchData(value);
    }, [fetchData]);

    const exportExcel = useCallback(async() => {
        try {
            setLoaderVisible(true);
            if(nametableRef.current) { await ExportExcel(nametableRef.current); }
        }
        catch(error) {
            console.error(error);
        }
        finally {
            setLoaderVisible(false);
        }
    }, [])

    const columns = useMemo(
        () => keyList.map(item => ({ accessorKey: item, header: item })),
        [keyList]
    );

    const DeleteSelectedRow = useCallback(async(idRow: string) => {
        const result = confirm("Вы уверены, что хотите удалить данный элемент?");
        if(result) {
            if(nametableRef.current) { 
                await DeleteRow(nametableRef.current, idRow.toString());
                const filteredData = data.filter(item => item.id !== idRow);
                setData(filteredData);
            }
        }
    }, []);

    const table = useMantineReactTable({
        columns,
        data,
        enableEditing: true,
        enableColumnActions: true,
        enableColumnFilters: true,
        enableSorting: true,
        enableStickyHeader: true,
        mantineTableContainerProps: {
            style: {
                height: '65vh',
                maxHeight: '65vh',
                overflowY: 'auto'
            }
        },
        
        mantineTableProps: {
            withColumnBorders: true,
            sx: {
                'thead > tr': { backgroundColor: 'd8d8d8', },
                'thead > tr > th': { backgroundColor: 'd8d8d8', },
                'tbody > tr > td': { backgroundColor: 'd8d8d8', },
            },
        },
        mantineTableHeadCellProps: () => ({
            style: {
              backgroundColor: '#f5f5f5',
            }
        }),

        mantineTableBodyRowProps: ({ row }) => ({
            onContextMenu: (event) => { 
                event.preventDefault();
                setSelectedRow(row);
                setActiveRow(row);
              },
              onClick: () => {
                setActiveRow(null);
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

    React.useEffect(() => {
        if(contentRef.current) { contentRef.current.style.display = "none"; }
    }, []);

    return (
        <>
            <ContextMenu area={contentRef}>
                <ContextMenuItem text="Удалить" icon={FcDeleteRow} onClick={() => DeleteSelectedRow(selectedRow.original.id)}/>
            </ContextMenu>
            <div>
                <ResultNSISearch onClick={resultClick}/>
            </div>
            <div ref={contentRef}>
                <Loader visible={loaderVisible}/>
                <MantineReactTable table={table} />
            </div>
        </>
    )
};

export default ResultNSIView;