import React, { useMemo, useState } from "react";
import "./App.css";

const BOARD_SIZE = 9;

const WIN_LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

/**
 * Returns winner information for a board state.
 * - If there's a winner, returns { winner: 'X'|'O', line: number[] }
 * - Otherwise returns { winner: null, line: null }
 */
function calculateWinner(squares) {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}

/**
 * Computes whether the board is full (no null squares).
 */
function isBoardFull(squares) {
  return squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** squares: Array<'X'|'O'|null> */
  const [squares, setSquares] = useState(() => Array(BOARD_SIZE).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const { winner, line: winningLine } = useMemo(
    () => calculateWinner(squares),
    [squares]
  );

  const isDraw = useMemo(() => !winner && isBoardFull(squares), [winner, squares]);

  const currentPlayer = xIsNext ? "X" : "O";
  const gameOver = Boolean(winner) || isDraw;

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    // Ignore if game is over or square is occupied
    if (gameOver || squares[index] !== null) return;

    const nextSquares = squares.slice();
    nextSquares[index] = currentPlayer;

    setSquares(nextSquares);
    setXIsNext((v) => !v);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    setSquares(Array(BOARD_SIZE).fill(null));
    setXIsNext(true);
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
      ? "Draw"
      : `Current player: ${currentPlayer}`;

  const statusAriaLive = winner || isDraw ? "polite" : "off";

  return (
    <div className="App">
      <main className="ttt-page">
        <header className="ttt-header">
          <div className="ttt-title-row">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <span className="ttt-badge" aria-hidden="true">
              Local 2‑player
            </span>
          </div>
          <p className="ttt-subtitle">
            Tap a square to place your mark. First to 3 in a row wins.
          </p>
        </header>

        <section className="ttt-card" aria-label="Game">
          <div className="ttt-status-row">
            <div className="ttt-status" role="status" aria-live={statusAriaLive}>
              {statusText}
            </div>

            <div className="ttt-turn-indicator" aria-label="Player indicators">
              <span
                className={[
                  "ttt-pill",
                  "ttt-pill-x",
                  !winner && !isDraw && currentPlayer === "X" ? "is-active" : "",
                  winner === "X" ? "is-winner" : "",
                ].join(" ")}
              >
                X
              </span>
              <span
                className={[
                  "ttt-pill",
                  "ttt-pill-o",
                  !winner && !isDraw && currentPlayer === "O" ? "is-active" : "",
                  winner === "O" ? "is-winner" : "",
                ].join(" ")}
              >
                O
              </span>
            </div>
          </div>

          <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
            {squares.map((value, idx) => {
              const isWinningSquare = winningLine?.includes(idx);
              const isFilled = value !== null;

              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt-square",
                    isFilled ? "is-filled" : "",
                    isWinningSquare ? "is-winning" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  role="gridcell"
                  aria-label={`Square ${idx + 1}${value ? `, ${value}` : ""}`}
                  aria-disabled={gameOver || isFilled ? "true" : "false"}
                  disabled={gameOver || isFilled}
                >
                  <span className="ttt-mark" aria-hidden="true">
                    {value}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ttt-controls">
            <button type="button" className="ttt-btn ttt-btn-primary" onClick={restartGame}>
              Restart
            </button>

            <div className="ttt-hint" aria-label="Hint">
              Tip: You can restart anytime.
            </div>
          </div>
        </section>

        <footer className="ttt-footer">
          <small className="ttt-footer-text">
            Built with React • Responsive retro‑leaning light theme
          </small>
        </footer>
      </main>
    </div>
  );
}

export default App;
