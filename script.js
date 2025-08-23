const SIZE = 8;
const HUMAN = 1;
const COMPUTER = 2;
let board = [];
let currentPlayer = HUMAN; // 1: black (human), 2: white (computer)
const boardElem = document.getElementById('board');
const statusElem = document.getElementById('status');
const directions = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],          [0, 1],
  [1, -1], [1, 0], [1, 1]
];

function init() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  board[3][3] = 2;
  board[3][4] = 1;
  board[4][3] = 1;
  board[4][4] = 2;
  currentPlayer = HUMAN;
  render();
  updateStatus();
}

function render() {
  boardElem.innerHTML = '';
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.dataset.row = r;
      cell.dataset.col = c;
      if (board[r][c] !== 0) {
        const disc = document.createElement('div');
        disc.className = 'disc ' + (board[r][c] === HUMAN ? 'black' : 'white');
        cell.appendChild(disc);
      }
      cell.addEventListener('click', onCellClick);
      boardElem.appendChild(cell);
    }
  }
}

function onCellClick(e) {
  if (currentPlayer !== HUMAN) return;
  const r = Number(e.currentTarget.dataset.row);
  const c = Number(e.currentTarget.dataset.col);
  makeMove(r, c);
}

function makeMove(r, c) {
  const flips = getFlips(r, c, currentPlayer);
  if (board[r][c] === 0 && flips.length > 0) {
    board[r][c] = currentPlayer;
    for (const [fr, fc] of flips) board[fr][fc] = currentPlayer;
    currentPlayer = 3 - currentPlayer;
    if (!hasValidMove(currentPlayer) && hasValidMove(3 - currentPlayer)) {
      currentPlayer = 3 - currentPlayer; // skip turn
    }
    if (!hasValidMove(1) && !hasValidMove(2)) {
      endGame();
    } else {
      render();
      updateStatus();
      if (currentPlayer === COMPUTER) setTimeout(computerMove, 500);
    }
  }
}

function computerMove() {
  if (currentPlayer !== COMPUTER) return;
  const moves = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const flips = getFlips(r, c, COMPUTER);
      if (flips.length > 0) moves.push({ r, c });
    }
  }
  if (moves.length === 0) return;
  const move = moves[Math.floor(Math.random() * moves.length)];
  makeMove(move.r, move.c);
}

function getFlips(r, c, player) {
  if (board[r][c] !== 0) return [];
  const opponent = 3 - player;
  const flips = [];
  for (const [dr, dc] of directions) {
    let nr = r + dr,
      nc = c + dc;
    const line = [];
    while (
      nr >= 0 && nr < SIZE &&
      nc >= 0 && nc < SIZE &&
      board[nr][nc] === opponent
    ) {
      line.push([nr, nc]);
      nr += dr;
      nc += dc;
    }
    if (
      line.length > 0 &&
      nr >= 0 && nr < SIZE &&
      nc >= 0 && nc < SIZE &&
      board[nr][nc] === player
    ) {
      flips.push(...line);
    }
  }
  return flips;
}

function hasValidMove(player) {
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (getFlips(r, c, player).length > 0) return true;
    }
  }
  return false;
}

function updateStatus() {
  const count = { 1: 0, 2: 0 };
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c]) count[board[r][c]]++;
    }
  }
  const playerText = currentPlayer === HUMAN ? '黒(あなた)' : '白(コンピュータ)';
  statusElem.textContent = `黒: ${count[1]} 白: ${count[2]} 現在の手番: ${playerText}`;
}

function endGame() {
  const count = { 1: 0, 2: 0 };
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (board[r][c]) count[board[r][c]]++;
    }
  }
  let result = '引き分け';
  if (count[1] > count[2]) result = '黒の勝ち';
  else if (count[2] > count[1]) result = '白の勝ち';
  alert(`${result}！ 黒:${count[1]} 白:${count[2]}`);
  init();
}

document.getElementById('reset').addEventListener('click', init);

init();
