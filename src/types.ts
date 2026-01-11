export type RodName = "A" | "B" | "C";

export interface Rods {
  A: number[];
  B: number[];
  C: number[];
}

export interface Move {
  step: number;
  disk: number;
  from: RodName;
  to: RodName;
}

export interface SolveRequest {
  n: number;
  to: RodName;
  state: Rods;
  maxMoves: number;
}

export interface FullSolutionResponse {
  mode: "full";
  moveCount: string;
  moves: Move[];
}

export interface SummarySolutionResponse {
  mode: "summary";
  moveCount: string;
  message: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export type SolveResponse = FullSolutionResponse | SummarySolutionResponse;
