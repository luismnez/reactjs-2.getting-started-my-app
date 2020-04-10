import React, { useState } from 'react';
import './App.css';

function App() {
  
  const Button = (props) => {
    return (
      <button onClick={() => props.onClickFunction(props.increment)}>
        +{props.increment}
      </button>
    );
  }

  const Display = (props) => {
    return (
      <div>
        {props.message}
      </div>
    );
  }

  const App = () => {
    let [counter, setCounter] = useState(5);
    
    const incrementCounter = (increment) => setCounter(counter+increment);

    return (
      <>
        <Button onClickFunction={incrementCounter} increment={1}/>
        <Button onClickFunction={incrementCounter} increment={5}/>
        <Button onClickFunction={incrementCounter} increment={10}/>
        <Button onClickFunction={incrementCounter} increment={100}/>
        <Display message={counter} />
      </>
    );
  }

  return (
    <App />
  );
}

export default App;
