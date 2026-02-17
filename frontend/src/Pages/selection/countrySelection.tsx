import { useEffect, useState } from "react";
import type { Country } from '../utils/countryList';
import { getLike, getAll, getRandomCountry } from "../utils/countries";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


import './index.css'

const defaultCountries: Country[] = [{
    id: -1,
    name: "No Country Found"
}]

export function HomePage (){
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [country, setCountry ] = useState<Country[]>(defaultCountries);
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate()


    useEffect(()=>{
        
        const pswd = localStorage.getItem('password');
        const password = import.meta.env.VITE_PASSWORD_KEY;

        if(pswd != password){
            navigate('/');
        }

        const c: Country[] = t('pays', {returnObjects: true}) as Country[]

        setCountry(getAll(c));
    }, [refresh])

    const handleRandom = () => {
        const c: Country[] = t('pays', {returnObjects: true}) as Country[]
        const countryTemp = getRandomCountry(c);

        localStorage.setItem('country', countryTemp.name);

        navigate('/CountryPage');
    };

    const handleClick = (country: string) => {
        localStorage.setItem('country', country);

        navigate('/CountryPage');
    }

    const handleChangement = (e: any) => {
        const name = e.target.value
        const c: Country[] = t('pays', {returnObjects: true}) as Country[]

        const co = getLike(name, c);
        
        
        setCountry(co);
        
    };


    const CountryProp = ({ list }: { list: Array<{ id: number; name: string }> }) => {

        return (
            <>
                {Array.isArray(list) && list.map((country, index) => {
                    return (
                        <>
                            {country.name !== "No Country Found" && <div key={index}>
                                <button className="buttonPays" onClick={() => {handleClick(country.name)}}>
                                    {country.name}
                                </button>
                            </div>}

                            {country.name === "No Country Found" && <><div>No country found :/</div></>}
                        </>
                    )
                })}
            </>
        )
    }

    const handleLangage = (lang: string) => {
        setRefresh(!refresh);
        i18n.changeLanguage(lang);
    }


    return (
        <>
            <button className="lang" onClick={() => {handleLangage("eng")}}>Eng</button><button className="lang" onClick={() => {handleLangage("fr")}}>Fr</button><button className="lang" onClick={() => {handleLangage("esp")}}>esp</button><br/>
            <input onChange={handleChangement} className="ResearchBar" placeholder={t('researchbar')}/>
            <button className="randomBu" onClick={() => {handleRandom()}}><img src="/random.png" alt="" /></button>
         
            <div></div>

            <hr/>
            {country != undefined && <CountryProp list={country}/>}
        </>
    )

    
}

