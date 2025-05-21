import React from 'react';
import style from "./Loader.module.css";

const Loader = React.forwardRef<HTMLDivElement>(({  }, ref) => {
    return (
        <div className={style.loader} ref={ref}>
            <div className={style.loader__circle}></div>
            <div className={style.text}>
                Загрузка...
            </div>
        </div>
    )
});

export default Loader;