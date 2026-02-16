import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Password (){
    
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e:any) => {
        setInputValue(e.target.value); 
        console.log(e.target.value);
    };

    const handleSubmit = (e:any) => {
        e.preventDefault();

        console.log("Submit handled !!")

        const password = import.meta.env.VITE_PASSWORD_KEY;
        
        const pswd = inputValue;

        console.log('Voici le mot de passe introduit', pswd);

        if(pswd === password){
            localStorage.setItem('password', pswd);
            navigate('/selection')
            setError(false);
        }else{
            setError(true);
        }
    }

    return (
        <>
            <h1>Cette Application est privé</h1>
            <h2>Veuillez entré le mot de passe pour pouvoir y accéder</h2>
            {error && <><div style={{color:"Red"}}>Mot de passe Incorrect</div></>}
            <form onSubmit={handleSubmit}>
                <input type="password" value={inputValue} onChange={handleChange} className="ResearchBar"/><br/>
                <button type="submit">Entré sur l'app</button>
            </form>
        </>
    );
}