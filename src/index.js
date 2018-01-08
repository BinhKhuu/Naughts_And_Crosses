import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import './index.css'

class Squares extends React.Component {
	render () {
		var bgColor = 'white';
		if(this.props.winRow.includes(this.props.num)) bgColor = 'yellow';
		return (
			<div className='square' onClick={this.props.handleClick} style={{background: bgColor}}>
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
			turnCount: 0,
			gameOver: false,
			winRow: Array(3).fill(null),
			score: Array(2).fill(0,0),
			player: 'X',
		}
		this.handleClick = this.handleClick.bind(this);
		this.resetGame = this.resetGame.bind(this);
	}
	checkWinner(i) {
		if(this.state.turnCount >= 5) {
			var game = this.state.game;
			var player = game[i];
			var scoreIndex = (player === 'X') ? 0 : 1;
			var score = [this.state.score[0],this.state.score[1]];
			score[scoreIndex] += 1;
			if(player === game[0] && player === game[1] && player === game[2] ) this.updateScore(player,0,1,2);
			else if(player === game[3] && player === game[4] && player === game[5] ) this.updateScore(player,3,4,5);
			else if(player === game[6] && player === game[7] && player === game[8] ) this.updateScore(player,6,7,8); 
			else if(player === game[0] && player === game[4] && player === game[8] ) this.updateScore(player,0,4,8); 
			else if(player === game[2] && player === game[4] && player === game[6] ) this.updateScore(player,2,4,6); 
			else if(player === game[0] && player === game[3] && player === game[6] ) this.updateScore(player,0,3,6); 
			else if(player === game[1] && player === game[4] && player === game[7] ) this.updateScore(player,1,4,7); 
			else if(player === game[2] && player === game[5] && player === game[8] ) this.updateScore(player,2,5,8); 
			else if(this.state.turnCount === 9) {
			alert('game over!');
			this.setState({gameOver: true});
			}		
		}
	}
	updateScore(player, i,j,k) {
		var scoreIndex = (player === 'X') ? 0 : 1;
		var score = [this.state.score[0],this.state.score[1]];
		score[scoreIndex] += 1;		
		this.setState({gameOver: true, winRow: [i,j,k], score: score}, ()=> alert(player + ' wins'));
	}
	handleClick(i) {
		if(!this.state.gameOver){		
			if(this.state.game[i] === 'X' || this.state.game[i] === 'O') {
				alert('NO!')
			} else {
				var player = this.state.player;
				var nextPlayer = (player === 'X') ? 'O' : 'X';
				var count = this.state.turnCount + 1;
				var game = update(this.state.game, {$splice:[[i,1,player]]});
				this.setState({game: game, turnCount: count, player: nextPlayer}, () => this.checkWinner(i));
			}
		}
	}
	resetGame() {
		var newGame = Array(9).fill(' ');
		var winRow = Array(3).fill(null);
		this.setState({game: newGame, turnCount: 0, gameOver: false, winRow: winRow});
	}
	render () {
		var xBgColor = (this.state.player === 'X') ? 'yellow' : 'white';
		var oBgColor = (this.state.player === 'O') ? 'yellow' : 'white';
		var resetDisplay = (this.state.gameOver) ? ' ' : 'none';
		return (	
			<div className='container-fluid background'>
				<div className='scoreboard row'>
					<div className='col-md-6 score-X' style={{background:xBgColor}}><span>X</span><span className='player-score'>{(this.state.score[0] === 0) ? '-' : this.state.score[0]}</span></div>
					<div className='col-md-6 score-O' style={{background:oBgColor}}><span>O</span><span className='player-score'>{(this.state.score[1] === 0) ? '-' : this.state.score[1]}</span></div>
				</div>
				<div className='reset-btn' style={{display:resetDisplay}}><button onClick={this.resetGame}>reset</button></div>
				<div className='board'>
				{this.state.game.map((x,i)=>{
					return <Squares key={'square-'+ i} num={i} handleClick={()=> this.handleClick(i)} value={this.state.game[i]} winRow={this.state.winRow} />
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