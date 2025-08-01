import React, { useState, useEffect, useRef } from 'react';
import Popup from '../../../components/Popup/Popup';
import { TextInput, Button, Group } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import LookUpEdit from '../../../components/ui/LookUpEdit/LookUpEdit';
import { OutputSprav } from '../../../api/OutputSpravApi';

interface initialValueParameters {
    dateregistration1: string;
    dateregistration2: string;
    datezag1: string;
    datezag2: string;
    DSCHET1: string;
    DSCHET2: string;
    D_PLPR1: string;
    D_PLPR2: string;
    T_PLPR: string;
    N_PLPR: string;
    C_OKATO1: string;
    OKATO_OMS: string;
    NSCHET: string;
    DSCHET: string;
    schetStatus: string;
    type_d: string;
    namefilearh: string;
}

const initialValue: initialValueParameters = {
    dateregistration1: '',
    dateregistration2: '',
    datezag1: '',
    datezag2: '',
    DSCHET1: '',
    DSCHET2: '',
    D_PLPR1: '',
    D_PLPR2: '',
    T_PLPR: '',
    N_PLPR: '',
    C_OKATO1: '',
    OKATO_OMS: '',
    NSCHET: '',
    DSCHET: '',
    schetStatus: '',
    type_d: '',
    namefilearh: ''
};

const memoAccessorKey = [
    { accessorKey: 'code', header: 'Код', size: 50 },
    { accessorKey: 'name', header: 'Название', size: 50 },
    { accessorKey: 'datebeg', header: 'Дата начала', size: 50 },
    { accessorKey: 'dateend', header: 'Дата окончания', size: 50 },
];

interface MtrSchetSearchPopupProps {
    title: string;
    onClick?: (value: initialValueParameters) => void;
    visible: boolean;
    onClose: () => void;
}

const MtrSchetSearchPopup: React.FC<MtrSchetSearchPopupProps> = ({ title, onClick, visible, onClose }) => {
    const [value, setValue] = useState<initialValueParameters>(initialValue);
    const [data, setData] = useState<any[]>([]);

    const handleOk = () => {
        if (onClick) {
            onClick(value);
        }
    };

    const clearFields = () => {
        setValue(initialValue);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: inputValue } = event.currentTarget;
        setValue(prev => ({ ...prev, [name]: inputValue }));
    };

    const handleDateChange = (name: keyof initialValueParameters) => (date: Date | null) => {
        setValue(prev => ({ ...prev, [name]: date ? date.toISOString() : '' }));
    };

    const handleLookupChange = (name: keyof initialValueParameters) => (selectedVal: any) => {
        setValue(prev => ({ ...prev, [name]: selectedVal }));
    };

    useEffect(() => {
        const fetchData = async () => {
            const result = await OutputSprav(114, null);
            setData(result);
        };
        fetchData();
    }, [visible]);

    return (
        <Popup title={title} visible={visible} onClose={onClose}>
        <div style={{ display: 'flex', flexWrap: "wrap", justifyContent: "space-between", width: "1200px"}}>
            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", marginBottom: "20px" }}>
                <LookUpEdit
                    label="ОКАТО территории, выставившей счёт"
                    data={data}
                    memoAccessorKey={memoAccessorKey}
                    valueMember="code"
                    displayMember="name"
                    value={value.C_OKATO1}
                    onChange={handleLookupChange('C_OKATO1')}
                />
                <LookUpEdit
                    label="ОКАТО территории страхования"
                    data={data}
                    memoAccessorKey={memoAccessorKey}
                    valueMember="code"
                    displayMember="name"
                    value={value.OKATO_OMS}
                    onChange={handleLookupChange('OKATO_OMS')}
                />
                <TextInput
                    label="Номер счёта"
                    name="NSCHET"
                    value={value.NSCHET}
                    onChange={handleInputChange}
                />
                <DateTimePicker
                    label="Дата выставления счета"
                    name="DSCHET"
                    value={value.DSCHET ? new Date(value.DSCHET) : null}
                    onChange={handleDateChange('DSCHET')}
                />
                <DateTimePicker
                    label="Дата выставления счета c"
                    name="DSCHET1"
                    value={value.DSCHET1 ? new Date(value.DSCHET1) : null}
                    onChange={handleDateChange('DSCHET1')}
                />
                <DateTimePicker
                    label="Дата выставления счета по"
                    name="DSCHET2"
                    value={value.DSCHET2 ? new Date(value.DSCHET2) : null}
                    onChange={handleDateChange('DSCHET2')}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", marginBottom: "20px" }}>
                <TextInput
                    label="Номер платежного поручения"
                    name="N_PLPR"
                    value={value.N_PLPR}
                    onChange={handleInputChange}
                />
                <TextInput
                    label="Тип платежного поручения"
                    name="T_PLPR"
                    value={value.T_PLPR}
                    onChange={handleInputChange}
                />
                <DateTimePicker
                    label="Дата платежного поручения c"
                    name="D_PLPR1"
                    value={value.D_PLPR1 ? new Date(value.D_PLPR1) : null}
                    onChange={handleDateChange('D_PLPR1')}
                />
                <DateTimePicker
                    label="Дата платежного поручения по"
                    name="D_PLPR2"
                    value={value.D_PLPR2 ? new Date(value.D_PLPR2) : null}
                    onChange={handleDateChange('D_PLPR2')}
                />
                <TextInput
                    label="Тип реестра"
                    name="type_d"
                    value={value.type_d}
                    onChange={handleInputChange}
                />
                <TextInput
                    label="Статус счета"
                    name="schetStatus"
                    value={value.schetStatus}
                    onChange={handleInputChange}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: "space-between", width: "100%", marginBottom: "20px" }}>
                <DateTimePicker
                    label="Дата загрузки с"
                    name="datezag1"
                    value={value.datezag1 ? new Date(value.datezag1) : null}
                    onChange={handleDateChange('datezag1')}
                    style={{ width: '200px' }}
                />
                <DateTimePicker
                    label="Дата загрузки по"
                    name="datezag2"
                    value={value.datezag2 ? new Date(value.datezag2) : null}
                    onChange={handleDateChange('datezag2')}
                    style={{ width: '200px' }}
                />
                <DateTimePicker
                    label="Дата регистрации с"
                    name="dateregistration1"
                    value={value.dateregistration1 ? new Date(value.dateregistration1) : null}
                    onChange={handleDateChange('dateregistration1')}
                    style={{ width: '200px' }}
                />
                <DateTimePicker
                    label="Дата регистрации по"
                    name="dateregistration2"
                    value={value.dateregistration2 ? new Date(value.dateregistration2) : null}
                    onChange={handleDateChange('dateregistration2')}
                    style={{ width: '200px' }}
                />
                <TextInput
                    label="Наименование архива"
                    name="namefilearh"
                    value={value.namefilearh}
                    onChange={handleInputChange}
                    style={{ width: '200px' }}
                />
            </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <Group justify="center">
                <Button variant='default' onClick={handleOk}>OK</Button>
                <Button variant='default' onClick={clearFields}>Очистить поля</Button>
            </Group>
        </div>
    </Popup>
    );
};

export default MtrSchetSearchPopup;
