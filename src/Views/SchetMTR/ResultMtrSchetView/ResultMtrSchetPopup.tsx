import React, { useState, useEffect } from 'react';
import Popup from '../../../components/Popup/Popup';
import { Button, TextInput, Group, Grid } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import LookUpEdit from '../../../components/ui/LookUpEdit/LookUpEdit';
import { NativeSelect } from '@mantine/core';
import { OutputSprav } from '../../../api/OutputSpravApi';

// _MecSelectSchet procedure 2,2

interface initialValueParameters {
    MONTH1: string;
    MONTH2: string;
    YEAR: string;
    code_mo: string;
    source: string;
    date1: string;
    date2: string;
}
const initialValue: initialValueParameters = {
    MONTH1: '',
    MONTH2: '',
    YEAR: '',
    code_mo: '',
    source: '',
    date1: '',
    date2: '',
}
const memoAccessorKey = [
    { accessorKey: 'code', header: 'code', size: 50 },
    { accessorKey: 'name', header: 'name', size: 50 },
    { accessorKey: 'datebeg', header: 'datebeg', size: 50 },
    { accessorKey: 'dateend', header: 'dateend', size: 50 },
];
interface ResultMtrSchetPopupProps {
    title: string;
    onClick?: (value: initialValueParameters) => void;
    visible: boolean;
    onClose: () => void;
}
const ResultMtrSchetPopup: React.FC<ResultMtrSchetPopupProps> = ({ title, onClick, visible, onClose }) => {
    const months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

    const [value, setValue] = useState<initialValueParameters>(initialValue);
    const [month1Index, setMonth1Index] = useState<number | null>(null);
    const [month2Index, setMonth2Index] = useState<number | null>(null);
    const [dataMO, setDataMO] = useState<any[]>([]);
    const [dataSMO, setDataSMO] = useState<any[]>([]);

    const handleNative1Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value: selectedMonth } = event.currentTarget;
        setValue(prev => ({ ...prev, [name]: selectedMonth }));
      
        const index = months.indexOf(selectedMonth);
        if (index !== -1) { setMonth1Index(index); }
        else { setMonth1Index(null); }
    };
    const handleNative2Change = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value: selectedMonth } = event.currentTarget;
        setValue(prev => ({ ...prev, [name]: selectedMonth }));
      
        const index = months.indexOf(selectedMonth);
        if (index !== -1) { setMonth2Index(index); }
        else { setMonth2Index(null); }
    };
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value: inputValue } = event.currentTarget;
        setValue(prev => ({ ...prev, [name]: inputValue }));
    };
    const handleDateChange = (name: keyof initialValueParameters) => (date: Date | null) => {
        setValue(prev => ({ ...prev, [name]: date ? date.toISOString() : '' }));
    };
    const handleLookupChange = (name: keyof initialValueParameters) => (selectedVal: any) => {
        setValue(prev => ({ ...prev, [name]: selectedVal }));
    };

    const handleOk = () => {
        if(onClick) { onClick(value) }
    }
    const clearFields = () => {
        setValue(initialValue);
    };

    useEffect(() => {
        const fetchData = async() => {
            const resultMO = await OutputSprav(1, 2);
            const resultSMO = await OutputSprav(2, 6);
            setDataMO(resultMO);
            setDataSMO(resultSMO);
        }
        fetchData();
    }, [])
    
    return (
        <Popup title={title} visible={visible} onClose={onClose}>
            <Grid columns={12}>
                <Grid.Col span={5}>
                <LookUpEdit
                    width='300'
                    label="Наименование МО"
                    data={dataMO}
                    memoAccessorKey={memoAccessorKey}
                    valueMember="code"
                    displayMember="name"
                    value={value.code_mo}
                    onChange={handleLookupChange('code_mo')}
                />
                <LookUpEdit
                    width='300'
                    label="Наименование СМО"
                    data={dataSMO}
                    memoAccessorKey={memoAccessorKey}
                    valueMember="code"
                    displayMember="name"
                    value={value.source}
                    onChange={handleLookupChange('source')}
                />
                </Grid.Col>
                <Grid.Col span={7} style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <NativeSelect
                        style={{ marginRight: '15px' }}
                        data={months}
                        label="Месяц начала отчетного периода"
                        name="MONTH1"
                        value={value.MONTH1}
                        onChange={handleNative1Change}
                        withAsterisk
                    />
                    <NativeSelect
                        style={{ marginRight: '15px' }}
                        data={months}
                        label="Месяц окончания отчетного периода"
                        name="MONTH2"
                        value={value.MONTH2}
                        onChange={handleNative2Change}
                        withAsterisk
                    />
                    <TextInput 
                        style={{ width: '100px', marginRight: '15px' }}
                        label="Отчетный год"
                        name="YEAR"
                        value={value.YEAR}
                        onChange={handleInputChange}
                        withAsterisk
                        />
                    <DateTimePicker 
                        style={{ width: '150px', marginRight: '15px' }}
                        label="Период загрузки с"
                        name="date1"
                        value={value.date1 ? new Date(value.date1) : null}
                        onChange={handleDateChange('date1')}
                        />
                    <DateTimePicker 
                        style={{ width: '150px', marginRight: '15px' }}
                        label="Период загрузки по"
                        name="date2"
                        value={value.date2 ? new Date(value.date2) : null}
                        onChange={handleDateChange('date2')}
                        />
                </Grid.Col>
            </Grid>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                <Group justify="center">
                    <Button variant='default' onClick={handleOk}>OK</Button>
                    <Button variant='default' onClick={clearFields}>Очистить поля</Button>
                </Group>
            </div>
        </Popup>
    )
};

export default ResultMtrSchetPopup;