import React from 'react';
import Split from 'react-split';
import PlatPorGrid from './PlatPorGrid';
import SchetaGrid from './SchetaGrid';
import SLGrid  from './SLGrid';
import { Box, TextInput } from '@mantine/core';

interface PlatezhkiDetailViewProps {
    typeIST: number;
}
const PlatezhkiDetailView: React.FC<PlatezhkiDetailViewProps> = ({ typeIST }) => {
    const [selectedId, setSelectedId] = React.useState<number | undefined>(undefined);
    const [selectedRow, setSelectedRow] = React.useState<any | undefined>(undefined);
    const [selectedRowSchet, setSelectedRowSchet] = React.useState<any | undefined>(undefined);
    
    const handleSelectBUOP = (newIdBUOP: number) => { setSelectedId(newIdBUOP); }
    const handleSelectRow = (newRow: any) => { setSelectedRow(newRow); }
    const handleSelectRowSchet = (newRow: any) => { setSelectedRowSchet(newRow); }

    return (
        <Split className='split' style={{ flexDirection: 'column' }} direction='vertical'>
            <Split className='split' style={{ borderBottom: '1px solid #dee2e6' }}>
                    <Box><PlatPorGrid typeIST={typeIST} onSelectIdBUOP={handleSelectBUOP} onSelectRow={handleSelectRow}/></Box>
                    <Box>
                        <Box><SchetaGrid idBUOP={selectedId} onSelectRow={handleSelectRowSchet}/></Box>
                        <Box><SLGrid idBUOP={selectedId}/></Box>
                    </Box>
            </Split>
            {selectedRow && (
            <div style={{ padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-around' }}>
                <div>
                    <h1 style={{marginBottom: '10px'}}>Сведения о плат. поручениях</h1>
                    <Box style={{ display: 'flex' , alignItems: 'center', marginBottom: '10px'}}>
                        <span style={{ fontWeight: 'bold', width: '150px' }}>№ плат.пор</span>
                        <TextInput size="xs" name='N_PLPR' value={selectedRow.original.N_PLPR} readOnly />
                    </Box>
                    <Box style={{ display: 'flex' , alignItems: 'center', marginBottom: '10px'}}>
                        <span style={{ fontWeight: 'bold', width: '150px' }}>Дата плат.пор</span>
                        <TextInput size="xs" name='D_PLPR' value={selectedRow.original.D_PLPR} readOnly />
                    </Box>
                    <Box style={{ display: 'flex' , alignItems: 'center', marginBottom: '10px'}}>
                        <span style={{ fontWeight: 'bold', width: '150px' }}>Тип оплаты</span>
                        <TextInput size="xs" name='T_PLPR' value={selectedRow.original.T_PLPR} readOnly />
                    </Box>
                    <Box style={{ display: 'flex' , alignItems: 'center', marginBottom: '10px'}}>
                        <span style={{ fontWeight: 'bold', width: '150px' }}>Дата факт-ой оплаты</span>
                        <TextInput size="xs" name='DATA_OPL' value={selectedRow.original.DATA_OPL} readOnly />
                    </Box>
                    <Box style={{ display: 'flex' , alignItems: 'center', marginBottom: '10px'}}>
                        <span style={{ fontWeight: 'bold', width: '150px' }}>Терр. страъ. зл</span>
                        <TextInput size="xs" name='subname' value={selectedRow.original.subname} readOnly />
                    </Box>
                </div>
                <div>
                    <h1 style={{marginBottom: '10px'}}>Сведения о счете терр. страх</h1>
                    <Box style={{ display: 'flex' , alignItems: 'center', marginBottom: '10px'}}>
                        <span style={{ fontWeight: 'bold', width: '150px' }}>№ счета</span>
                        <TextInput size="xs" name='NSCHET' value={selectedRowSchet.NSCHET} readOnly />
                    </Box>
                    <Box style={{ display: 'flex' , alignItems: 'center', marginBottom: '10px'}}>
                        <span style={{ fontWeight: 'bold', width: '150px' }}>Дата счета</span>
                        <TextInput size="xs" name='DSCHET' value={selectedRowSchet.DSCHET} readOnly />
                    </Box>
                </div>
            </div>
            )}
        </Split>
    )
};

export default PlatezhkiDetailView;