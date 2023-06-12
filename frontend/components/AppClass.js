import React from 'react'
import axios from 'axios'
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps,
}

export default class AppClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.move = this.move.bind(this);
    this.reset = this.reset.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

  }

getXY = () => {
  const x = this.state.index % 3 + 1; 
  const y = Math.floor(this.state.index / 3) + 1;
    return [x, y];
}
  
getXYMessage = () => {
  const [x, y] = this.getXY();
  return `Coordinates (${x}, ${y})`;
}

reset = () => {
  this.setState(initialState);
}

getNextIndex = (direction) => {
  let newIndex = this.state.index;
  switch (direction) {
    case 'left':
      if (newIndex % 3 > 0) newIndex -= 1;
      break;
    case 'up':
      if (newIndex - 3 >= 0) newIndex -= 3;
      break;
    case 'right':
      if (newIndex % 3 < 2) newIndex += 1;
      break;
    case 'down':
      if (newIndex + 3 < 9) newIndex += 3;
      break;
  }
  return newIndex;
}

move = (evt) => {
  const direction = evt.target.id;
  const newIndex = this.getNextIndex(direction);
  if (newIndex === this.state.index) {
    this.setState({ message: `You can't go ${direction}` });
  } else {
    this.setState({ index: newIndex, steps: this.state.steps + 1, message: initialMessage });
  }
}


onChange = (evt) => {
  this.setState({ email: evt.target.value });
}

onSubmit = async (evt) => {
  evt.preventDefault();
  const [x, y] = this.getXY();
  try {
    const response = await axios.post('http://localhost:9000/api/result', {
      x,
      y,
      steps: this.state.steps,
      email: this.state.email,
    });
    this.setState({ message: response.data.message });
  } catch (error) {
    this.setState({ message: error.response.data.message });
  }

    this.setState({ email: initialEmail });
  }


render() {
  const { className } = this.props
  return (
    <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
        <h3 id="steps">You moved {this.state.steps} time{this.state.steps === 1 ? '' : 's'}</h3>
      </div>
          <div id="grid">
            {
              [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
          <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}> 
              {idx === this.state.index ? 'B' : null} 
          </div>
          ))
            }
          </div>
      <div className="info">
      <h3 id="message">{this.state.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={this.move}>LEFT</button>   
        <button id="up" onClick={this.move}>UP</button>     
        <button id="right" onClick={this.move}>RIGHT</button>  
        <button id="down" onClick={this.move}>DOWN</button>  
        <button id="reset" onClick={this.reset}>reset</button>  
      </div>
      <form onSubmit={this.onSubmit}>
        <input id="email" type="email" placeholder="type email" value={this.state.email} onChange={this.onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
}

