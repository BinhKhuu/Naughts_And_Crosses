import React from 'react';
import ReactDOM from 'react-dom';
import update from 'immutability-helper';
import './index.css';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

/* Individual Square on a naught and crosses game board
 * @props.value, " " or X or O to display on square
 * @props.winRow, index of row that has winning combination (three X or O in a row)
                  used to highlight that square
 * @props.num, index of the square (current)
 */

class Squares extends React.Component {
	render () {
		var bgColor = 'white';
		var value = (this.props.value === 'X' || this.props.value === 'O') ? this.props.value : ' ';
		if(this.props.winRow.includes(this.props.num)) bgColor = (this.props.value === 'X') ? 'red' : 'yellow';
		return (
            <div 
                className='square' 
                onClick={this.props.handleClick} 
                style={{background: bgColor}}
            >
                <div className='sq-val'>
                    <h1>{value}</h1>
                </div>
            </div>
		)
	}
}
/* Individual Square on a naught and crosses game board
 * @state.game, Array holding current game information
                index 1 = [0,0], index 2 = [0,1] etc
 * @state.gameOver, boolean flag check if game is finished
 * @state.value, " " or X or O to display on square
 * @state.score, Score for current session (wins) 
 * @state.winRow, index of row that has winning combination (three X or O in a row)
                  used to highlight that square
 * @state.player, player Symbol X or O (default X)
 * @difficutly, difficulty of AI
 * @state.computer, AI symbol (default O)
 * @state.dropdownOPen, toggle for difficutly dropdown menu
 */
class Board extends React.Component {
	constructor() {
		super();
		//game fill 0-8 represent index values
		this.state = {
			game: [0,1,2,3,4,5,6,7,8],
			gameOver: false,
			winRow: Array(3).fill(null),
			score: Array(2).fill(0,0),
			player: 'X',
			computer: 'O',
			difficulty: 9,
			dropdownOpen: false,
		}
		this.handleClick = this.handleClick.bind(this);
		this.resetGame = this.resetGame.bind(this);
		this.setPlayer = this.setPlayers.bind(this);
		this.setDifficutly = this.setDifficutly.bind(this);
		this.diffToggle = this.diffToggle.bind(this);
		this.newGame = this.newGame.bind(this);
	}

    /* checks if the current player has won the game
     * @game, current game board with position of play/ai moves
     * @player, symbol (X / O) represents the player we are checking  
     * @return, boolean true = winner, false = no winner 
     */
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

	diffToggle() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen
		});
	}

    /* updates score for each player at end of game
     * @player,symbol (X / O) represents the player we are checking 
     * @return, integer score for @player
     */
	updateScore(player){
		var scoreIndex = (player === 'X') ? 0 : 1;
		var score = [this.state.score[0],this.state.score[1]];
		score[scoreIndex] += 1;		
		return score;
	}

    /* updates score for each player at end of game
     * @i, index location of clicked square
     */    
	handleClick(i) {
		if(this.state.player === '') alert('select X or O');
		else if(!this.state.gameOver){	
			if(this.state.game[i] !== 'X' || this.state.game[i] !== 'O') {			
				var player = this.state.player;
				var game = update(this.state.game, {$splice:[[i,1,player]]});	
				var win = this.checkWinner(game,player);
				if(win.winner) {
					var score = this.updateScore(player);
					this.setState({game:game, gameOver: true, winRow: win.winRow, score: score})
				} else {
					this.setState({game:game},()=>{
						var freeSquares = this.emptyIndexies(this.state.game.slice(0))
						if(freeSquares.length > 0) {
							this.computerTurn(game.slice(0),this.state.difficulty);
						}					
					});
				}
			}
		}
	}
    /* sets symbol (X / O ) for AI and user
     * @player,symbol (X / O) represents the player we are checking  
     */
	setPlayers(player) {
		if(this.state.computer === '') {
			var game = this.state.game.slice(0);
			var computer = (player === 'O') ? 'X' : 'O';
			//X is always first , generate move if player is O
			if(player === 'O') {
				var compMove = this.minmax(game,'X',this.state.difficulty);
				game[compMove.index] = 'X';	
			} 	
			this.setState({game:game, computer: computer, player: player});
		}
	}
    /* run AI turn
     * @game, current game with player/ai moves
     * @depth, integer represents difficulty, how far down minimax do search 
     */
	computerTurn(game,depth) {
		var move = this.minmax(game.slice(0),this.state.computer,depth);
		game[move.index] = this.state.computer;
		var score = this.updateScore(this.state.computer);
		var win = this.checkWinner(game,this.state.computer);
		if(win.winner) {
			this.setState({game:game, gameOver: true, winRow: win.winRow, score: score})
		} else {
			this.setState({game:game});			
		}
	}
    /* run minmax alorithm for AI turn
     * @game, current game with player/ai moves
     * @depth, integer represents difficulty, how far down minimax do search 
     * @player,symbol (X / O) represents the player we are checking  
     8 @return, array of moves for AI to use
     */
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
		var random = Math.floor((Math.random() *2)+1);
		if(player === 'O') {
			bestScore = -10000;
			for(i = 0; i < moves.length; i++) {
				if(moves[i].score === bestScore) {
					//if moves generate same score pick one at random
					if(random === 2) {
						bestScore = moves[i].score;
						bestMove = i;
					}
				} else if (moves[i].score > bestScore) {
						bestScore = moves[i].score;
						bestMove = i;
				}
			}
		} else {
			bestScore = 10000;
			for(i = 0; i < moves.length; i++) {
				if(moves[i].score === bestScore) {
					if(random === 2) {
						bestScore = moves[i].score;
						bestMove = i;
					}
				} else if (moves[i].score < bestScore) {
						bestScore = moves[i].score;
						bestMove = i;
				}
			}
		}
		return moves[bestMove];
	}
    /* clears game
     * @game, current game with player/ai moves to clear
     * @return, empty game (new game)
     */
	emptyIndexies(game) {
		return game.filter(s => s !== 'O' && s !== 'X');
	}

	resetGame() {
		var newGame = [0,1,2,3,4,5,6,7,8];
		var winRow = Array(3).fill(null);
		//X is always first generate move for X if player is O
		if(this.state.computer === 'X') {
			var compMove = this.minmax(newGame,'X',this.state.difficulty);
			newGame[compMove.index] = 'X';	
		} 
		this.setState({game: newGame, gameOver: false, winRow: winRow});	
	}

	newGame() {
		var newGame = [0,1,2,3,4,5,6,7,8];
		var winRow = Array(3).fill(null);
		var score = Array(2).fill(0,0);
		this.setState({game: newGame, gameOver: false, winRow: winRow, score: score, player: '', computer: ''});	
	}

	setDifficutly(mode) {
		this.setState({difficulty:mode});
	}
	
	render () {
        var xHighlight = (this.state.player === 'X') ? 'inset 0 0 0 1px #C1CFDA, inset 0 0 20px #193047' : '';
        var oHighlight = (this.state.player === 'O') ? 'inset 0 0 0 1px #C1CFDA, inset 0 0 20px #193047' : '';
        var freeSquares = this.emptyIndexies(this.state.game.slice(0));
        var resetDisplay = (this.state.gameOver || freeSquares.length === 0) ? ' ' : 'none';
        var difficutly = '';
        var color = '';
        switch (this.state.difficulty) {
            case 2:
                difficutly = 'Easy';
                color = 'success';
                break;
            case 3:
                difficutly = "Medium";
                color = 'warning';
                break;
            case 9: 
                difficutly = 'Hard';
                color = 'danger';
                break;
            default:
                difficutly = 'Hard';
                color = 'danger';
                break;
        }
        return (	
            <div className='container-fluid background'>
                <Dropdown 
                    size='lg' 
                    isOpen={this.state.dropdownOpen} 
                    toggle={this.diffToggle}
                >
                    <DropdownToggle 
                        className='diff-drop' 
                        color={color} 
                        caret>{difficutly}
                    >
                    </DropdownToggle>
                    <DropdownMenu style={{background:'black'}}>
                        <DropdownItem 
                            style={{color:'green'}} 
                            onClick={()=> this.setDifficutly(2)}
                        >
                            Easy
                        </DropdownItem>
                        <DropdownItem 
                            style={{color:'orange'}} 
                            onClick={()=> this.setDifficutly(3)}
                        >
                            Medium
                        </DropdownItem>
                        <DropdownItem 
                            style={{color:'red'}} 
                            onClick={()=> this.setDifficutly(9)}
                        >
                            Hard
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
                <div className='scoreboard row'>
                    <div 
                        className='col-md-6 score-X' 
                        onClick={() => this.setPlayers('X')} 
                        style={{background:'red',boxShadow:xHighlight}}
                    >
                        <span>X</span>
                        <span className='player-score'>
                            {(this.state.score[0] === 0) ? '-' : this.state.score[0]}
                        </span>
                    </div>
                    <div 
                        className='col-md-6 score-O' 
                        onClick={() => this.setPlayers('O')} 
                        style={{background:'yellow',boxShadow:oHighlight}}
                    >
                        <span>O</span>
                        <span className='player-score'>
                            {(this.state.score[1] === 0) ? '-' : this.state.score[1]}
                        </span>
                    </div>
                </div>
                <div 
                    className='row game-btns' 
                    style={{display:resetDisplay}}
                >
                    <button 
                        className='col-md-6 reset-btn' 
                        onClick={this.resetGame}
                    >
                        Clear Board
                    </button>
                    <button 
                        className='col-md-6 new-btn' 
                        onClick={this.newGame}
                    >
                        New Game
                    </button>
                </div>
                <div className='board'>
                    {this.state.game.map((x,i)=>{
                    return <Squares 
                                key={'square-'+ i} 
                                num={i} 
                                handleClick={()=> this.handleClick(i)} 
                                value={this.state.game[i]} 
                                winRow={this.state.winRow}  
                            />
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