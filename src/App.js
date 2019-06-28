import React from 'react';
import WebSocketFunction from './components/WebSocket';
import OverrideEvents from './components/OverrideEvents';

function App() {
  const stocks_details = ['Infosys', 'Reliance', 'Kotak', 'SBI'];
  return (<div>
    {
      <WebSocketFunction stocksDetails={stocks_details}/>
    }
    {
      <OverrideEvents />
    }
  </div>);
}

export default App;
