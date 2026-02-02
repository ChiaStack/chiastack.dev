"use client";

import { useId, ViewTransition, useRef } from "react";

import * as z from "zod";

import { useTicTacToeStore } from "@chiastack/features/tic-tac-toe/store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sizeSchema = z.number().int().min(3).max(10);

export const TicTacToe = () => {
  const changeSize = useTicTacToeStore(
    (state) => state.changeSize,
    "TicTacToe"
  );
  const size = useTicTacToeStore((state) => state.size, "TicTacToe");
  const board = useTicTacToeStore((state) => state.board, "TicTacToe");
  const player = useTicTacToeStore((state) => state.currentPlayer, "TicTacToe");
  const winner = useTicTacToeStore((state) => state.winner, "TicTacToe");
  const isDraw = useTicTacToeStore((state) => state.isDraw, "TicTacToe");
  const makeMove = useTicTacToeStore((state) => state.makeMove, "TicTacToe");
  const resetGame = useTicTacToeStore((state) => state.resetGame, "TicTacToe");

  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleConfirmSize = () => {
    const newSize = Number(inputRef.current?.value);
    if (!sizeSchema.safeParse(newSize).success) return;
    changeSize(newSize);
  };

  return (
    <ViewTransition>
      <div className="bg-foreground/5 flex w-full max-w-2xl flex-col items-center justify-center rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="mb-8 text-center text-4xl font-bold">Tic Tac Toe</h2>

        <div className="mb-6 grid w-full max-w-sm items-center gap-3">
          <Label htmlFor={id}>Set Size</Label>
          <div className="flex w-full max-w-sm items-center gap-2">
            <Input
              type="number"
              id={id}
              placeholder="Set Size"
              min={3}
              max={10}
              ref={inputRef}
              defaultValue={size}
            />
            <Button onClick={handleConfirmSize}>Set Size</Button>
          </div>
          <p className="text-muted-foreground text-xs">
            The size of the board.
          </p>
        </div>

        <div className="mb-6 text-center">
          <p className="text-muted-foreground text-lg font-semibold">
            {winner
              ? `Winner: ${winner}`
              : isDraw
                ? "Draw"
                : `Current Player: ${player ?? ""}`}
          </p>
        </div>

        <div
          className="mx-auto mb-8 grid justify-items-center gap-2"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            maxWidth: `${size * 80}px`,
          }}>
          {Array.from({ length: size * size }, (_, i) => {
            const buttonSize = size <= 4 ? "60px" : size <= 5 ? "50px" : "40px";
            const fontSize =
              size <= 4 ? "1.5rem" : size <= 5 ? "1.25rem" : "1rem";

            return (
              <Button
                key={`square-${i}-${size}`}
                style={{
                  width: buttonSize,
                  height: buttonSize,
                  fontSize: fontSize,
                }}
                size="icon"
                variant="outline"
                onClick={() => makeMove(i)}
                disabled={winner !== null || isDraw}>
                {board[i]}
              </Button>
            );
          })}
        </div>

        <Button onClick={resetGame}>Reset</Button>

        <div className="text-muted-foreground mt-8 text-center text-sm">
          <p>The size of the board is {size}.</p>
        </div>
      </div>
    </ViewTransition>
  );
};
