import React, { useState, useEffect } from 'react';
import logo from './blockchain-service.svg';
import './App.css';
import { useToasts } from 'react-toast-notifications'

import Web3 from "web3"
import abi from "./abis/contract"

var provider = new Web3.providers.WebsocketProvider("wss://x5engine.blockchain.azure.com:3300/E-FlUTqcGM65Si6SaBQwe6sg");
var web3 = new Web3(provider);

var myContract = new web3.eth.Contract(abi, '0x89da55DFda82E2874E5d7054D772FFFCF488C38B');

function App() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");
  const { addToast } = useToasts()

  useEffect(() => {
    subscribe2Events()
  }, []);

  

  const handleChange =  (e) => {
    setText(e.target.value)
  }

  const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  const subscribe2Events =  () => {
    var subscription = web3.eth.subscribe('logs', {
      address: '0x89da55DFda82E2874E5d7054D772FFFCF488C38B',
    }, function (error, result) {
        console.log("subscription",error, result);
    });
    console.log("myContract", myContract);
    onSubmit("Connected to Contract 0x89da55DFda82E2874E5d7054D772FFFCF488C38B")
    myContract.events.allEvents({ fromBlock: 'latest' }, function (error, event) { console.log("events logs",error,event); })
      .on("connected", (subscriptionId) => {
        console.log("connected subscriptionId:",subscriptionId);
      })
      .on('data', async (event) => {//Here we get the events
        console.log("data",event); // we log it for debugging purposes only
        //we then get the tranasction receipt to get all other info needed
        const receipt = await web3.eth.getTransactionReceipt(event.transactionHash);
        const block = await web3.eth.getBlock(receipt.blockNumber)//getting the block number is essential to get the timestamp
        const time = timeConverter(block.timestamp);//converting it to a readable date
        const readableMessage = "Event " + event.event +" time: " + time + ' from account ' + receipt.from +" blockNumber = " + receipt.blockNumber
        console.log(readableMessage, block);// we log it for debugging purposes only
        onSubmit(readableMessage, false, true, 15000)//show a toast message
        onSubmit("Event " + event.event +" Data: "+JSON.stringify(event.returnValues), false, true, 15000)//show a toast message for data received from the event 
      })
      .on('changed', (event) => {
        console.log("changed", event)
      })
      .on('error', (error, receipt) => {
        console.log(error, receipt)
      });
  }

  const onSubmit = async (value, error, autoDismiss = true, autoDismissTimeout = 5000) => {
    if (error) {
      addToast(error, {
        appearance: 'error',
        autoDismiss: true,
      })
    } else {
      addToast(value, {
        appearance: 'info',
        autoDismiss,
        autoDismissTimeout 
     })
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h6>
          Provenance tracking dApp with no centralized database
        </h6>
        <p>
          Shows history of events which includes the state change data, approximate time based on block/transaction data along with the user address of the user who made the change.
        </p>
        <br />
        <br />
        <a
          className="App-link"
          onClick={() => onSubmit("Azure Blockchain Service is Awesome!")}
        >
          Azure Blockchain Service
        </a>
      </header>
    </div>
  );
}

export default App;
