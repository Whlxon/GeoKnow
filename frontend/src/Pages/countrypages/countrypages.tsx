import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { saveConversation, readConversationByCountry } from "../utils/conversations";

const apiKey = import.meta.env.VITE_MAMMOUTH_APIKEY;

import './index.css';

interface Conv {
    user: string,
    message: string,
}

export function CountryPage () {
    const [country, setCountry] = useState<string>("");
    const [conv, setConv] = useState<Conv[]>();
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [speach, setSpeach] = useState(true);
    const [speachError, setSpeachError] = useState(false);
    const [valeur, setValeur] = useState('');
    const navigate = useNavigate();

    const aiModel = "gpt-5-mini";

    const sendQuestion = async (question: string, pays: string) => {
        setValeur('');

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

                        J'aimerais que tu suis quelque règle pour répondre à la question, les voicis:
                        - Répond à la question comme si tu répondais à un débutant qui s'y connais pas du tout.
                        - Utilise un Jargon d'enfant, mais ne dit pas "Pour expliquer comme à un enfant:..." explique simplement.
                        
                        - Il faut que tu sache également que vu que tu ne te rapelle pas de ce que tu dis,
                         ne pose pas de question à l'utilisateur, cela ne sert à rien. répond simplement à la question.
                        
                        - Si l'utilisateur te demande de lui poser une question dit simplement:
                        "Je ne peux pas te poser de question car je ne peux pas me rappeller des anciens message :/"

                        - Ne répond que à des questions sur l'histoire géo et politique, si l'utilisateur comment à s'écarter du sujet ramène le vers l'histoiren, géo et politique
                        
                        - Si vraiment la question posée par l'utilisateur n'a rien à voir avec l'histoire géo et politique d'un pays, répond par: "Désoler votre question est hors sujet :/"

                        - N'utilise pas les embedings tel que les double étoile pour le gras, ou des tiret pour souligner car ça ne fonctionnera pas du tout

                        Exemples de réponses que tu pourrais donner :
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
            setRefresh(!refresh);
            
            
        } catch (error) {
            console.error("Erreur API Mammouth:", error);
            setLoading(false);
            setRefresh(!refresh);
            
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

    const handleSpeach = (text: string) => {
        if(speach){
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'fr-FR';
                window.speechSynthesis.speak(utterance);
                setSpeachError(false);
            } else {
                setSpeachError(true);
            }
            setSpeach(!speach);
        }else{
            window.speechSynthesis.cancel();
            setSpeach(true);
        }
    }

    useEffect(()=>{

        const pswd = localStorage.getItem('password');
        const password = import.meta.env.VITE_PASSWORD_KEY;

        if(pswd != password){
            navigate('/');
        }

        const c = localStorage.getItem('country')

        if(c != undefined){
            setCountry(c)
        }

        if(c === null){
            return;
        }

        const convTemp = readConversationByCountry(c);

        setConv(convTemp);

    }, [refresh])


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
                                            {msg.message} <button className="listenB" onClick={() => {handleSpeach(msg.message)}}><img src="/ecoute.png"/></button>
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
            {speachError && <><div style={{color:"Red"}}>Désoler le navigateur ne prend pas en charge la voix</div></>}
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
                <input onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit()} value={valeur} onChange={(e) => setValeur(e.target.value)} className="askQ" type="text" placeholder="Posez votre question ici" /><br/>
            </div>
        </>
    )
}