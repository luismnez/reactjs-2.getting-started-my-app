import React, { useState } from 'react';
import './StarMatch.css';

const StarsDisplay = (props) => {
  return (
    utils.range(1, props.starts).map( starId =>
      <div key={starId} className="star" />
    )
  );
}

const PlayNumber = (props) => {
  return (
    <button 
      className="number"
      style={{backgroundColor: colors[props.status]}} 
      onClick={() => props.onClick(props.number, props.status)}
    >
        {props.number}
    </button>
  );
}

const PlayAgain = (props) => {
  return (
    <div className="game-done">
      <div 
        className="message"
        style={{ color: props.gameStatus === 'lost' ? 'red' : 'green'}}
      >
        {props.gameStatus === 'lost' ? 'Game Over' : 'Nice'}
      </div>
      <button onClick={props.onClick}>Play Again</button>
    </div>
  );
}

// Custom Hook
//To declare the State and manage the State.
const useGameState = () => {
  const [starts, setStarts] = useState(utils.random(1, 9));
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [secondLeft, setSecondsLeft] = useState(10);
  
  React.useEffect(() => {
    if (secondLeft > 0 && availableNums.length > 0) {
      const timerId = setTimeout(() => {
        setSecondsLeft(secondLeft - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    }
  });

  const setGameState = (newCandidateNums) => {
    if(utils.sum(newCandidateNums) !== starts) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStarts(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  }

  const resetGame = () => {
    setStarts(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
    setSecondsLeft(10);
  }

  return { starts, availableNums, candidateNums, secondLeft, setGameState, resetGame }
}

const StarMatch = () => {

  const {starts, availableNums, candidateNums, secondLeft, setGameState, resetGame} = useGameState();

  const candidateAreWrong = utils.sum(candidateNums) > starts;
  const gameStatus = availableNums.length === 0
    ? 'won'
    : secondLeft === 0 ? 'lost' : 'active';

  const numberStatus = (number) => {
    if (!availableNums.includes(number)) {
      return 'used';
    }
    if (candidateNums.includes(number)) {
      return candidateAreWrong ? 'wrong' : 'candidate';
    }
    return 'available';
  };

  const onNumberClick = (number, currentStatus) => {
    if (gameStatus !== 'active' || currentStatus === 'used') {
      return;
    }

    const newCandidateNums = 
      currentStatus === 'available'
      ? candidateNums.concat(number)
      : candidateNums.filter(cn => cn !== number);

    setGameState(newCandidateNums);
  }

  return (
    <>
      <div className="game">
        <div className="help">
          Pick 1 or more numbers that sum to the number of starts
        </div>
        <div className="body">
          <div className="left">
            {gameStatus !== 'active' ? (<PlayAgain onClick={resetGame} gameStatus={gameStatus} />) : (<StarsDisplay starts={starts}/>)}
            
          </div>
          <div className="right">
            {utils.range(1, 9).map( number =>
              <PlayNumber 
                key={number}
                status={numberStatus(number)} 
                number={number}
                onClick={onNumberClick}
              />
            )}
          </div>
        </div>
        <div className="timer">Time Remaining: {secondLeft}</div>
      </div>
    </>
  );
}

// Color Theme
const colors = {
  available: 'lightgray',
  used: 'lightgreen',
  wrong: 'lightcoral',
  candidate: 'deepskyblue',
};

// Math science
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  },
};

export default StarMatch;
