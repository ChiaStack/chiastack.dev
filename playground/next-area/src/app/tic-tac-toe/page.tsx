import type { Metadata } from "next";

import { TicTacToeStoreProvider } from "@chiastack/features/tic-tac-toe/store";

import { TicTacToe } from "@/containers/tic-tac-toe";

export function generateMetadata(): Metadata {
  return {
    title: "Tic Tac Toe",
    description: "Tic Tac Toe",
  };
}

const Page = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <TicTacToeStoreProvider initialState={{ size: 3 }}>
        <TicTacToe />
      </TicTacToeStoreProvider>
    </div>
  );
};

export default Page;
