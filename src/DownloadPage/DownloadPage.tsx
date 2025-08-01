import React from 'react';
import style from "./DownloadPage.module.css";
import logo from "../../public/favicon.png";
import mainImage from "./download_mainImage.png";
import { IoLogoMicrosoft } from "react-icons/io5";
import { FaLinux } from 'react-icons/fa';
import Loader from '../components/ui/Loader/Loader';

const DownloadPage = () => {
    const [loaderVisible, setLoaderVisible] = React.useState<boolean>(false);

    const Download_Windows = async() => {
        try {
            setLoaderVisible(true);
            await fetch("http://192.168.106.156:5222/api/DownloadApp/Windows", {
            method: "GET",
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка при выполнении запроса!");
                }
                return response.blob();
            })
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;

            a.download = `LoadingReestr.zip`;

            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            });
        }
        finally {
            setLoaderVisible(false);
        }
    }

    return (
        <>
        <Loader visible={loaderVisible} />
        <header className={style.header}>
            <div className={style.container}>
                <div className={style.logo}>
                    <img src={logo} alt="logo" />
                    <span>Работа с реестрами счетов</span>
                </div>
                <a href="/">Вернуться назад</a>
            </div>
        </header>
        <div className={style.content}>
            <div className={style.container}>
                <div className={style.mainBlock}>
                    <div className={style.main__image}>
                        <img src={mainImage} alt="main_image" />
                    </div>
                    <div className={style.main__text}>
                        <div style={{ marginBottom: '50px' }}>
                            <h1>Приложение для рабочего стола: "Работа с реестрами счетов"</h1>
                            <p>
                                Приложение "Работа с реестрами счетов" для рабочего стола без перехода в браузер.
                                <br></br>
                                Приложение создано для удобства и не требует обязательной установки.
                                <br></br>
                                <br></br>
                                Перед установкой обратиться в отдел УИТ.
                            </p>
                        </div>
                        <div>
                            <button className={style.btn} onClick={Download_Windows}> <IoLogoMicrosoft size={16} />Скачать для Windows</button>
                            <button className={style.btn} style={{ marginLeft: "20px" }}> <FaLinux size={16} />Скачать для Linux</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
};

export default DownloadPage;