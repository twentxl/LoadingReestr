import React from 'react';
import style from "./Loader.module.css";

interface LoaderProps {
    visible: boolean;
}
const Loader: React.FC<LoaderProps> = ({ visible }) => {
    return (
        visible && (
        <div className={style.loader}>
            <div className={style.loader__circle}></div>
            <div className={style.text}>
                Загрузка...
            </div>
        </div>
        )
    )
};

export default Loader;