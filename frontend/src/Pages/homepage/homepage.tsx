import { useState } from "react";
import type { Country } from '../utils/countries';
import { getLike } from "../utils/countries";

const defaultCountries: Country[] = [{
    id: -1,
    name: "default"
}]

export function HomePage (){
    const [country, setCountry ] = useState<Country[]>(defaultCountries);
    
    const handleChangement = (e: any) => {
        const name = e.target.value

        const c =  getLike(name);

        console.log("Pays:", c)
        
        if(c === undefined){
            setCountry(defaultCountries);
        }else{
            setCountry(c);
        }
        
    };

    return (
        <>
         <input onChange={handleChangement} className="ResearchBar" type="text" placeholder="Recherche un Pays/Ville" />
         <button className="randomBu"><img src="/random.png" alt="" /></button>
         <hr/>
         {country != undefined && <CountryProp country={country}/>}
        </>
    )
}

const CountryProp = ({country} : {country: Country[]}) => {

    return (
        <>
            {Array.isArray(country) && country.map((country, index) => {
                return (
                    <>
                    <div key={index}>
                        {country.name}
                    </div>
                    </>
                )
            })}
        </>
    )
}