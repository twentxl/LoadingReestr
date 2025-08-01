import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { type MRT_ColumnDef } from 'mantine-react-table';
import Table from '../../../components/Table/Table';
import { formatDateTime } from "../../../helper/formatting";
import { Mtr1ResultSchet, Mtr1ExportExcel, DeleteRow, type Mtr1ResultSchetParams } from '../../../api/Mtr1ResultSchetApi';
import ContextMenu, { ContextMenuItem } from '../../../components/ContextMenu/ContextMenu';
import Loader from "../../../components/ui/Loader/Loader";
import { Button } from '@mantine/core';
import MtrSchetSearchPopup from './MtrSchetSearchPopup';
import { IoSearch } from "react-icons/io5";
import { Checkbox } from '@mantine/core';
import { FcPrint, FcDatabase, FcAnswers, FcUpload, FcList, FcCalendar, FcDataSheet, FcSynchronize, FcKindle, FcFullTrash, FcPlus } from "react-icons/fc";
import SegmentDetailWindow from '../../OtherComponents/SegmentDetailWindow/SegmentDetailWindow';

interface MtrSchetResultViewProps {
    typeIST: number;
}
const MtrSchetResultView: React.FC<MtrSchetResultViewProps> = ({ typeIST }) => {
    const [data, setData] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [activeRow, setActiveRow] = useState<any | null>(null);
    const [visiblePopup, setVisiblePopup] = useState<boolean>(true);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);
    const [segmentVisible, setSegmentVisible] = useState<boolean>(false);
    const [segmentData, setSegmentData] = useState<any[]>([{"FieldName": "нет данных", "Value": "нет данных"}]);

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

    const columns: MRT_ColumnDef<any>[] = useMemo(
        () => [
            { accessorKey: 'name', header: 'Наименование статуса загрузки' },
            { accessorKey: 'comment_tfoms', header: 'Комментарий' },
            { accessorKey: 'block', header: 'Блокировка счета', Cell: ({ cell }) => ( <Checkbox checked={cell.getValue<boolean>()} readOnly /> ), },
            { accessorKey: 'Mdate', header: 'Дата формирования уведомления' },
            { accessorKey: 'dateregistration', header: 'Дата регистрации' },
            { accessorKey: 'DATA_OPL_SCHET', header: 'Дата оплаты счета' },
            { accessorKey: 'yeardateregistration', header: 'Год регистрации' },
            { accessorKey: 'monthdateregistration', header: 'Месяц регистрации' },
            { accessorKey: 'gis', header: 'Источник файла' },
            { accessorKey: 'firstnamefile', header: 'Наименование основного файла' },
            { accessorKey: 'namefilearh', header: 'Наименование архива' },
            { accessorKey: 'C_OKATO1', header: 'ОКАТО терр. выст. счет' },
            { accessorKey: 'subname', header: 'Наименование терр., выставившей счет' },
            { accessorKey: 'OKATO_OMS', header: 'Код ОКАТО терр. страх. по ОМС' },
            { accessorKey: 'CODE_TF', header: 'Код ТФОМС' },
            { accessorKey: 'subname1', header: 'Наименование терр. страх. по ОМС' },
            { accessorKey: 'YEAR', header: 'Отчетный год (ТО МП)' },
            { accessorKey: 'MONTH', header: 'Отчетный месяц(ТО МП)' },
            { accessorKey: 'NSCHET', header: 'Номер счёта (ТО МП)' },
            { accessorKey: 'DSCHET', header: 'Дата выставления счета (ТО МП)' },

            { accessorKey: 'SD_Z', header: 'К-во поданных случаев (ТО МП)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SD_Z ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            } },

            { accessorKey: 'SD_Zopl', header: 'К-во принятых случаев (ТС)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SD_Zopl ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            }},
            { accessorKey: 'SD_Zerror', header: 'К-во отклоненых случаев  (ТС)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SD_Zerror ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            }},
            { accessorKey: 'SUMMAV', header: 'Сумма счета выставленная на оплату (ТО МП)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SUMMAV ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            }},
            { accessorKey: 'SUMMAP', header: 'Сумма принята к оплате (ТО МП)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SUMMAP ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            }},
            { accessorKey: 'SANK_MEK_MEE_EKMP', header: 'Санкции МЭК,МЭЭ,ЭКМП (ТО МП)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SANK_MEK_MEE_EKMP ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            }},
            { accessorKey: 'SUMMAP_tf', header: 'Сумма принята к оплате (ТС)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SUMMAP_tf ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            }},
            { accessorKey: 'SANK_MEK_tf', header: 'Санкции МЭК (ТС)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SANK_MEK_tf ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            }},
            { accessorKey: 'SANK_MEE_EKMP', header: 'Санкции МЭЭ,ЭКМП (ТС)', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.SANK_MEE_EKMP ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            } },
            { accessorKey: 'sum_schopl', header: 'Сумма оплаченная по бух', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.sum_schopl ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            } },
            { accessorKey: 'sum_schvzvr', header: 'Сумма возврата по бух', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.sum_schvzvr ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            } },
            { accessorKey: 'sum_itogo', header: 'Сумма оплаченная по бух. с учетом возврата', Footer: ({ table }) => {
                const allRows = table.getPrePaginationRowModel().rows;
                const total = allRows.reduce((sum, row) => sum + (row.original.sum_itogo ?? 0), 0);
                const formatted = total.toLocaleString('ru-RU');
                return `Итог = ${formatted}`;
            } },
            { accessorKey: 'FILENAME_A', header: 'Наименование файла А' },
            { accessorKey: 'DATE_ACT', header: 'Дата заключения ТФОМС' },
            { accessorKey: 'NUM_ACT', header: 'Номер заключения ТФОМС' },
            { accessorKey: 'PLname', header: 'Наименование файла PL' },
            { accessorKey: 'AFerror', header: 'Наименование ошибки АК/ФК' },
            { accessorKey: 'idSCHET', header: 'идентификатор счета ТФОМС ' },
            { accessorKey: 'idSCHETStatus', header: 'идентификатор загруженного архива ' },
            { accessorKey: 'ERRORcontrol', header: 'Ошибка при загрузке файла'},
          ], []
    );

    const headerColors: any = {
        YEAR: '#b2eefc',
        MONTH: '#b2eefc',
        NSCHET: '#b2eefc',
        DSCHET: '#b2eefc',
        SD_Z: '#b2eefc',
        SUMMAV: '#b2eefc',
        SUMMAP: '#b2eefc',
        SANK_MEK_MEE_EKMP: '#b2eefc',

        SD_Zopl: '#b9faab',
        SD_Zerror: '#b9faab',
        SUMMAP_tf: '#b9faab',
        SANK_MEK_tf: '#b9faab',
        SANK_MEE_EKMP: '#b9faab',
        DATE_ACT: '#b9faab',
        NUM_ACT: '#b9faab',

        sum_schopl: "#fdc3ff",
        sum_schvzvr: "#fdc3ff",
        sum_itogo: "#fdc3ff",
    };

    const headCell = ({ column }: { column: any }) => ({
        style: {
          backgroundColor: headerColors[column.id] || '#f5f5f5',
        }
    });
    const bodyCell = ({ row }: { row: any }) => {
        const isActive = activeRow?.id === row.id;
        const errorValue: boolean = row.original.ERRORcontrol == 1;
        return {
          style: {
            backgroundColor: isActive ? '#dee2e6' : (errorValue ? '#ed7777' : 'inherit'),
          },
        };
    };
    const bodyRow = ({ row }: {row: any}) => ({
        onContextMenu: (event: any) => { 
            event.preventDefault();
            setSelectedRow(row);
            setActiveRow(row);
          },
          onClick: () => {
            setActiveRow(null);
          }
    });
    const topToolbar = () => (
        <>
        <Button variant='default' leftIcon={<FcPrint />} onClick={exportExcel}>Сохранить в Excel</Button>
        </>
    );

    //start Context menu onClick
    const DeleteSelectedRow = useCallback(async(idSCHETStatus: number) => {
        var result = confirm(`Вы действительно хотите удалить запись idSCHETStatus=${idSCHETStatus}?`);
        if(result) {
            await DeleteRow(idSCHETStatus);
            const filteredData = data.filter(item => item.idSCHETStatus !== idSCHETStatus);
            setData(filteredData);
            exportGridRef.current = filteredData;
        }
    }, []);
    const GetRowSegmentInfo = useCallback(async(row: any) => {
        setSegmentVisible(true);
        const result: any[] = Object.keys(row).map(key => ({ "FieldName": key, "Value": row[key as keyof typeof row] }));
        setSegmentData(result);
    }, [setSegmentVisible])
    //end Context menu onClick

      useEffect(() => {
        if(contentRef.current) { contentRef.current.style.display = "none"; }
      }, []);

    return (
        <>
            <ContextMenu area={contentRef}>
                <ContextMenuItem text="Законченные случаи" icon={FcDatabase}/>
                <ContextMenuItem text="Сведения об оплате счета у бухгалтерии" icon={FcAnswers}/>
                <ContextMenuItem text="Запрос в ФЕРЗЛ" icon={FcUpload}/>
                <ContextMenuItem text="Развернутая информация о счёте" icon={FcList} onClick={() => GetRowSegmentInfo(selectedRow.original)}/>
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
                <Table columns={columns} data={data} pageSize={100} containerHeight={70} headCellProps={headCell} bodyCellProps={bodyCell} bodyRowProps={bodyRow} topToolbarCustomActions={topToolbar} />
            </div>
            <SegmentDetailWindow visible={segmentVisible} onClose={() => setSegmentVisible(false)} data={segmentData}/>
        </>
    )
};

export default MtrSchetResultView;