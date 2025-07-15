import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { formatDateTime } from "../../../helper/formatting";
import { Mtr1ResultSchet, Mtr1ExportExcel, DeleteRow, type Mtr1ResultSchetParams } from '../../../api/Mtr1ResultSchetApi';
import ContextMenu, { ContextMenuItem } from '../../../components/ui/ContextMenu/ContextMenu';
import Loader from "../../../components/ui/Loader/Loader";
import { Button } from '@mantine/core';
import MtrSchetSearchPopup from './MtrSchetSearchPopup';
import { IoSearch } from "react-icons/io5";
import { FcPrint, FcDatabase, FcAnswers, FcUpload, FcList, FcCalendar, FcDataSheet, FcSynchronize, FcKindle, FcFullTrash, FcPlus } from "react-icons/fc";

interface MtrSchetResultViewProps {
    typeIST: number;
}
const MtrSchetResultView: React.FC<MtrSchetResultViewProps> = ({ typeIST }) => {
    const [data, setData] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [activeRow, setActiveRow] = useState<any | null>(null);
    const [ visiblePopup, setVisiblePopup ] = useState<boolean>(true);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);


    const contentRef = useRef<HTMLDivElement | null>(null);
    const exportGridRef = useRef<any[]>([]);

    const fetchData = useCallback(async (popupValue: any) => {
        setLoaderVisible(true);
        try {
            const params: Mtr1ResultSchetParams = {
                typeIST: typeIST,
                dateregistration1: formatDateTime(popupValue.dateregistration1),
                dateregistration2: formatDateTime(popupValue.dateregistration2),
                datezag1: formatDateTime(popupValue.datezag1),
                datezag2: formatDateTime(popupValue.datezag2),
                DSCHET1: formatDateTime(popupValue.DSCHET1),
                DSCHET2: formatDateTime(popupValue.DSCHET2),
                D_PLPR1: formatDateTime(popupValue.D_PLPR1),
                D_PLPR2: formatDateTime(popupValue.D_PLPR2),
                T_PLPR: popupValue.T_PLPR,
                N_PLPR: popupValue.N_PLPR,
                C_OKATO1: popupValue.C_OKATO1,
                OKATO_OMS: popupValue.OKATO_OMS,
                NSCHET: popupValue.NSCHET,
                DSCHET: formatDateTime(popupValue.DSCHET),
                schetStatus: popupValue.schetStatus,
                type_d: popupValue.type_d,
                namefilearh: popupValue.namefilearh,
            };
            const result = await Mtr1ResultSchet(params);
            setData(result);
            exportGridRef.current = result;
        } catch (error) {
            alert(`Ошибка при загрузке данных: ${error}`)
            console.error("Ошибка при загрузке данных", error);
        } finally {
            setLoaderVisible(false);
        }
    }, [typeIST, setData]);

    const searchButton = () => {
        setVisiblePopup(true);
    };

    const resultClick = useCallback((newValue: any) => {
        if(contentRef.current && contentRef.current.style.display === "none") {
            contentRef.current.style.display = "block";
        }
        setVisiblePopup(false);
        fetchData(newValue);
    }, [fetchData]);

    const exportExcel = useCallback(async() => {
        try {
            setLoaderVisible(true);
            await Mtr1ExportExcel(exportGridRef.current);
        }
        finally {
            setLoaderVisible(false);
        }
    }, []);

    //Context menu onClick
    const DeleteSelectedRow = useCallback(async(idSCHETStatus: number) => {
        var result = confirm(`Вы действительно хотите удалить запись idSCHETStatus=${idSCHETStatus}?`);
        if(result) {
            await DeleteRow(idSCHETStatus);
            const filteredData = data.filter(item => item.idSCHETStatus !== idSCHETStatus);
            setData(filteredData);
            exportGridRef.current = filteredData;
        }
    }, [])
    //end Context menu onClick

    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            { accessorKey: 'name', header: 'Наименование статуса загрузки архива' },
            { accessorKey: 'comment_tfoms', header: 'Комментарий (ТФОМС)' },
            { accessorKey: 'block', header: 'блокировка счета' },
            { accessorKey: 'Mdate', header: 'Дата формирования уведомления' },
            { accessorKey: 'dateregistration', header: 'Дата регистрации' },
            { accessorKey: 'DATA_OPL_SCHET', header: 'Дата оплаты счета' },
            { accessorKey: 'yeardateregistration', header: 'Год регистарции' },
            { accessorKey: 'monthdateregistration', header: 'Месяц регистарции' },
            { accessorKey: 'gis', header: 'Источник файла' },
            { accessorKey: 'firstnamefile', header: 'имя основного файла' },
            { accessorKey: 'namefilearh', header: 'наименование архива' },
            { accessorKey: 'C_OKATO1', header: 'Код территории,выставившей счет' },
            { accessorKey: 'subname', header: 'Наименование территории,выставившей счет' },
            { accessorKey: 'OKATO_OMS', header: 'Код ОКАТО территории страховани по ОМС (территория в которую выставляется счет)' },
            { accessorKey: 'CODE_TF', header: 'Код ТФОМС' },
            { accessorKey: 'subname1', header: 'Наименование территории страховани по ОМС (территория в которую выставляется счет)' },
            { accessorKey: 'YEAR', header: 'Отчетный год в файле (терр.)' },
            { accessorKey: 'MONTH', header: 'Отчетный месяц в файле (терр.)' },
            { accessorKey: 'NSCHET', header: 'Номер счёта (терр.)' },
            { accessorKey: 'DSCHET', header: 'Дата выставления счета (терр.)' },
            { accessorKey: 'SD_Z', header: 'К-во поданных случаев (терр.)' },
            { accessorKey: 'SD_Zopl', header: 'К-во принятых случаев (ТФОМС)' },
            { accessorKey: 'SD_Zerror', header: 'К-во отклоненых случаев  (ТФОМС) ' },
            { accessorKey: 'SUMMAV', header: 'Сумма счета выставленная на оплату (терр.)' },
            { accessorKey: 'SUMMAP', header: 'Сумма принята к оплате (терр.)' },
            { accessorKey: 'SANK_MEK_MEE_EKMP', header: 'Санкции МЭК,МЭЭ,ЭКМП (терр.)' },
            { accessorKey: 'SUMMAP_tf', header: 'Сумма принята к оплате (ТФОМС)' },
            { accessorKey: 'SANK_MEK_tf', header: 'Санкции МЭК (ТФОМС)' },
            { accessorKey: 'SANK_MEE_EKMP', header: 'Санкции МЭЭ,ЭКМП (ТФОМС)' },
            { accessorKey: 'sum_schopl', header: 'Сумма оплаченная по бух' },
            { accessorKey: 'sum_schvzvr', header: 'Сумма возврата по бух' },
            { accessorKey: 'sum_itogo', header: 'Сумма оплаченная по бух. с учетом возврата' },
            { accessorKey: 'FILENAME_A', header: 'Наименование файла А' },
            { accessorKey: 'DATE_ACT', header: 'Дата заключения ТФОМС' },
            { accessorKey: 'NUM_ACT', header: 'Номер заключения ТФОМС' },
            { accessorKey: 'PLname', header: 'Наименование файла PL' },
            { accessorKey: 'AFerror', header: 'Наименование ошибки АК/ФК' },
            { accessorKey: 'idSCHET', header: 'идентификатор счета ТФОМС ' },
            { accessorKey: 'idSCHETStatus', header: 'идентификатор загруженного архива ' },
            { accessorKey: 'ERRORcontrol', header: 'Ошибка при загрузке файла' },
          ], []
    );

    const table = useMantineReactTable({
        columns,
        data,
        enableColumnActions: true,
        enableColumnFilters: true,
        enableSorting: true,
        // enableStickyHeader: true,
        mantineTableProps: {
            withColumnBorders: true,
        },
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

      useEffect(() => {
        if(contentRef.current) { contentRef.current.style.display = "none"; }
      }, []);

    return (
        <>
            <ContextMenu area={contentRef}>
                <ContextMenuItem text="Законченные случаи" icon={FcDatabase}/>
                <ContextMenuItem text="Сведения об оплате счета у бухгалтерии" icon={FcAnswers}/>
                <ContextMenuItem text="Запрос в ФЕРЗЛ" icon={FcUpload}/>
                <ContextMenuItem text="Развернутая информация о счёте" icon={FcList}/>
                <ContextMenuItem text="Присвоить дату" icon={FcCalendar}/>
                <ContextMenuItem text="Сведения о плат. пор." icon={FcDataSheet}/>
                <ContextMenuItem text="Выгрузка данных" icon={FcKindle}/>
                <ContextMenuItem text="Провести повторный МЭК" icon={FcSynchronize}/>
                <ContextMenuItem text="Удалить счет" icon={FcFullTrash} onClick={() => DeleteSelectedRow(selectedRow.getValue("idSCHETStatus"))}/>
                <ContextMenuItem text="Добавить комментарий к счету" icon={FcPlus}/>
                <ContextMenuItem text="Добавить случай" icon={FcPlus}/>
            </ContextMenu>
            <div>
                <Button variant='default' leftIcon={<IoSearch />} onClick={searchButton}>Поиск</Button>
                <MtrSchetSearchPopup title="Работа со счетами" visible={visiblePopup} onClose={() => setVisiblePopup(false)} onClick={resultClick}/>
            </div>
            <div ref={contentRef}>
                <Loader visible={loaderVisible} />
                <MantineReactTable table={table} />
            </div>
        </>
    )
};

export default MtrSchetResultView;