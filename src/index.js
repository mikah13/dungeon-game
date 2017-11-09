import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
class Cell extends React.Component {
    render() {
        return (<div className={this.props.className}></div>)
    }
}
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            col: Array(60).fill(' '),
            row: Array(120).fill(' '),
            posX: (() => {
                let playerPosX;
                this.props.board.forEach((el, row) => {
                    if (el.indexOf("X") !== -1) {
                        playerPosX = row;
                    }
                })
                return playerPosX;
            })(),
            posY: (() => {
                let playerPosY;
                this.props.board.forEach((el, row) => {
                    el.forEach((col, colIndex) => {
                        if (col === "X") {
                            playerPosY = colIndex;
                        }
                    })
                })
                return playerPosY;
            })(),

            board: this.props.board,
            dark: true
        }
    }
    toggle = () => {
        this.setState({
            dark: !this.state.dark
        });
    }
    generateBoardCell = (rowIndex) => {
        return this.props.board[rowIndex].slice().map((col, colIndex) => {
            if (rowIndex === this.state.posX && colIndex === this.state.posY) {
                return <Cell key={rowIndex * this.state.col.length + colIndex} className={"player-cell"}/>
            } else if (col === ' ') {
                if (this.state.dark && (Math.pow(this.state.posX - rowIndex, 2) + Math.pow(this.state.posY - colIndex, 2)) > 48) {
                    return <Cell key={rowIndex * this.state.col.length + colIndex} className={"board-cell dark"}/>
                } else {
                    return <Cell key={rowIndex * this.state.col.length + colIndex} className={"board-cell "}/>
                }
            } else if (col === "G") {
                if (this.state.dark && (Math.pow(this.state.posX - rowIndex, 2) + Math.pow(this.state.posY - colIndex, 2)) > 48) {
                    return <Cell key={rowIndex * this.state.col.length + colIndex} className={"goal-cell dark"}/>
                } else {
                    return <Cell key={rowIndex * this.state.col.length + colIndex} className={"goal-cell "}/>
                }
            } else {
                if (this.state.dark && (Math.pow(this.state.posX - rowIndex, 2) + Math.pow(this.state.posY - colIndex, 2)) > 48) {
                    return <Cell key={rowIndex * this.state.col.length + colIndex} className={"room-cell dark"}/>
                } else {
                    return <Cell key={rowIndex * this.state.col.length + colIndex} className={"room-cell "}/>
                }
            }
        })
    }
    generateBoardRow = _ => this.props.board.slice().map((row, rowIndex) => {
        return (<div key={rowIndex} className="board-row">
            {this.generateBoardCell(rowIndex)}
        </div>)

    })
    componentWillMount = () => {
        let press = false;
        let x = this.state.posX;
        let y = this.state.posY;
        window.addEventListener("keydown", (e) => {
            console.log(e);
            if (!press) {
                if (e.keyCode === 40 || e.keyCode === 83) { //115 down

                    if (x < 59 && this.state.board[x + 1][y] === "R") {
                        x += 1;
                    } else if (x < 59 && this.state.board[x + 1][y] === "G") {
                        this.state.board[x + 1][y] = "R";
                        x += 1;
                    }
                } else if (e.keyCode === 38 || e.keyCode === 87) { //119 up
                    if (x > 0 && this.state.board[x - 1][y] === "R") {
                        x -= 1;
                    } else if (x > 0 && this.state.board[x - 1][y] === "G") {
                        this.state.board[x - 1][y] = "R";
                        x -= 1;
                    }
                } else if (e.keyCode === 37 || e.keyCode === 65) {
                    if (y > 0 && this.state.board[x][y - 1] === "R") {
                        y -= 1;
                    } else if (y > 0 && this.state.board[x][y - 1] === "G") {
                        this.state.board[x][y - 1] = "R";
                        y -= 1;
                    }
                } else if (e.keyCode === 39 || e.keyCode === 68) {
                    if (x < 119 && this.state.board[x][y + 1] === "R") {
                        y += 1;
                    } else if (x < 119 && this.state.board[x][y + 1] === "G") {
                        this.state.board[x][y + 1] = "R";
                        y += 1;
                    }
                }
                this.setState({posX: x, posY: y})
                press = true;
            }
        })
        window.addEventListener("keyup", (e) => {
            if (press) {
                press = false;
            }
        })
    }
    render() {
        return (<div className="board">{this.generateBoardRow()}<button onClick={() => this.toggle()} className="btn btn-primary">Toggle Darkness</button>
        </div>)
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            board: (() => {
                let gameBoard = Array(60).fill(' ').map(_ => Array(120).fill(' '));
                // random row Index ( 4 to 53)
                // random col Index ( 4 to 113)
                // density: random numberOf Room ( static 50)
                // room size (w:3to6, h:3to6)

                for (let rowIndex = 4; rowIndex < 53; rowIndex += Math.floor(Math.random() * 3 + 2)) {
                    let density = 20;
                    let arrayOfRoomCorner = [];
                    for (let densityIndex = 0; densityIndex < density; densityIndex++) {
                        let randomCellCorner = Math.floor(Math.random() * 90 + 15);
                        if (arrayOfRoomCorner.indexOf(randomCellCorner) === -1) {
                            arrayOfRoomCorner.push(randomCellCorner);
                        }
                    }
                    for (let arrayIndex = 0; arrayIndex < arrayOfRoomCorner.length; arrayIndex++) {
                        let w = Math.floor(Math.random() * 4 + 3);
                        let h = Math.floor(Math.random() * 4 + 3);
                        for (let a = 0; a < h; a++) {
                            for (let b = 0; b < w; b++) {
                                gameBoard[rowIndex + a][arrayOfRoomCorner[arrayIndex] + b] = 'R';
                            }
                        }
                    }
                }
                let unFound = true;

                while (unFound) {
                    let posX = Math.floor(Math.random() * 60);
                    let posY = Math.floor(Math.random() * 120);
                    if (gameBoard[posX][posY] === "R") {
                        gameBoard[posX][posY] = "X";
                        unFound = false;
                    }
                }
                for (let time = 0; time < Math.floor(Math.random() * 10 + 10); time++) {
                    let setGoal = false;
                    while (!setGoal) {
                        let posX = Math.floor(Math.random() * 60);
                        let posY = Math.floor(Math.random() * 120);
                        if (gameBoard[posX][posY] === "R") {
                            gameBoard[posX][posY] = "G";
                            setGoal = true;
                        }
                    }
                }

                return gameBoard;
            })()
        }
    }

    generatePlayer = (x, y) => {
        console.log(this.state.board);
        let board = this.state.board.slice();
        board[x][y] = "P";
        return board;
    }
    render() {
        return (<div><h1>Dungeon Game</h1><Board board={this.state.board}/></div>)
    }
}
ReactDOM.render(<Game/>, document.getElementById('content'));
// Need to change the Game state of board
