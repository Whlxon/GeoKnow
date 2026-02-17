import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export function Password (){
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const handleChange = (e:any) => {
        setInputValue(e.target.value);
    };

    const handleLangage = (lang: string) => {
        setRefresh(!refresh);
        i18n.changeLanguage(lang);
    }

    const handleSubmit = (e:any) => {
        e.preventDefault();

        const password = import.meta.env.VITE_PASSWORD_KEY;
        
        const pswd = inputValue;

        if(pswd === password){
            localStorage.setItem('password', pswd);
            navigate('/selection')
            setError(false);
        }else{
            setError(true);
        }
    }

    useEffect(()=>{
        const pswd = localStorage.getItem('password');
        const password = import.meta.env.VITE_PASSWORD_KEY;

        if(pswd === password){
            navigate('/selection');
        }
    }, [])

    return (
        <>
            <h1>{t('title')}</h1>
            <h2>{t('subtitle')}</h2>
            <button className="lang" onClick={() => {handleLangage("eng")}}>Eng</button><button className="lang" onClick={() => {handleLangage("fr")}}>Fr</button><button className="lang" onClick={() => {handleLangage("esp")}}>esp</button><br/>
            {error && <><div style={{color:"Red"}}>{t('wrong')}</div></>}
            <form onSubmit={handleSubmit}>
                <input type="password" value={inputValue} onChange={handleChange} className="ResearchBar"/><br/>
                <button type="submit">{t('enter')}</button>
            </form>
        </>
    );
}