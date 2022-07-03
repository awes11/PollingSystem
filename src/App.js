import React, { useEffect, useState } from "react";
import "./App.css";

import { ConnectButton } from "web3uikit";
import logo from "./images/poll_logo.png";

import Coin from "./Components/Coin";
import { useMoralis } from "react-moralis";


const App = () => {

  const[poll, setPoll] = useState(50);
  const[poll2, setPoll2] = useState(50);
  

  const{Moralis, isInitialized} = useMoralis();

 

  async function getRatio(tick, setPerc){

    const Votes = Moralis.Object.extend("Votes");
    
    const query = new Moralis.Query(Votes);
    query.equalTo("ticker", tick);
    query.descending("createdAt");
    const results = await query.first();
    let up = Number(results.attributes.up);
    let down = Number(results.attributes.down);
    let ratio = Math.round(up/(up+down)*100);
  
    setPerc(ratio);
    
  }

  useEffect(() => {
    if(isInitialized){
    getRatio("Reconstruct Lab", setPoll);
    getRatio("Nike PartnerShip", setPoll2);
    

    async function createLiveQuery(){
      let query = new Moralis.Query('Votes');
      let subscription = await query.subscribe();
      subscription.on('update', (object) => {
        
        if(object.attributes.ticker === "Reconstruct Lab"){
          getRatio("Reconstruct Lab", setPoll);
        }else if(object.attributes.ticker === "Nike PartnerShip"){
          getRatio("Nike PartnerShip", setPoll2);
        
        }
      });
    }
    createLiveQuery();
    }
    
  }, [isInitialized]);


  return (
    <>
     <div className="header">
       <div className="logo">
         <img src={logo} alt="logo" height="50px" />
          Poll
       </div>
       <ConnectButton />
     </div>
     <div className="instructions">
       Help us make a better decision with your votes 
     </div>
     <div className="subinstructions">
       Vote up or down for the presented polls

     </div>
     <div className="list">
       <Coin
     perc={poll}
     setPerc={setPoll}
     token={"Reconstruct Lab"}
     />
     <Coin
     perc={poll2}
     setPerc={setPoll2}
     token={"Nike PartnerShip"}
     />
    
     </div>
     
    </>
  );
};

export default App;