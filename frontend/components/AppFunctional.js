import React, { useState } from 'react'
import axios from 'axios';

const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);

  function getXY() {
    const x = index % 3 + 1;
    const y = Math.floor(index / 3) + 1;
    return [x, y];
  }

  function getXYMessage() {
    const [x, y] = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setIndex(initialIndex);
    setSteps(initialSteps);
  }

  function getNextIndex(direction) {
    let newIndex = index;
    switch (direction) {
        case "left":
            if (index % 3 !== 0) {
                newIndex = index - 1;
            }
            break;
        case "up":
            if (index >= 3) {
                newIndex = index - 3;
            }
            break;
        case "right":
            if (index % 3 !== 2) {
                newIndex = index + 1;
            }
            break;
        case "down":
            if (index <= 5) {
                newIndex = index + 3;
            }
            break;
        default:
            break;
    }
    return newIndex;
}

function move(evt) {
    const direction = evt.target.id; 
    const newIndex = getNextIndex(direction);
    
    if (newIndex === index) {
      setMessage(`You can't go ${direction}`);
    } else {
        setIndex(newIndex);
        setSteps(steps + 1);
    }
}

function onChange(evt) {
  setEmail(evt.target.value);
}

function onSubmit(evt) {
  evt.preventDefault(); 
  const [x, y] = getXY();
  axios.post('http://localhost:9000/api/result', {
    x,
    y,
    steps: steps,
    email: email,
  })
  .then(response => {
    setMessage(response.data.message);
    setEmail(''); 
  })
  .catch(error => {
    setMessage(error.response ? error.response.data.message : 'Something went wrong!');
  });
}


return (
  <div id="wrapper" className={props.className}>
    <div className="info">
      <h3 id="coordinates">{getXYMessage()}</h3>
      <h3 id="steps">You moved {steps} time{steps === 1 ? '' : 's'}</h3>
    </div>
    <div id="grid">
      {
        [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))
      }
    </div>
    <div className="info">
      <h3 id="message">{message}</h3>
    </div>
    <div id="keypad">
      <button id="left" onClick={move}>LEFT</button>
      <button id="up" onClick={move}>UP</button>
      <button id="right" onClick={move}>RIGHT</button>
      <button id="down" onClick={move}>DOWN</button>
      <button id="reset" onClick={reset}>reset</button>
    </div>
    <form onSubmit={onSubmit}>
      <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
      <input id="submit" type="submit"></input>
    </form>
  </div>
)
}

