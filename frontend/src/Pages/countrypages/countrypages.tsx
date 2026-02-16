import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { saveConversation, readConversationByCountry } from "../utils/conversations";

import { apiKey } from "../../apiKey";

import '../../index.css'

interface Conv {
    user: string,
    message: string
}

export function CountryPage () {
    const [country, setCountry] = useState<string>("");
    const [conv, setConv] = useState<Conv[]>();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const aiModel = "gpt-5-mini";

    const sendQuestion = async (question: string, pays: string) => {

        let currentConversation: Conv[] = [
            {
            user: 'user',
            message: question
            }
        ];

        const url = "https://api.mammouth.ai/v1/chat/completions";

        const requestBody = {
            model: `${aiModel}`,
            messages: [
            {
                role: 'user', 
                content:`Tu es un expert en histoire, géographie et Politique. Réponds de manière concise (petit paragraphe 150 mots) et précise.
                        Si la question n'est pas claire, demande des précisions.

                        Peux tu répondre à la question comme si tu répondais à un débutant qui s'y connais pas du tout.

                        Utilise un Jargon d'enfant.

                        Vraiment ne répond que à des questions sur l'histoire géo et rien d'autre, même une blague tu répond pas 
                        (mais si quelqu'un te salue, présente toi tout de même ^^)
                        
                        Si la question posée par l'utilisateur n'a rien à voir avec l'histoire géo d'un pays, répond par:
                        "Désoler votre question est hors sujet :/"

                        Exemples de réponses :
                        - "La capitale de la France est Paris."
                        - "Le Nil est le plus long fleuve du monde (6 650 km)."
                        
                        Voici la question, le pays concerné est ${pays} et répond exclusivement par apport à ce pays:
                        ${question}`
            },
        ]}
        
        setLoading(true);

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

            setLoading(false);
            navigate(0)
            
            
        } catch (error) {
            console.error("Erreur API Mammouth:", error);
            return "Désolé, je n'ai pas pu obtenir de réponse.";
        }
    };

    const handleQuestionSubmit = async (e:any) => {
        const pays = localStorage.getItem('country')
        const question = e.target.value;

        if(pays === null){
            return;
        }

        sendQuestion(question, pays)
    }

    const handleSuggest = (question: string) => {
        const pays = localStorage.getItem('country')

        if(pays === null){
            return;
        }

        sendQuestion(question, pays)
    };

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
                                        { msg.user === 'ai' && <div style={{marginTop:'5px', marginBottom:'12px', textAlign:'left', marginLeft:'10vw', marginRight:'10vw'}} key={index}>
                                            <div style={{textDecoration:"Underline", fontSize:"larger"}}>GeoKnow ({aiModel})</div> <br/>
                                            {msg.message}
                                        </div>
                                        }
                                        { msg.user === 'user' && <div style={{marginTop:'5px', marginBottom:'12px', textAlign:'right', marginLeft:'10vw', marginRight:'10vw'}} key={index}>
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
            <button style={{backgroundColor:"#fc817b", color:"#963e39"}} onClick={()=>{navigate('/')}}>Retour à la liste des pays</button><br/>
            
            <hr/><br/>
            <h2 style={{textDecoration:'Underline'}}>Questions Suggérées</h2>
            <button className="buttonSuggest" onClick={() => {handleSuggest("Quel est la capital ?")}}><li>Quel est la capital ?</li></button><br/>
            <button className="buttonSuggest" onClick={() => {handleSuggest("Combien a-t-il d'habitant ?")}}><li>Combien a-t-il d'habitant ?</li></button><br/>
            <button className="buttonSuggest" onClick={() => {handleSuggest("Quels sont les traditions ?")}}><li>Quels sont les traditions ?</li></button><br/>
            <button className="buttonSuggest" onClick={() => {handleSuggest("Quels sont les villes avec +1000 habitants ?")}}><li>Quels sont les villes avec +1000 habitants ?</li></button><br/>
            <button className="buttonSuggest" onClick={() => {handleSuggest("Quel est l'histoire la plus connu du pays ?")}}><li>Quel est l'histoire la plus connu du pays ?</li></button><br/><br/>

            <div style={{backgroundColor:"#e2e9ab", borderRadius:"20px", padding:'15px', marginBottom:"5vh"}} >
                <ConvProp/>
                {loading && <div className="loader" style={{marginLeft:"auto", marginRight:"auto", marginBottom:"5px"}}></div>}
                <input onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit(e)} className="askQ" type="text" placeholder="Posez votre question ici" /><br/>
            </div>
        </>
    )
}