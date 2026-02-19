import { useEffect, useState } from "react";
import type { Country } from '../utils/countryList';
import { getLike, getAll, getRandomCountry } from "../utils/countries";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


import './index.css'
import { readConversationByCountry } from "../utils/conversations";

const defaultCountries: Country[] = [{
    id: -1,
    name: "No Country Found",
    iso: "none"
}]

export function HomePage (){
    let n = 0;
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const [country, setCountry ] = useState<Country[]>(defaultCountries);
    const [refresh, setRefresh] = useState(false);
    const [convFilter, setConvFilter] = useState(false);
    const navigate = useNavigate()


    useEffect(()=>{

        n = 0;
        
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

        localStorage.setItem('country', JSON.stringify(countryTemp));

        navigate('/CountryPage');
    };

    const handleClick = (country: Country) => {
        localStorage.setItem('country', JSON.stringify(country));

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
                    const co = readConversationByCountry(country.name);

                    if(convFilter && co === undefined){
                        return(<></>);
                    }
                    n++;

                    return (
                            <>
                                {country.name !== "No Country Found" && (
                                    <div className="paysComponent" key={index}>
                                        <button className="buttonPays" onClick={() => handleClick(country)}>
                                            {country.iso === "xx" && <div>/</div>}
                                            {country.iso !== "xx" && country.iso !== undefined && (
                                                <img
                                                    className="countryFlags"
                                                    src={`https://countryflagsapi.netlify.app/flag/${country.iso.toLowerCase()}.svg`}
                                                    alt={`Flag of ${country.name}`}
                                                />
                                            )}
                                            <div>{country.name}</div><br />
                                            {co != undefined && <div>{t('beginConv')}</div>}
                                        </button>
                                    </div>
                                )}
                                {country.name === "No Country Found" && <div className="noCountry">No country found :/</div>}
                            </>
                    );
                })}

                {n === 0 && <><div style={{fontSize:"larger"}}>{t("convNotFound")}</div></>}
            </div>
        )
    }

    const handleLangage = (lang: string) => {
        setRefresh(!refresh);
        i18n.changeLanguage(lang);
    }


    return (
        <>

            <div className="langComponent"><button className="lang" style={{backgroundColor:"#e7bc91"}} onClick={() => {handleLangage("eng")}}>Eng</button><button className="lang" style={{backgroundColor:"#d4a276"}} onClick={() => {handleLangage("fr")}}>Fr</button><button className="lang3" onClick={() => {handleLangage("esp")}}>esp</button><br/></div>
            <hr/>
            <input onChange={handleChangement} className="ResearchInput" placeholder={t('researchbar')}/>
            <button className="randomBu" onClick={() => {handleRandom()}}><img src="/random.png" alt="" /></button>
            <button className="randomBu" onClick={() => {setConvFilter(!convFilter)}}><img src="/conv.png" alt="" /></button>
            
            
            {country != undefined && <CountryProp list={country}/>}
        </>
    )
    
}