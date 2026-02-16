import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { saveConversation, readConversations, readConversationByCountry } from "../utils/conversations";

import { apiKey } from "../../apiKey";

import '../../index.css'

interface Conv {
    user: string,
    message: string
}

export function CountryPage () {
    const [country, setCountry] = useState<string>("");
    const [conv, setConv] = useState();
    const navigate = useNavigate();

    const handleQuestionSubmit = async (e:any) => {
        const pays = localStorage.getItem('country')
        const question = e.target.value;
        
        const currentConversation: Conv[] = [
            {
            user: 'user',
            message: question
            }
        ];

        const url = "https://api.mammouth.ai/v1/chat/completions";

        const requestBody = {
            model: 'gpt-5-mini',
            messages: [
            {
                role: 'user', 
                content:`Tu es un expert en histoire et géographie. Réponds de manière concise (petit paragraphe 150 mots) et précise.
                        Si la question n'est pas claire, demande des précisions.

                        Peux tu répondre à la question comme si tu répondais à un débutant qui s'y connais pas du tout.

                        Utilise un Jargon d'enfant.

                        Hésite pas à expliquer avec des métaphores, si tu sais.

                        Vraiment ne répond que à des questions sur l'histoire géo et rien d'autre, même une blague tu répond pas
                        
                        Si la question posée par l'utilisateur n'a rien à voir avec l'histoire géo d'un pays, répond par:
                        "Désoler votre question est hors sujet :/"

                        Exemples de réponses :
                        - "La capitale de la France est Paris."
                        - "Le Nil est le plus long fleuve du monde (6 650 km)."
                        
                        Voici la question, le pays concerné est ${pays} et répond exclusivement par apport à ce pays:
                        ${question}`
            },
        ]}

        try {
            const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
            }

            const data = await response.json();

            const iaMSG = data.choices[0].message.content;

            currentConversation.push({
                user: 'ai',
                message: iaMSG
            });

            saveConversation(country, currentConversation);

            navigate(0)
            
            
        } catch (error) {
            console.error("Erreur API Mammouth:", error);
            return "Désolé, je n'ai pas pu obtenir de réponse.";
        }

    }

    useEffect(()=>{
        const c = localStorage.getItem('country')

        if(c != undefined){
            setCountry(c)
        }

        if(c === null){
            return;
        }

        const convTemp = readConversationByCountry(c);

        setConv(convTemp);

    }, [])


    const ConvProp = () => {

        return (
            <>
                <div style={{borderRadius:'10px', resize: 'none'}}>
                    <div>
                        {conv !== undefined && conv.map((msg:any, index:any) => {
                            return(
                                <>
                                    <div>
                                        { msg.user === 'ai' && <div style={{marginTop:'5px', marginBottom:'12px', textAlign:'left', marginLeft:'10vw'}} key={index}>
                                            <div style={{textDecoration:"Underline", fontSize:"larger"}}>GeoKnow:</div> <br/>
                                            {msg.message}
                                        </div>
                                        }
                                        { msg.user === 'user' && <div style={{marginTop:'5px', marginBottom:'12px', textAlign:'right', marginRight:'10vw'}} key={index}>
                                            <div style={{textDecoration:"Underline", fontSize:"larger"}}>Vous:</div><br/>
                                            {msg.message}
                                        </div>
                                        }
                                    </div>
                                </>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }


    return (
        <>
            
            <h1 style={{textDecoration:'Underline'}}>{country}</h1>
            <button style={{backgroundColor:"#ff6961"}} onClick={()=>{navigate('/')}}>Retour à la liste des pays</button><br/>
            
            <hr/><br/>
            <h2 style={{textDecoration:'Underline'}}>Questions Suggerer</h2>
            <button className="buttonSuggest"><li>Quel est la capital ?</li></button><br/>
            <button className="buttonSuggest"><li>Combien a-t-il d'habitant ?</li></button><br/>
            <button className="buttonSuggest"><li>Quels sont les traditions ?</li></button><br/>
            <button className="buttonSuggest"><li>Quels sont les villes avec +1000 habitants ?</li></button><br/>
            <button className="buttonSuggest"><li>Quel est l'histoire la plus connu du pays ?</li></button><br/><br/>

            <div style={{backgroundColor:"#8a656d", borderRadius:"20px", padding:'15px'}} >
                <ConvProp/>
                <input onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit(e)} className="askQ" type="text" placeholder="Posez votre question ici" /><br/>
            </div>
        </>
    )
}