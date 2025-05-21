import React, { useRef, useEffect, useCallback } from 'react';
import style from './HeaderButton.module.css';
import { IoMdArrowDropdown , IoMdArrowDropright } from "react-icons/io";

interface HeaderSubItemNavigateProps {
    children: React.ReactNode;
    text: string;
}
export const HeaderSubItemNavigate: React.FC<HeaderSubItemNavigateProps> = ({ children, text }) => {
    const itemRef = useRef<HTMLLIElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const handleClick = useCallback(() => {
        if(listRef.current) { listRef.current.style.display = "block"; }
    }, []);
    const handleClickOutside = useCallback((event: any) => {
        if(itemRef.current && itemRef.current.contains(event.target)) {
            return;
        } 
        else {
            if(listRef.current) { listRef.current.style.display = "none"; }
        }
    }, []);
    useEffect(() => {
        const item = itemRef.current;

        if(item) { item.addEventListener('click', handleClick); }
        document.addEventListener('click', handleClickOutside);
        return () => {
            if(item) { item.removeEventListener('click', handleClick); }
            document.removeEventListener('click', handleClickOutside);
        }
    }, [handleClick, handleClickOutside]);

    if(!text) {
        throw new Error("Поле link обязательно для заполнения!");
    }
    return (
        <li ref={itemRef}>
            <span className={style.textBlock}>
                {text} <IoMdArrowDropright size={15}/>
            </span>

            <HeaderSubList ref={listRef}>
                {children}
            </HeaderSubList>
        </li>
    );
};

interface HeaderSubItemProps {
    text: string;
    onClick?: () => void;
}
export const HeaderSubItem: React.FC<HeaderSubItemProps> = ({ text, onClick }) => {
    if(!text) {
        throw new Error("Поле link обязательно для заполнения!");
    }

    return (
        <li onClick={onClick}>{text}</li>
    );
};

interface HeaderSubButtonProps {
    children: React.ReactNode;
    text: string;
    icon: React.ElementType<{ size: number }>;
    width?: number;
}
export const HeaderSubButton: React.FC<HeaderSubButtonProps> = ({ children, text, icon, width }) => {
    const listRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLDivElement | null>(null);

    const handleClick = useCallback(() => {
        if(listRef.current) { listRef.current.style.display = "block"; }
    }, []);

    const handleClickOutside = useCallback((event: any) => {
        if(buttonRef.current && buttonRef.current.contains(event.target)) {
            return;
        } else {
            if(listRef.current) { listRef.current.style.display = "none"; }
        }
    }, []);

    useEffect(() => {
        const button = buttonRef.current;

        if(button) { button.addEventListener('click', handleClick); }
        document.addEventListener('click', handleClickOutside);
        return () => {
            if(button) { button.removeEventListener('click', handleClick); }
            document.removeEventListener('click', handleClickOutside);
        }
    }, [handleClick, handleClickOutside]);

    if (!icon) {
        throw new Error("Поле iconUrl обязательно для заполнения!");
    }
    if (!text) {
        throw new Error("Поле text обязательно для заполнения!");
    }
    return (
        <div className={style.navigationButton} ref={buttonRef}>
            <div className={style.button} style={{width: width}}>
                {React.createElement(icon, { size: 24 })}
                <span className={style.textBlock}>
                    {text} <IoMdArrowDropdown size={15}/>
                </span>
            </div>

            <HeaderSubList ref={listRef}>
                {children}
            </HeaderSubList>
        </div>
    )
};

interface HeaderSubListProps {
    children?: React.ReactNode;
};
const HeaderSubList = React.forwardRef<HTMLDivElement, HeaderSubListProps>(({ children }, ref) => {
    return (
        <div className={style.list} ref={ref}>
            <ul>
                {children}
            </ul>
        </div>
    )
});

interface HeaderButtonProps {
    text: string;
    icon: React.ElementType<{ size: number}>;
    onClick?: () => void;
    width?: number;
}
const HeaderButton: React.FC<HeaderButtonProps> = ({text, icon: Icon, onClick, width}) => {
    if (!Icon) {
        throw new Error("Поле iconUrl обязательно для заполнения!");
    }
    if (!text) {
        throw new Error("Поле text обязательно для заполнения!");
    }
    return (
        <div className={style.button} style={{width: width}} onClick={onClick}>
            <Icon size={24} />
            <span>{text}</span>
        </div>
    )
};

export default HeaderButton;