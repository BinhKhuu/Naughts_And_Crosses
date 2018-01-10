import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import './index.css'

class Squares extends React.Component {
	render () {
		var bgColor = 'white';
		var value = (this.props.value === 'X' || this.props.value === 'O') ? this.props.value : ' ';
		if(this.props.winRow.includes(this.props.num)) bgColor = (this.props.value === 'X') ? 'red' : 'yellow';
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
			gameOver: false,
			winRow: Array(3).fill(null),
			score: Array(2).fill(0,0),
			player: '',
			player2: '',
			computer: '',
			difficulty: 10
		}
		this.handleClick = this.handleClick.bind(this);
		this.resetGame = this.resetGame.bind(this);
		this.setPlayer = this.setPlayers.bind(this);
		this.setDifficutly = this.setDifficutly.bind(this);
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
		if(this.state.player === '') alert('select X or O');
		else if(!this.state.gameOver){	
			if(this.state.game[i] === 'X' || this.state.game[i] === 'O') {			
			} else {
				var player = this.state.player;
				var nextPlayer = (player === 'X') ? 'O' : 'X';
				var game = update(this.state.game, {$splice:[[i,1,player]]});	
				var win = this.checkWinner(game,player);
				if(win.winner) {
					var score = this.updateScore(player);
					this.setState({game:game, gameOver: true, winRow: win.winRow, score: score, player: 'nextPlayer'})
				} else {
					this.setState({game:game, player: nextPlayer},()=>{
						var freeSquares = this.emptyIndexies(this.state.game.slice(0))
						if(freeSquares.length > 0) {
							this.computerTurn(game.slice(0),nextPlayer,this.state.difficulty);
						}					
					});
				}
			}
		}
	}

	setPlayers(player) {
		if(this.state.computer === '') {
			var game = this.state.game.slice(0);
			var computer = (player === 'O') ? 'O' : 'X';
			//X is always first , generate move if player is O
			if(player === 'O') {
				var compMove = this.minmax(game,'X',this.state.difficulty);
				game[compMove.index] = 'X';	
			} 	
			this.setState({game:game, computer: computer, player: player});
		}
	}

	computerTurn(game,player,depth) {
		var move = this.minmax(game.slice(0),player,depth);
		game[move.index] = player;
		var nextPlayer = (player === 'X') ? 'O' : 'X';
		var score = this.updateScore(player);
		var win = this.checkWinner(game,player);
		if(win.winner) {
			score = this.updateScore(player);
			this.setState({game:game, gameOver: true, winRow: win.winRow, score: score, player: nextPlayer})
		} else {
			this.setState({game:game, player: nextPlayer});			
		}
	}

	minmax(game,player,depth) {
		var freeSquares = this.emptyIndexies(game);
		var checkX = this.checkWinner(game,'X');
		var checkO = this.checkWinner(game,'O');
		if(checkX.winner) return {score: -10};
		else if(checkO.winner) return {score: 10};
		else if (freeSquares.length === 0) return {score: 0};
		var moves = [];
		depth = (depth >= freeSquares.length) ? freeSquares.length : depth;
		for(var i = 0; i < depth; i++) {
			var move = {};
			var result = {};
			move.index = game[freeSquares[i]];
			game[freeSquares[i]] = player;
			if(player === 'O') {
				result = this.minmax(game.slice(0), 'X',depth);
				move.score = result.score;
			} else {
				result = this.minmax(game.slice(0), 'O', depth);
				move.score = result.score;
			}
			//remove current move and try next avalible move
			game[freeSquares[i]] = move.index;
			moves.push(move);
		}
		var bestMove;
		var bestScore;
		if(player === 'O') {
			bestScore = -10000;
			for(i = 0; i < moves.length; i++) {
				if(moves[i].score > bestScore) {
					bestScore = moves[i].score;
					bestMove = i;
				}
			}
		} else {
			bestScore = 10000;
			for(i = 0; i < moves.length; i++) {
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

	resetGame() {
		var newGame = [0,1,2,3,4,5,6,7,8];
		var winRow = Array(3).fill(null);
		//X is always first generate move for X if player is O
		if(this.state.computer === 'O') {
			var compMove = this.minmax(newGame,'X',this.state.difficulty);
			newGame[compMove.index] = 'X';	
			this.setState({game: newGame, gameOver: false, winRow: winRow});
		} else {
			this.setState({game: newGame, gameOver: false, winRow: winRow, player: 'X'});
		}		
	}
	setDifficutly(mode) {
		this.setState({difficulty:mode});
	}
	render () {
		var xHighlight = (this.state.player === 'X') ? 'inset 0 0 0 1px #C1CFDA, inset 0 0 20px #193047' : '';
		var oHighlight = (this.state.player === 'O') ? 'inset 0 0 0 1px #C1CFDA, inset 0 0 20px #193047' : '';
		var freeSquares = this.emptyIndexies(this.state.game.slice(0));
		var resetDisplay = (this.state.gameOver || freeSquares.length === 0) ? ' ' : 'none';
		if(freeSquares.length === 0 && !this.state.gameOver) {
			alert('Draw!');
		}
		return (	
			<div className='container-fluid background'>
				<div className='scoreboard row'>
					<div className='col-md-6 score-X' onClick={() => this.setPlayers('X')} style={{background:'red',boxShadow:xHighlight}}><span>X</span><span className='player-score'>{(this.state.score[0] === 0) ? '-' : this.state.score[0]}</span></div>
					<div className='col-md-6 score-O' onClick={() => this.setPlayers('O')} style={{background:'yellow',boxShadow:oHighlight}}><span>O</span><span className='player-score'>{(this.state.score[1] === 0) ? '-' : this.state.score[1]}</span></div>
				</div>
				<div className='reset-btn' style={{display:resetDisplay}}><button onClick={this.resetGame}>reset</button></div>
				<div className='diff-btn' ><button onClick={()=> this.setDifficutly(2)}>Easy</button></div>
				<div className='diff-btn' ><button onClick={()=> this.setDifficutly(3)}>Medium</button></div>
				<div className='diff-btn' ><button onClick={()=>this.setDifficutly(9)}>Hard</button></div>
				<div className='board'>
				{this.state.game.map((x,i)=>{
					return <Squares key={'square-'+ i} num={i} handleClick={()=> this.handleClick(i)} value={this.state.game[i]} winRow={this.state.winRow}  />
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