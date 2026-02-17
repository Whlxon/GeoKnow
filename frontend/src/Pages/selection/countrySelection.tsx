import { useEffect, useState } from "react";
import type { Country } from '../utils/countryList';
import { getLike, getAll, getRandomCountry } from "../utils/countries";
import { useNavigate } from "react-router-dom";

import './index.css'

const defaultCountries: Country[] = [{
    id: -1,
    name: "No Country Found"
}]

export function HomePage (){
    const [country, setCountry ] = useState<Country[]>(defaultCountries);
    const [supTrigger, setSupTrigger] = useState(false);
    const navigate = useNavigate()


    useEffect(()=>{
        const pswd = localStorage.getItem('password');
        const password = import.meta.env.VITE_PASSWORD_KEY;

        if(pswd != password){
            navigate('/');
        }

        setCountry(getAll());
    }, [

    ])

    const handleRandom = () => {
        const countryTemp = getRandomCountry();

        localStorage.setItem('country', countryTemp.name);

        navigate('/CountryPage');
    };

    const handleClick = (country: string) => {
        localStorage.setItem('country', country);

        navigate('/CountryPage');
    }

    const handleChangement = (e: any) => {
        const name = e.target.value

        const c = getLike(name);
        
        
        setCountry(c);
        
    };

    const handleReset = () => {
        localStorage.setItem('conversations', "")
    }


    const CountryProp = () => {
        return (
            <>
                {Array.isArray(country) && country.map((country, index) => {
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


    return (
        <>
         <input onChange={handleChangement} className="ResearchBar" placeholder="Recherche un Pays/Ville"/>
         <button className="randomBu" onClick={() => {handleRandom()}}><img src="/random.png" alt="" /></button>
         <button className="redB" onClick={() => {setSupTrigger(true);}}>Supprimer</button>
         {supTrigger && <><br/><div className="popup"><h2>Est tu sur de vouloir supprimer les données de conversation ?</h2><div>Cela supprimera seulement les messages que l'ia et vous, avez envoyer</div><br /><button className="redB" onClick={() => {handleReset(); setSupTrigger(false);}} >Oui</button><button className="greenB" onClick={() => {setSupTrigger(false)}}>Non</button></div></>}
         <hr/>
         {country != undefined && <CountryProp/>}
        </>
    )

    
}

