
import type { Country} from './countryList';
import  { countries } from './countryList';


export const getAll = () => {
    return countries
}

export const getRandomCountry = (): Country => {
    const min: number = 0
    const max: number = countries.length
    const index = Math.floor(Math.random() * (max - min + 1)) + min;

    return countries[index];


}

export const getLike = (name: string): Country[] | undefined => {
    if(name === " " || name === ""){
        return countries;
    }
    
    let countryList = []
    
    
    for(let i = 0; i < countries.length; i++){
        if(countries[i].name.includes(name)){
            countryList.push(countries[i]);
        }
    }

    if(countryList.length === 0){
        let countryList = [{
        id: -1,
        name: "No Country Found"
    }]
}
    return countryList;
};