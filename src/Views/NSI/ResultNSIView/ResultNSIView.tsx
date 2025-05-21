import React, { useState, useRef, useCallback, useMemo } from 'react';
import ResultNSISearchPopup from '../ResultNSISearchPopup/ResultNSISearchPopup';
import ContextMenu, { ContextMenuItem } from '../../../components/ui/ContextMenu/ContextMenu';
import { PostTable, ExportExcel, DeleteRow } from '../../../api/NsiApi';
import { Button } from '@mantine/core';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import Loader from '../../../components/ui/Loader/Loader';
import { IoSearch } from 'react-icons/io5';
import { FcDeleteRow } from "react-icons/fc";
import { FcPrint } from 'react-icons/fc';

const ResultNSIView = () => {
    const [data, setData] = useState<any[]>([]);
    const [keyList, setKeyList] = useState([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);

    const popupNsiSearchRef = useRef<HTMLDivElement | null>(null);
    const loaderRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const nametableRef = useRef<string>(null);

    const searchButton = () => {
        if(popupNsiSearchRef.current) { popupNsiSearchRef.current.style.display = "flex"; }
    };

    const fetchData = useCallback(async(getValue: any) => {
        if(loaderRef.current) {
            loaderRef.current.style.display = "flex";
        }
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
            if(loaderRef.current) {
                loaderRef.current.style.display = "none";
            }
        }
    }, [setData, setKeyList]);

    const resultClick = useCallback((value: any) => {
        if(contentRef.current && contentRef.current.style.display === "none") {
            contentRef.current.style.display = "block";
        }
        if(popupNsiSearchRef.current) { popupNsiSearchRef.current.style.display = "none"; }
        fetchData(value);
    }, [fetchData]);

    const exportExcel = useCallback(async() => {
        try {
            if(loaderRef.current) {
                loaderRef.current.style.display = "flex";
            }
            if(nametableRef.current) { await ExportExcel(nametableRef.current); }
        }
        catch(error) {
            console.error(error);
        }
        finally {
            if(loaderRef.current) {
                loaderRef.current.style.display = "none";
            }
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
        mantineTableProps: {
            withColumnBorders: true,
        },
        mantineTableBodyRowProps: ({ row }) => ({
            onContextMenu: (event) => {
                event.preventDefault();
                setSelectedRow(row);
            }
        }),
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
                <Button variant='default' leftIcon={<IoSearch />} onClick={searchButton}>Поиск</Button>
                <ResultNSISearchPopup ref={popupNsiSearchRef} onClick={resultClick}/>
            </div>
            <div ref={contentRef}>
                <Loader ref={loaderRef}/>
                <MantineReactTable table={table} />
            </div>
        </>
    )
};

export default ResultNSIView;