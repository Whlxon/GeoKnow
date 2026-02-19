import { useEffect, useState } from "react";
import type { Country } from '../utils/countryList';
import { getLike, getAll, getRandomCountry } from "../utils/countries";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


import './index.css'

const defaultCountries: Country[] = [{
    id: -1,
    name: "No Country Found",
    iso: "none"
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


    const CountryProp = ({ list }: { list: Array<{ id: number; name: string; iso: string }> }) => {

        return (
            <div className="countriesGrid"> {/* Conteneur principal en grid */}
                {Array.isArray(list) && list.map((country, index) => {
                    return (
                            <>
                                {country.name !== "No Country Found" && (
                                    <div className="paysComponent" key={index}>
                                        <button className="buttonPays" onClick={() => handleClick(country.name)}>
                                            {country.iso === "xx" && <div>/</div>}
                                            {country.iso !== "xx" && country.iso !== undefined && (
                                                <img
                                                    className="countryFlags"
                                                    src={`https://countryflagsapi.netlify.app/flag/${country.iso.toLowerCase()}.svg`}
                                                    alt={`Flag of ${country.name}`}
                                                />
                                            )}
                                            <div>{country.name}</div>
                                        </button>
                                    </div>
                                )}
                                {country.name === "No Country Found" && <div className="noCountry">No country found :/</div>}
                            </>
                    );
                })}
            </div>
        )
    }

    const handleLangage = (lang: string) => {
        setRefresh(!refresh);
        i18n.changeLanguage(lang);
    }


    return (
        <>

            <div className="langComponent"><button className="lang" style={{backgroundColor:"#cbe5e7"}} onClick={() => {handleLangage("eng")}}>Eng</button><button className="lang" style={{backgroundColor:"#b2c9ca"}} onClick={() => {handleLangage("fr")}}>Fr</button><button className="lang" onClick={() => {handleLangage("esp")}}>esp</button><br/></div>
            <hr/>
            <input onChange={handleChangement} className="ResearchInput" placeholder={t('researchbar')}/>
            <button className="randomBu" onClick={() => {handleRandom()}}><img src="/random.png" alt="" /></button>
            
            
         
            <div></div>
            {country != undefined && <CountryProp list={country}/>}
        </>
    )
    
}