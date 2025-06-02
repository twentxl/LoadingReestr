import React, { useState } from 'react';
import style from "./Header.module.css";
import HeaderButton, { HeaderSubButton, HeaderSubItem, HeaderSubItemNavigate} from '../ui/HeaderButton/HeaderButton';
import { FcInfo, FcBullish, FcViewDetails, FcAnswers } from 'react-icons/fc';

import ResultNSIView from '../../Views/NSI/ResultNSIView/ResultNSIView';
import CardMOView from '../../Views/CardMO/CardMOView';
import ResultMtrSchetView from '../../Views/SchetMTR/ResultMtrSchetView/ResultMtrSchetView';
import MtrSchetResultView from '../../Views/SchetaTerritoriy/MtrSchetResultView/MtrSchetResultView';
import Mtr1ResultPlatView from '../../Views/SchetaTerritoriy/Mtr1ResultPlatView/Mtr1ResultPlatView';
import PlatezhkiDetailView from '../../Views/SchetaTerritoriy/PlatezhkiDetailView/PlatezhkiDetailView';
import Mtr1SvedFileXmlPPView from '../../Views/SchetaTerritoriy/Mtr1SvedFileXmlPPView/Mtr1SvedFileXmlPPView';

interface ModalState {
    [key: string]: boolean;
  }  

interface HeaderProps {
    addTab: (label: string, ContentComponent: React.ReactNode) => void;
}
const Header: React.FC<HeaderProps> = ({ addTab }) => {
    const [modal, setModal] = useState<ModalState>({});
    const openModal = (name: string) => {
        setModal(prev => ({ ...prev, [name]: true }));
    };
    const closeModal = (name: string) => {
        setModal(prev => ({ ...prev, [name]: false }));
    }; 

    const ResultNSILink = () => {
        addTab("Просмотр НСИ", <ResultNSIView />);
    }
    const CardMOLink = () => {
        addTab("Медицинская карточка", <CardMOView />);
    }
    const ResultMtrSchetLink = () => {
        addTab("МТР1, счета по МО", <ResultMtrSchetView />);
    }
    const Mtr1SchetLink = () => {
        addTab("МТР1 Счета на терр-рию", <MtrSchetResultView typeIST={3} />);
    }
    const Mtr2SchetLink = () => {
        addTab("МТР2 Счета на терр-рию", <MtrSchetResultView typeIST={2} />);
    }
    const Mtr1ResultPlatLink = () => {
        addTab("Мтр1, Сведения о плат. поручениях", <Mtr1ResultPlatView />)
    };
    const PlatezhkiDetailLink = () => {
        addTab("МТР1, Учет движения денеж.средств на терр.", <PlatezhkiDetailView />)
    }
    const Mtr1SvedFileXmlPPLink = () => {
        openModal('Mtr1SvedFileXmlPP');
    }

    return (
        <>
        <header className={style.header}>
            <HeaderSubButton icon={FcInfo} text="НСИ">
                <HeaderSubItem text="Просмотр нормативно-справочной информации" onClick={ResultNSILink}/>
            </HeaderSubButton>

            <HeaderButton icon={FcViewDetails} text="Карточка МО" onClick={CardMOLink} />
            <HeaderSubButton text="Счета МО(СМО)" icon={FcAnswers}>
                <HeaderSubItem text="Сведения о счетах" onClick={() => alert("In develop")}/>
            </HeaderSubButton>

            <HeaderSubButton text="Счета МО(МТР)" icon={FcAnswers}>
                <HeaderSubItem text="Сведения о счетах" onClick={ResultMtrSchetLink}/>
            </HeaderSubButton>

            <HeaderSubButton icon={FcBullish} text="Счета Территорий">
                <HeaderSubItemNavigate text="Исходящие">
                    <HeaderSubItem text="Сведения о счетах" onClick={Mtr1SchetLink}/>
                    <HeaderSubItemNavigate text="Платежные поручения">
                        <HeaderSubItem text="Разноска счетов по платежам" />
                        <HeaderSubItem text="Сведения о платежных поручениях" onClick={Mtr1ResultPlatLink} />
                        <HeaderSubItem text="Учет движения денежных средств с территорий" onClick={PlatezhkiDetailLink} />
                        <HeaderSubItem text="Сведения о файлах xml от бух-рии" onClick={Mtr1SvedFileXmlPPLink}/>
                    </HeaderSubItemNavigate>
                    <HeaderSubItem text="Детализированный поиск(МТР1)" />
                    <HeaderSubItemNavigate text="Выгрузка данных">
                        <HeaderSubItemNavigate text="Акт сверки">
                            <HeaderSubItem text="Расчет данных актов сверки" />
                            <HeaderSubItem text="Сформировать акты сверки" />
                        </HeaderSubItemNavigate>
                        <HeaderSubItemNavigate text="Акт сверки 2019-2023">
                            <HeaderSubItem text="Расчет данных актов сверки" />
                            <HeaderSubItem text="Сформировать акты сверки" />
                            <HeaderSubItem text="Дебиторская задолженность" />
                        </HeaderSubItemNavigate>
                        <HeaderSubItem text="Сведения о задолженности" />
                    </HeaderSubItemNavigate>
                </HeaderSubItemNavigate>
                <HeaderSubItemNavigate text="Входящие">
                    <HeaderSubItem text="Сведения о счетах" onClick={Mtr2SchetLink}/>
                </HeaderSubItemNavigate>
            </HeaderSubButton>
        </header>

        {/* Modals */}
        {modal['Mtr1SvedFileXmlPP'] && (
        <Mtr1SvedFileXmlPPView visible={true} onClose={() => closeModal('Mtr1SvedFileXmlPP')} />
        )}
        </>
    )
};

export default Header;