import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

class Squares extends React.Component {
	constructor() {
		super();
		this.state = {
			value: 'X'
		}
	}
	handleClick(i) {
		console.log(i +' clicked');
		var value = (this.state.value === 'X') ? 'O' : 'X';
		this.setState({value: value});
	}
	render () {
		return (
			<div className='square' onClick={() => this.handleClick(this.props.num) }><h1>{this.state.value}</h1></div>
		)
	}
}

class Board extends React.Component {
	render () {
		var squares = Array(9).fill(0);
		console.log(squares);
		return (			
			<div className='container-fluid background'>
				<div className='board'>
				{squares.map((x,i)=>{
					return <Squares key={'square-'+ i} num={i}/>
				})}
				</div>
			</div>
		)
	}

}

ReactDOM.render(
  <Board />,
    document.getElementById('root')
);