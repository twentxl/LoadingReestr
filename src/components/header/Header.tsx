import React from 'react';
import style from "./Header.module.css";
import HeaderButton, { HeaderSubButton, HeaderSubItem, HeaderSubItemNavigate} from '../ui/HeaderButton/HeaderButton';
import { FcInfo, FcBullish, FcViewDetails } from 'react-icons/fc';

import ResultNSIView from '../../Views/NSI/ResultNSIView/ResultNSIView';
import CardMOView from '../../Views/CardMO/CardMOView';
import MtrSchetResultView from '../../Views/SchetaTerritoriy/MtrSchetResultView/MtrSchetResultView';

interface HeaderProps {
    addTab: (label: string, ContentComponent: React.ReactNode) => void;
}
const Header: React.FC<HeaderProps> = ({ addTab }) => {
    const ResultNSILink = () => {
        addTab("Просмотр НСИ", <ResultNSIView />);
    }
    const CardMOLink = () => {
        addTab("Медицинская карточка", <CardMOView />);
    }
    const Mtr1SchetLink = () => {
        addTab("МТР1 Счета на терр-рию", <MtrSchetResultView typeIST={3} />);
    }
    const Mtr2SchetLink = () => {
        addTab("МТР2 Счета на терр-рию", <MtrSchetResultView typeIST={2} />);
    }

    return (
        <header className={style.header}>
            <HeaderSubButton icon={FcInfo} text="НСИ">
                <HeaderSubItem text="Просмотр нормативно-справочной информации" onClick={ResultNSILink}/>
            </HeaderSubButton>
            <HeaderButton icon={FcViewDetails} text="Карточка МО" onClick={CardMOLink} />
            <HeaderSubButton icon={FcBullish} text="Счета Территорий">
                <HeaderSubItemNavigate text="Исходящие">
                    <HeaderSubItem text="Сведения о счетах" onClick={Mtr1SchetLink}/>
                </HeaderSubItemNavigate>
                <HeaderSubItemNavigate text="Входящие">
                    <HeaderSubItem text="Сведения о счетах" onClick={Mtr2SchetLink}/>
                </HeaderSubItemNavigate>
            </HeaderSubButton>
        </header>
    )
};

export default Header;