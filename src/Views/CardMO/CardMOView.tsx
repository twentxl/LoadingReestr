import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import Loader from '../../components/ui/Loader/Loader';
import Table from '../../components/Table/Table';
import { GetTF_003, ExportExcel } from '../../api/CardMOApi';
import { type MRT_ColumnDef } from 'mantine-react-table';
import { Button } from '@mantine/core';
import { FcPrint } from 'react-icons/fc';

const CardMOView = () => {
    const [data, setData] = useState<any[]>([]);
    const [selectedRow, setSelectedRow] = useState<any | null>(null);
    const [activeRow, setActiveRow] = useState<any | null>(null);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);

    const CardMOTF_LPU1View = React.lazy(() => import('./CardMOTF_LPU1View'));

    const exportGridRef = useRef<any[] | null>(null);

    const fetchData = useCallback(async() => {
        setLoaderVisible(true);
        try {
            const result = await GetTF_003();
            setData(result);
            exportGridRef.current = result;
        }
        finally {
            setLoaderVisible(false);
        }
    }, [setData]);

    const CardMOExportExcel = useCallback(async() => {
        setLoaderVisible(true);
        try { await ExportExcel(exportGridRef.current) }
        finally {
          setLoaderVisible(false);
        }
    }, [])

    const columns: MRT_ColumnDef<any>[] = useMemo(() => [
        { accessorKey: "code_mo", header: "Код МО" },
        { accessorKey: "nam_mok", header: "Наименование МО (краткое)" },
        { accessorKey: "nam_mop", header: "Наименование МО (полное)" },
        { accessorKey: "inn", header: "ИНН" },
        { accessorKey: "Ogrn", header: "ОГРН" },
        { accessorKey: "KPP", header: "КПП" },
        { accessorKey: "datebeg", header: "Дата начала действия" },
        { accessorKey: "dateend", header: "Дата окончания действия" },
        { accessorKey: "tf_okato", header: "ОКАТО" },
        { accessorKey: "index_j", header: "Почтовый индекс адресата" },
        { accessorKey: "addr_j", header: "Адрес" },
        { accessorKey: "okopf", header: "ОКПФ" },
        { accessorKey: "idF007_Vedom", header: "Вед. принадлежность", },
        { accessorKey: "idR008_Glmo", header: "Признак подчиненности", },
        { accessorKey: "fam_ruk", header: "Фамилия руководителя" },
        { accessorKey: "im_ruk", header: "Имя руководителя" },
        { accessorKey: "ot_ruk", header: "Отчество руководителя" },
        { accessorKey: "phone", header: "Телефон" },
        { accessorKey: "fax", header: "Факс" },
        { accessorKey: "e_mail", header: "Адрес электронной почты" },
        { accessorKey: "www", header: "Сайт" },
        { accessorKey: "fio_obr", header: "Фамилия для письма" },
        { accessorKey: "idV005_Pol", header: "Пол руководителя", },
        { accessorKey: "okfs", header: "Форма собственности", },
        { accessorKey: "idTFOMS_groupTF_F003", header: "Группа МО", },
        { accessorKey: "idTfomsPRIKREPMO", header: "Тип прикрепления",},
        { accessorKey: "OKTMO", header: "OKTMO" },
        { accessorKey: "OID", header: "OID" },
    ], []); 

    const headCell = () => ({
      style: {
        backgroundColor: '#f5f5f5',
      }
    });
    const bodyCell = ({ row }: {row: any}) => {
        const isActive = activeRow?.id === row.id;
        const dateendValueNotEnd = row.original.dateend == '2222-01-01';
        return {
          style: {
            backgroundColor: isActive ? '#dee2e6' : 'inherit',
            color: !dateendValueNotEnd ? '#f00' : 'inherit',
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
      })
      const topToolbar = () => (
        <Button variant='default' leftIcon={<FcPrint />} onClick={CardMOExportExcel}>
          Сохранить в Excel
        </Button>
      )
      const renderPanel = ({ row }: {row:any}) => {
          return (
            <Suspense fallback={<div>Загрузка...</div>}>
              <CardMOTF_LPU1View idTF_F003={row.original.id.toString()} />
            </Suspense>
          );
        }

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <>
            <Loader visible={loaderVisible}/>
            <Table columns={columns} 
                  data={data} 
                  pageSize={10} 
                  containerHeight={70} 
                  headCellProps={headCell} 
                  bodyCellProps={bodyCell} 
                  bodyRowProps={bodyRow} 
                  topToolbarCustomActions={topToolbar} 
                  renderDetail={renderPanel}/>
        </>
    )
};

export default CardMOView;