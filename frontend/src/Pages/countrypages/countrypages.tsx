import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { saveConversation, readConversationByCountry, readConversations } from "../utils/conversations";
import { useTranslation } from 'react-i18next';


const apiKey = import.meta.env.VITE_MAMMOUTH_APIKEY;

import './index.css';
import { ConvProp, type Conv } from "./convprop";
import type { Country } from "../utils/countryList";

const defaultCountry = {
    id: -1,
    name: "Default Country",
    iso: "xx"
}

export function CountryPage () {
    const [country, setCountry] = useState<Country>(defaultCountry);
    const [conv, setConv] = useState<Conv[]>();
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [speach, setSpeach] = useState(true);
    const [noQuota, setNoQuota] = useState(false);
    const [supTrigger, setSupTrigger] = useState(false);
    const [questions, setQuestions] = useState<string[]>();
    const { t } = useTranslation();
    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    const [valeur, setValeur] = useState('');
    const [speachError, setSpeachError] = useState(false);

    const navigate = useNavigate();

    const aiModel = "gpt-5-mini";

    
    
    const handleReset = () => {
        const data = readConversations();

        let listTemp = [];

        for(let i = 0; i < data.length; i++){
            if(data[i].pays == country.name){
                data[i] = {conv:[], pays:""}
            }
            listTemp.push(data[i])
        }

        localStorage.setItem('conversations', JSON.stringify(listTemp));
        setRefresh(!refresh);
    }

    const sendQuestion = async (question: string, pays: string) => {
        setValeur('');

        setNoQuota(false);

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
                content:`${t('prompt')}
                         A) ${pays}
                         B) ${question}`
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

            if(response.status == 429){
                localStorage.setItem("noQuota", "true");
                setNoQuota(true);
                setLoading(false);
                return;
            }

            const data = await response.json();

            const iaMSG = data.choices[0].message.content;

            console.log(iaMSG);

            currentConversation.push({
                user: 'ai',
                message: iaMSG
            });

            saveConversation(country.name, currentConversation);

            setLoading(false);
            setRefresh(!refresh);
            
        } catch (error) {
            console.error("Erreur API Mammouth:", error);
            setLoading(false);
            setRefresh(!refresh);
            
            return "Désolé, je n'ai pas pu obtenir de réponse.";
        }

        await wait(1000);
        scrollToBottom()
    };

    const handleQuestionSubmit = async () => {
        const pays = country.name
        const question = valeur;

        if(pays === null){
            return;
        }

        sendQuestion(question, pays)
    }

    const sendSuggest = (question: string) => {
        const pays = country;

        if(pays === null){
            return;
        }

        

        sendQuestion(question, pays.name)
    };

    const handleSpeach = (text: string) => {
        if(speach){
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = t('voice');
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

    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth', // Pour un défilement fluide
        });
    };

    useEffect(()=>{
        const co = t('questions', { returnObjects:true }) as string[];
        setQuestions(co);

        const pswd = localStorage.getItem('password');
        const password = import.meta.env.VITE_PASSWORD_KEY;

        if(pswd != password){
            navigate('/');
        }

        const c = localStorage.getItem('country')
        if(c === null){
            return;
        };
        
        const coun: Country = JSON.parse(c) || {id:-1, name:"default country", iso:"xx"};
        setCountry(coun);

        const convTemp = readConversationByCountry(coun.name);

        setConv(convTemp);

        if(localStorage.getItem("noQuota") === "true"){
            setNoQuota(true)
        }

    }, [refresh])

    return (
        <>
            {speachError && <><div style={{color:"Red"}}>{t('voiceError')}</div></>}
            
            <button style={{marginTop:"1vh",backgroundColor:"#fc817b", color:"#963e39"}} onClick={()=>{navigate('/')}}>{t('back')}</button>
            <button className="supp" onClick={() => {setSupTrigger(!supTrigger)}}>{t('sup')}</button>
            {supTrigger && 
            <>
                <br/>
                <div className="popup">
                    <h2>
                        {t('sure')}
                    </h2>
                    <div>
                        {t('info')}
                    </div><br />
                    <button className="redB" onClick={() => {handleReset(); setSupTrigger(false);}}>{t('butY')}</button><button className="greenB" onClick={() => {setSupTrigger(false)}}>{t('butN')}</button>
                </div>
            </>}
            <hr/><br/>
            <h1 style={{textDecoration:'Underline'}}>{country.name}</h1>
            <img
                                                    className="countryFlags"
                                                    src={`https://countryflagsapi.netlify.app/flag/${country.iso.toLowerCase()}.svg`}
                                                    style={{width:"20%", }}
                                                    alt={`Flag of ${country.name}`}
                                                />
            {!noQuota && <>
                    <h2 style={{textDecoration:'Underline'}}>{t('sug')}</h2>
                    
                    {
                        questions !== undefined && <>{questions.map((question, index)=>{
                            return(<><div key={index}><button className="buttonSuggest" onClick={() => {sendSuggest(question)}}>{question}</button><br/></div></>);
                        })}<br/></>
                    }

                    <div className="convSpace">
                        <ConvProp conv={conv || []} aiModel={aiModel} handleSpeach={handleSpeach} mess={t('msg')}/>

                        {loading && <div className="loader"></div>}
                        <input onKeyPress={(e) => e.key === 'Enter' && handleQuestionSubmit()} value={valeur} onChange={(e) => setValeur(e.target.value)} id="askQ" className="askQ" type="text" placeholder={t('ask')} /><br/>
                    </div>
                </>
            }

            { noQuota &&
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div>
                    <h1>Oups....</h1>
                    <p>Désolé, nous avons atteint la limite de message avec l'IA pour ce mois</p>
                    <p>Attendez le mois prochain ou contactez Cyril Houppertz l'administrateur de l'application.</p>
                </div>
            </div>}
        </>
    )
}