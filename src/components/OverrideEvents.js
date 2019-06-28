import React from 'react';
export default function OverrideEvents(props)
{
    const [sProp, setSProp] = React.useState(false);
    React.useEffect(() => {
        console.log(sProp);
        if(sProp)
        {
            document.getElementById("spb").style.backgroundColor="green";
        }
        else
        {
            document.getElementById("spb").style.backgroundColor="red";
        }
    },[sProp]);
    function buttonToogle(e)
    {
        setSProp(prevValue => {return !prevValue;});
    }
    function customHandleKeyPress(e)
    {
        e.preventDefault();
        document.getElementById("tbox").value=e.which;
    }
    function customHrefClick(e)
    {
        e.preventDefault();
        alert("Sorry you cannot goto facebook");
    }

    function div2Alert(e)
    {
        alert("div 2 is clicked");
        if(sProp)
        {
            e.stopPropagation();
        }
    }

    return <div>
        <input type="text" id="tbox" onKeyPress = {customHandleKeyPress} />
        <hr />
        <a href="https://google.com">Click this link to goto google page</a>
        <hr />
        <a href="https://facebook.com" onClick={customHrefClick}>Click this for custom click event</a>
        <hr />
        <hr />
        <div className="spDiv" onClick = {() => {alert("Div 1 is clicked");}}>This is the first div
            <div onClick={(e) => {div2Alert(e)}}>This is the second div</div>
        </div>
        <button onClick={buttonToogle} id="spb">StopPropagation</button>
    </div>;
}