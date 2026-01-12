import express, { Request, Response } from "express"
import cors from "cors"
import { SolveRequest, SolveResponse, ErrorResponse, RodName } from "./types"
import { validateState, solve, calculateMoveCount } from "./hanoi"
import { SUMMARY_MESSAGE } from "./config"

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.post(
  "/api/hanoi/solve",
  (req: Request, res: Response<SolveResponse | ErrorResponse>) => {
    const { n, to, state, maxMoves } = req.body as SolveRequest

    // Validate request structure
    if (typeof n !== "number" || n < 1) {
      return res.status(400).json({
        error: "INVALID_STATE",
        message: "Invalid state detected. Please Reset.",
      })
    }

    if (!["A", "B", "C"].includes(to)) {
      return res.status(400).json({
        error: "INVALID_STATE",
        message: "Invalid state detected. Please Reset.",
      })
    }

    if (!state || typeof state !== "object") {
      return res.status(400).json({
        error: "INVALID_STATE",
        message: "Invalid state detected. Please Reset.",
      })
    }

    // Validate the Tower of Hanoi state
    if (!validateState(state, n)) {
      return res.status(400).json({
        error: "INVALID_STATE",
        message: "Invalid state detected. Please Reset.",
      })
    }

    // Calculate total possible moves: 2^n - 1
    const moveCountBigInt = calculateMoveCount(n)
    const moveCount = moveCountBigInt.toString()
    const effectiveMaxMoves = typeof maxMoves === "number" ? maxMoves : 100

    // If too many moves, return summary
    if (moveCountBigInt > BigInt(effectiveMaxMoves)) {
      return res.json({
        mode: "summary",
        moveCount,
        message: SUMMARY_MESSAGE,
      })
    }

    // Solve from current state
    const moves = solve(state, n, to as RodName)

    return res.json({
      mode: "full",
      moveCount,
      moves,
    })
  }
)

app.listen(PORT, () => {
  console.log(`Hanoi backend running on http://localhost:${PORT}`)
})
