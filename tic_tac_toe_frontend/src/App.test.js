import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

function clickSquare(n) {
  // Squares have aria-label `Square ${idx + 1}${value ? ...}`
  fireEvent.click(screen.getByLabelText(`Square ${n}`));
}

test("renders status and restart button", () => {
  render(<App />);

  expect(screen.getByRole("status")).toHaveTextContent(/Current player: X/i);
  expect(screen.getByRole("button", { name: /restart/i })).toBeInTheDocument();
});

test("alternates players and detects winner", () => {
  render(<App />);

  // X wins top row: 1,2,3
  clickSquare(1); // X
  clickSquare(4); // O
  clickSquare(2); // X
  clickSquare(5); // O
  clickSquare(3); // X

  expect(screen.getByRole("status")).toHaveTextContent("Winner: X");
});

test("restart resets the board and current player", () => {
  render(<App />);

  clickSquare(1); // X
  clickSquare(2); // O
  fireEvent.click(screen.getByRole("button", { name: /restart/i }));

  // Now should be X again and square 1 should be empty/clickable
  expect(screen.getByRole("status")).toHaveTextContent(/Current player: X/i);
  clickSquare(1);
  expect(screen.getByRole("status")).toHaveTextContent(/Current player: O/i);
});
