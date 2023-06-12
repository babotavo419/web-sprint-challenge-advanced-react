import React from 'react'

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

getXY = () => {
  const x = this.state.index % 3 + 1; 
  const y = Math.floor(this.state.index / 3) + 1;
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
  this.setState({ index: newIndex, steps: this.state.steps + 1 });
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
}

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">Coordinates (2, 2)</h3>
          <h3 id="steps">You moved 0 times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === 4 ? ' active' : ''}`}>
                {idx === 4 ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message"></h3>
        </div>
        <div id="keypad">
          <button id="left">LEFT</button>
          <button id="up">UP</button>
          <button id="right">RIGHT</button>
          <button id="down">DOWN</button>
          <button id="reset">reset</button>
        </div>
        <form>
          <input id="email" type="email" placeholder="type email"></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
