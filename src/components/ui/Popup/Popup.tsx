import React, { useRef, useEffect, useCallback } from 'react';
import style from './Popup.module.css';

interface PopupProps {
    children: React.ReactNode;
    title: string;
    visible: boolean;
    onClose: () => void;
}
const Popup: React.FC<PopupProps> = ({ children, title, visible, onClose }) => {
    const closeRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const close = closeRef.current;
        if (close && onClose) {
            close.addEventListener('click', onClose);
        }
        return () => {
            if (close && onClose) {
                close.removeEventListener('click', onClose);
            }
        };
    }, [onClose]);

    return (
        visible && (
        <div className={style.popup}>
            <div className={style.wrapper}>
                <div className={style.header}>
                    <div className={style.title}>{title}</div>
                    <div className={style.closePopup} ref={closeRef} onClick={onClose}>✖</div>
                </div>
                <div className={style.content}>{children}</div>
            </div>
        </div>
        )
    );
};

export default Popup;
