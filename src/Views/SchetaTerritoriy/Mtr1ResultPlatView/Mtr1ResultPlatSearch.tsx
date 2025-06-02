import React, { useState } from 'react';
import { DateTimePicker } from '@mantine/dates';
import { TextInput, Button } from '@mantine/core';

interface initialValueParameters {
    D_PLPR1: string;
    D_PLPR2: string;
    N_PLPR: string;
    DATA_OPL1: string;
    DATA_OPL2: string;
}
const initialValue: initialValueParameters = {
    D_PLPR1: '',
    D_PLPR2: '',
    N_PLPR: '',
    DATA_OPL1: '',
    DATA_OPL2: '',
}

interface Mtr1ResultPlatSearchProps {
    onClick?: (value: initialValueParameters) => void;
}
const Mtr1ResultPlatSearch: React.FC<Mtr1ResultPlatSearchProps> = ({ onClick }) => {
    const [value, setValue] = useState<initialValueParameters>(initialValue);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: inputValue } = event.currentTarget;
        setValue(prev => ({ ...prev, [name]: inputValue }));
    };
    const handleDateChange = (name: keyof initialValueParameters) => (date: Date | null) => {
        setValue(prev => ({ ...prev, [name]: date ? date.toISOString() : '' }));
    };

    const handleOk = () => {
        if(onClick) { onClick(value) }
    }
    const handleClear = () => {
        setValue(initialValue);
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px 0', backgroundColor: '#f0f0f0' }}>
            <DateTimePicker 
                style={{ marginRight: '15px' }}
                label="Дата платежного поручения с"
                name="D_PLPR1"
                value={value.D_PLPR1 ? new Date(value.D_PLPR1) : null}
                onChange={handleDateChange('D_PLPR1')}
            />
            <DateTimePicker 
                style={{ marginRight: '15px' }}
                label="Дата платежного поручения по"
                name="D_PLPR2"
                value={value.D_PLPR2 ? new Date(value.D_PLPR2) : null}
                onChange={handleDateChange('D_PLPR2')}
            />
            <DateTimePicker 
                style={{ marginRight: '15px' }}
                label="Дата фактической оплаты с"
                name="DATA_OPL1"
                value={value.DATA_OPL1 ? new Date(value.DATA_OPL1) : null}
                onChange={handleDateChange('DATA_OPL1')}
            />
            <DateTimePicker 
                style={{ marginRight: '15px' }}
                label="Дата фактической оплаты по"
                name="DATA_OPL2"
                value={value.DATA_OPL2 ? new Date(value.DATA_OPL2) : null}
                onChange={handleDateChange('DATA_OPL2')}
            />
            <TextInput 
                style={{ marginRight: '15px' }}
                label="Номер платежного поручения"
                name="N_PLPR"
                value={value.N_PLPR}
                onChange={handleInputChange}
            />
            <Button variant='default' style={{ transform: 'translateY(10px)'}} onClick={handleOk}>OK</Button>
            <Button variant='default' style={{ transform: 'translateY(10px)'}} onClick={handleClear}>Очистить поля</Button>
        </div>
    )
};

export default Mtr1ResultPlatSearch;