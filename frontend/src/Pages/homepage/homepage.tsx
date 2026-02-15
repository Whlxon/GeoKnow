import { useEffect, useState } from "react";
import type { Country } from '../utils/countryList';
import { getLike, getAll, getRandomCountry } from "../utils/countries";
import { useNavigate } from "react-router-dom";

import '../../index.css'

const defaultCountries: Country[] = [{
    id: -1,
    name: "No Country Found"
}]

export function HomePage (){
    const [country, setCountry ] = useState<Country[]>(defaultCountries);
    const navigate = useNavigate()


    useEffect(()=>{
        setCountry(getAll());
        isPrivateMode()
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

        const c =  getLike(name);
        
        if(c === undefined){
            setCountry(defaultCountries);
        }else{
            setCountry(c);
        }
    };

    const handleReset = () => {
        localStorage.setItem('conversations', "")
    }

    const isPrivateMode = () => {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return;
        } catch (e) {
            alert("⚠️ Mode navigation privée détecté. Désactivez-le pour sauvegarder vos données.");
            return;
        }
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
         <input onChange={handleChangement} className="ResearchBar" placeholder="Recherche un Pays/Ville" style={{color:"#ffffff"}}/>
         <button className="randomBu" onClick={() => {handleRandom()}}><img src="/random.png" alt="" /></button>
         <button style={{backgroundColor:"red", marginLeft:"3px"}} onClick={() => {handleReset()}}>Reset Conv</button>
         <hr/>
         {country != undefined && <CountryProp/>}
        </>
    )

    
}

