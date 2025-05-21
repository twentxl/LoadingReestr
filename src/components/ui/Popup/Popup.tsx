import React, { useRef, useEffect, useCallback } from 'react';
import style from './Popup.module.css';

interface PopupProps {
    children: React.ReactNode;
    title: string;
}
const Popup = React.forwardRef<HTMLDivElement, PopupProps>(({ children, title }, ref) => {
    const closeRef = useRef<HTMLDivElement | null>(null);

    const closePopup = useCallback(() => {
        if (ref && typeof ref !== "function" && ref.current) {
            ref.current.style.display = "none";
        }
    }, [ref]);

    useEffect(() => {
        const close = closeRef.current;
        if (close) {
            close.addEventListener('click', closePopup);
        }
        return () => {
            if (close) {
                close.removeEventListener('click', closePopup);
            }
        };
    }, [closePopup]);

    return (
        <div className={style.popup} ref={ref}>
            <div className={style.wrapper}>
                <div className={style.header}>
                    <div className={style.title}>{title}</div>
                    <div className={style.closePopup} ref={closeRef}>✖</div>
                </div>
                <div className={style.content}>{children}</div>
            </div>
        </div>
    );
});

export default Popup;
