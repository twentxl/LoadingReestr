import React, { useState, useEffect } from 'react';
import Popup from '../../../components/ui/Popup/Popup';
import LookUpEdit from '../../../components/ui/LookUpEdit/LookUpEdit';
import { GetTFOMSNSI } from '../../../api/NsiApi';
import { Button } from '@mantine/core';

interface InitialValueParameters {
  nametable: string;
  name: string;
}
const initialValue: InitialValueParameters = {
    nametable: '',
    name: ''
};
const memoAccessor = [
  { accessorKey: "code", header: "Код", size: 50 },
  { accessorKey: "name", header: "Наименование", size: 50 },
  { accessorKey: "nametable", header: "nametable", size: 50 },
  { accessorKey: "datebeg", header: "Дата начала действия", size: 50 },
  { accessorKey: "dateend", header: "Дата окончания действия", size: 50 },
];

interface ResultNSISearchPopupProps {
  onClick?:(value: InitialValueParameters) => void;
}
const ResultNSISearchPopup = React.forwardRef<HTMLDivElement, ResultNSISearchPopupProps>(({ onClick }, ref) => {
  const [value, setValue] = useState(initialValue);
  const [data, setData] = useState([]);

  const handleLookupChange = (name: keyof InitialValueParameters) => (selectedVal: any) => {
    setValue((prev) => ({ ...prev, [name]: selectedVal }));
  };

  const handleClick = () => {
    if(onClick) { onClick(value); }
  }

  useEffect(() => {
    const fetchData = async() => {
      const result = await GetTFOMSNSI();
      setData(result);
    }
    fetchData();
  }, [])

    return (
        <Popup title="Поиск НСИ" ref={ref}>
            <div style={{ display: 'flex' }}>
                <LookUpEdit width='500'
                            data={data} 
                            memoAccessorKey={memoAccessor} 
                            displayMember={"name"} 
                            valueMember={"nametable"}
                            value={value.nametable}
                            onChange={handleLookupChange("nametable")}/>
                <Button variant='default' onClick={handleClick}>OK</Button>
            </div>
        </Popup>
    )
});

export default ResultNSISearchPopup;