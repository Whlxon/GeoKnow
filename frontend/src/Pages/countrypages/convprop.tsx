export interface Conv {
    user: string,
    message: string,
}

export const ConvProp = ({conv, aiModel, handleSpeach, mess} : {conv: Conv[], aiModel: string, handleSpeach:(msg:string)=>void, mess:string}) => {

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
                                            <div style={{textDecoration:"Underline", fontSize:"larger"}}>{mess}</div><br/>
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