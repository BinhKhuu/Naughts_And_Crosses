import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import './index.css'

class Squares extends React.Component {
	render () {
		return (
			<div className='square' onClick={this.props.handleClick} >
				<div className='sq-val'><h1>{this.props.value}</h1></div>
			</div>
		)
	}
}

class Board extends React.Component {
	constructor() {
		super();
		this.state = {
			game: Array(9).fill(' '),
			xTurn: true,
			turnCount: 0
		}
		this.handleClick = this.handleClick.bind(this);
	}
	checkWinner(i) {
		if(!this.state.game.includes(' ')) {
			alert('game over!');
		}else if(this.state.turnCount >= 5) {
			var game = this.state.game;
			var icon = game[i];
			if(icon === game[0] && icon === game[1] && icon == game[2] ) alert(icon + ' wins');
			if(icon === game[3] && icon === game[4] && icon == game[5] ) alert(icon + ' wins');
			if(icon === game[6] && icon === game[7] && icon == game[8] ) alert(icon + ' wins');
			if(icon === game[0] && icon === game[4] && icon == game[8] ) alert(icon + ' wins');
			if(icon === game[2] && icon === game[4] && icon == game[6] ) alert(icon + ' wins');
			if(icon === game[0] && icon === game[3] && icon == game[6] ) alert(icon + ' wins');
			if(icon === game[1] && icon === game[4] && icon == game[7] ) alert(icon + ' wins');
			if(icon === game[2] && icon === game[5] && icon == game[8] ) alert(icon + ' wins');
		}

	}
	handleClick(i) {
		//check winner / game over
		if(this.state.game[i] === 'X' || this.state.game[i] === 'O') {
			alert('NO!')
		} else {
			var value = this.state.xTurn ? 'X' : 'O';
			var xTurn = (value === 'X') ? false: true;
			var count = this.state.turnCount + 1;
			var game = update(this.state.game, {$splice:[[i,1,value]]});
			this.setState({game: game, xTurn: xTurn, turnCount: count}, () => this.checkWinner(i));
		}
	}
	render () {
		return (			
			<div className='container-fluid background'>
				<div className='board'>
				{this.state.game.map((x,i)=>{
					return <Squares key={'square-'+ i} num={i} handleClick={()=> this.handleClick(i)} value={this.state.game[i]} />
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