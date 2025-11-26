import { createFileRoute } from "@tanstack/react-router";

import { TicTacToeStoreProvider } from "@chiastack/features/tic-tac-toe/store";

import { TicTacToe } from "@/containers/tic-tac-toe";

export const Route = createFileRoute("/tic-tac-toe")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <TicTacToeStoreProvider initialState={{ size: 3 }}>
      <TicTacToe />
    </TicTacToeStoreProvider>
  );
}
