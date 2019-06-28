import React, {useState, useEffect} from 'react';
export default function WebSocketFunction(props)
{
    const [stocks, setStocks] = useState([{stock: "SBI", price: 0}
    ,{stock: "Infosys", price: 0},
    {stock: "Kotak", price: 0},
    {stock: "Reliance", price: 0}]);
    // const stocksDetails = props.stocksDetails;

    useEffect(
        () => {
            //componentDidMount
            var webSocketConnection = new WebSocket("ws://localhost:8000");
            webSocketConnection.onopen = () => {/* console.log("Connection opened") */};
            //componentOnUpdate
            console.log("Stocks reading ...");
            webSocketConnection.onerror = (err) => {console.error(err);};
            webSocketConnection.onmessage = (m) => {setStocks(prevState => {
                let a= JSON.parse(m.data);
                prevState.map((v,i) => {
                    if(a[i].price > v.price)
                    {
                        document.getElementById(v.stock).style.color = "green";
                    }
                    else if(a[i].price < v.price)
                    {
                        document.getElementById(v.stock).style.color = "red";
                    }
                    else
                    {
                        document.getElementById(v.stock).style.color = "yellowgreen";
                    }
                });
                return a;
            })};
            //componentWillUnmount
            return () => {
                webSocketConnection.onclose = () => {console.log("Connection close")};
                webSocketConnection.close();
            };
        },
        [stocks]
    );

    return (<div>
        <ul>
            {
                stocks.map((v,i) => {
                    return <li key={i}>{v.stock} <span id={v.stock}>{v.price}</span></li>;
                })
            }
        </ul>
    </div>)
}