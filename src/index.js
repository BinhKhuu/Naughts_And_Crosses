import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import './index.css'

class Squares extends React.Component {
	render () {
		var bgColor = 'white';
		var value = (this.props.value === 'X' || this.props.value === 'O') ? this.props.value : ' ';
		if(this.props.winRow.includes(this.props.num)) bgColor = 'yellow';
		return (
			<div className='square' onClick={this.props.handleClick} style={{background: bgColor}}>
				<div className='sq-val'><h1>{value}</h1></div>
			</div>
		)
	}
}

class Board extends React.Component {
	constructor() {
		super();
		//game fill 0-8 represent index values
		this.state = {
			game: [0,1,2,3,4,5,6,7,8],
			turnCount: 0,
			gameOver: false,
			winRow: Array(3).fill(null),
			score: Array(2).fill(0,0),
			player: 'X',
		}
		this.handleClick = this.handleClick.bind(this);
		this.resetGame = this.resetGame.bind(this);
	}
	checkWinner(game,player) {
		var win = {winner:false,winRow:null};
		if(player === game[0] && player === game[1] && player === game[2] ) win = win = {winner:true,winRow:[0,1,2]};
		else if(player === game[3] && player === game[4] && player === game[5] ) win = {winner:true,winRow:[3,4,5]};
		else if(player === game[6] && player === game[7] && player === game[8] ) win = {winner:true,winRow:[6,7,8]};
		else if(player === game[0] && player === game[4] && player === game[8] ) win = {winner:true,winRow:[0,4,8]};
		else if(player === game[2] && player === game[4] && player === game[6] ) win = {winner:true,winRow:[2,4,6]};
		else if(player === game[0] && player === game[3] && player === game[6] ) win = {winner:true,winRow:[0,3,6]};
		else if(player === game[1] && player === game[4] && player === game[7] ) win = {winner:true,winRow:[1,4,7]};
		else if(player === game[2] && player === game[5] && player === game[8] ) win = {winner:true,winRow:[2,5,8]};
		return win;		
	}
	updateScore(player){
		var scoreIndex = (player === 'X') ? 0 : 1;
		var score = [this.state.score[0],this.state.score[1]];
		score[scoreIndex] += 1;		
		return score;
	}

	handleClick(i) {
		if(!this.state.gameOver){	
			if(this.state.game[i] === 'X' || this.state.game[i] === 'O') {			
			} else {
				var player = this.state.player;
				var nextPlayer = (player === 'X') ? 'O' : 'X';
				var count = this.state.turnCount + 1;
				var game = update(this.state.game, {$splice:[[i,1,player]]});	
				var win = this.checkWinner(game,player);
				if(win.winner) {
					var score = this.updateScore(player);
					this.setState({game:game,turnCount: count, gameOver: true, winRow: win.winRow, score: score, player: nextPlayer})
				} else {
					this.setState({game:game, turnCount: count, player: nextPlayer},()=>{
						if(count < 9) {
							this.minmax(game.slice(0),'O');
						}					
					});
				}
			}
		}
	}
	minmax(game,player) {
		var move = {};
		move = this.computerTurn(game.slice(0),'O');
		game[move.index] = 'O';
		var count = this.state.turnCount + 1;
		var nextPlayer = (player === 'X') ? 'O' : 'X';
		var score = this.updateScore(player);
		var win = this.checkWinner(game,player);
		if(win.winner) {
			var score = this.updateScore(player);
			this.setState({game:game,turnCount: count, gameOver: true, winRow: win.winRow, score: score, player: nextPlayer})
		} else {
			this.setState({game:game, turnCount: count, player: nextPlayer});			
		}
	}

	computerTurn(game,player) {
		var freeSquares = this.emptyIndexies(game);
		var checkX = this.checkWinner(game,'X');
		var checkO = this.checkWinner(game,'O');
		if(checkX.winner) return {score: -10};
		else if(checkO.winner) return {score: 10};
		else if (freeSquares.length === 0) return {score: 0};
		var moves = [];
		for(var i = 0; i < freeSquares.length; i++) {
			var move = {};
			move.index = game[freeSquares[i]];
			game[freeSquares[i]] = player;
			if(player === 'O') {
				var result = this.computerTurn(game.slice(0), 'X');
				move.score = result.score;
			} else {
				var result = this.computerTurn(game.slice(0), 'O');
				move.score = result.score;
			}
			//remove current move and try next avalible move
			game[freeSquares[i]] = move.index;
			moves.push(move);
		}
		var bestMove;
		if(player === 'O') {
			var bestScore = -10000;
			for(var i = 0; i < moves.length; i++) {
				if(moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} else {
			var bestScore = 10000;
			for(var i = 0; i < moves.length; i++) {
				if(moves[i].score < bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		}
		return moves[bestMove];
	}

	emptyIndexies(game) {
		return game.filter(s => s !== 'O' && s !== 'X');
	}
	minMax() {

	}
	resetGame() {
		var newGame = [0,1,2,3,4,5,6,7,8];
		var winRow = Array(3).fill(null);
		this.setState({game: newGame, turnCount: 0, gameOver: false, winRow: winRow});
	}
	render () {
		var xBgColor = (this.state.player === 'X') ? 'yellow' : 'white';
		var oBgColor = (this.state.player === 'O') ? 'yellow' : 'white';
		var resetDisplay = (this.state.gameOver || this.state.turnCount >= 9) ? ' ' : 'none';
		if(this.state.turnCount >= 9 && !this.state.gameOver) {
			alert('Draw!');
		}
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