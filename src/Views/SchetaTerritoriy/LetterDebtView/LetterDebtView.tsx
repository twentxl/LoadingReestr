import React, { useState, useEffect } from 'react';
import Popup from '../../../components/Popup/Popup';
import Loader from '../../../components/ui/Loader/Loader';
import { DateTimePicker } from '@mantine/dates';
import LookUpEdit from '../../../components/ui/LookUpEdit/LookUpEdit';
import { OutputSprav } from '../../../api/OutputSpravApi';
import { ExportFile, type ExportFileParams } from '../../../api/LetterDebtApi';
import { Button } from '@mantine/core';
import { formatDateTime } from '../../../helper/formatting';

interface initialValueParameters {
    date1: string | null;
    date2: string | null;
    mtr: number;
}
const initialValue: initialValueParameters = {
    date1: '',
    date2: '',
    mtr: 1
}

const memoAccessorKey = [
    { accessorKey: 'code', header: 'code', size: 50 },
    { accessorKey: 'name', header: 'name', size: 50 },
    { accessorKey: 'datebeg', header: 'datebeg', size: 50 },
    { accessorKey: 'dateend', header: 'dateend', size: 50 },
];

interface LetterDebtProps {
    visible: boolean;
    onClose: () => void;
}
const LetterDebtView: React.FC<LetterDebtProps> = ({ visible, onClose }) => {
    const [value, setValue] = useState<initialValueParameters>(initialValue);
    const [data, setData] = useState<any[]>([]);
    const [loaderVisible, setLoaderVisible] = useState<boolean>(false);

    const handleDateChange = (name: keyof initialValueParameters) => (date: Date | null) => {
        setValue(prev => ({ ...prev, [name]: date ? date.toISOString() : '' }));
    }
    const handleLookupChange = (name: keyof initialValueParameters) => (selectedVal: any) => {
        setValue(prev => ({ ...prev, [name]: selectedVal }));
    };

    const ExportFileClick = async() => {
        try {
            const params: ExportFileParams = {
                date1: formatDateTime(value.date1),
                date2: formatDateTime(value.date2),
                mtr: 1
            };
            setLoaderVisible(true);
            await ExportFile(params);
        }
        finally {
            setLoaderVisible(false);
        }
    };

    useEffect(() => {
        // const fetchData = async() => {
        //     const result = await OutputSprav(114, null);
        //     setData(result);
        // };
        // fetchData();
    }, [visible])

    return (
        <Popup title="Сведения о задолженности" visible={visible} onClose={onClose}>
            <Loader visible={loaderVisible} />
            <div style={{ width: '500px' }}>
                <DateTimePicker label="Дата с"
                                name="date1"
                                value={value.date1 ? new Date(value.date1) : null}
                                onChange={handleDateChange('date1')} />
                <DateTimePicker label="Дата по"
                                name="date2"
                                value={value.date2 ? new Date(value.date2) : null}
                                onChange={handleDateChange('date2')} />
                {/* <LookUpEdit label="Тер.страхования"
                            data={data}
                            memoAccessorKey={memoAccessorKey}
                            valueMember="code"
                            displayMember="name"
                            value={value.mtr}
                            onChange={handleLookupChange('mtr')} /> */}

                <div style={{ marginTop: '50px' }}>
                    <Button variant="default" onClick={ExportFileClick}>Сформировать</Button>
                </div>
            </div>
        </Popup>
    )
}

export default LetterDebtView;