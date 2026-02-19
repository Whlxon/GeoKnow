import type { Country} from './countryList';

export const getAll = (countries: Country[]) => {
    return countries
}

export const getRandomCountry = (countries: Country[]): Country => {
    const min: number = 0
    const max: number = countries.length
    const index = Math.floor(Math.random() * (max - min + 1)) + min;

    return countries[index];


}

export const getLike = (name: string, countries: Country[]): Country[] => {
    console.log('getLike List', countries)

    if(name === " " || name === ""){
        console.log('Exit bc empty')
        return countries;
    }
    
    let countryList = []
    
    
    for(let i = 0; i < countries.length; i++){
        if(countries[i].name.includes(name)){
            const c: Country = {
                id: countries[i].id,
                name: countries[i].name
            }
            countryList.push(c);
        }
    }

    if(countryList.length === 0){
        countryList = [{
        id: -1,
        name: "No Country Found"
    }]

    console.log("getLike List after", countryList)
}
    return countryList;
};