import React, { useState } from 'react';
import ResultMtrSchetPopup from './ResultMtrSchetPopup';

const ResultMtrSchetView = () => {
    const [visible, setVisible] = useState<boolean>(true);

    return (
        <>
        <ResultMtrSchetPopup title="МТР1, поиск по счетам" visible={visible} onClose={() => setVisible(false)}/>
        </>
    )
};

export default ResultMtrSchetView;