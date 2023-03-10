import { CellState, Game, GameState, getNextMove, getPosition, Position, User } from '@ttt/lib'
import { v4 as uuid } from 'uuid'

const games = new Map<string, Game>()
const users = new Map<string, User>()

export const registerUser = (user: User): void => {
    users.set(user.uid, user)
}

export const unregisterUser = (user: User): void => {
    users.delete(user.uid)
}

export const listUsers = (): User[] => {
    return Array.from(users, ([_uid, user]) => user)
}

export const joinGame = (gameId: string, user: User, asPlayer: boolean) => {
    const game = games.get(gameId)
    if (game) game[asPlayer ? 'player' : 'opponent'] = user
}

export const quitGame = (gameId: string, user: User, asPlayer?: boolean) => {
    const game = games.get(gameId)
    if (game)
        if (typeof asPlayer === 'undefined') {
            game.player = game.player?.uid == user.uid ? undefined : game.player
            game.opponent = game.opponent?.uid == user.uid ? undefined : game.opponent
        } else if (asPlayer) {
            game.player = undefined
        } else if (!asPlayer) {
            game.opponent = undefined
        }
}

export const quiteGames = (user: User) => {
    games.forEach((game: Game) => {
        game.player = game.player?.uid == user.uid ? undefined : game.player
        game.opponent = game.opponent?.uid == user.uid ? undefined : game.opponent
    })
}

export const moveGame = (gameId: string, user: User, position: Position) => {
    const game = games.get(gameId)
    if (game && game.getAt(position) === CellState.EMPTY) {
        if (game.player?.uid === user.uid && game.turn === CellState.PLAYER) {
            game.setAt(position, CellState.PLAYER)
            game.turn = CellState.OPPONENT
            if ( !game.opponent) {
                const nextMove = getNextMove({
                    index: -1,
                    cells: game.cells,
                    size: game.size,
                    numInRow: game.numInRow,
                    isMax: false,
                })
                game.setAt(getPosition(game.size, nextMove.index), CellState.OPPONENT)
                game.turn = CellState.PLAYER
            }
        } else if (game.opponent?.uid === user.uid && game.turn === CellState.OPPONENT) {
            game.setAt(position, CellState.OPPONENT)
            game.turn = CellState.PLAYER
            if ( !game.opponent) {
                const nextMove = getNextMove({
                    index: -1,
                    cells: game.cells,
                    size: game.size,
                    numInRow: game.numInRow,
                    isMax: true,
                })
                game.setAt(getPosition(game.size, nextMove.index), CellState.PLAYER)
                game.turn = CellState.OPPONENT
            }
        }


        console.log(gameId, game.export())
        games.set(gameId, game)
    }

}

export const newGame = ({ size, numInRow }: { size: number; numInRow: number }): string => {
    const gameId = uuid()
    const game = new Game({
        size,
        numInRow,
    })
    games.set(gameId, game)
    return gameId
}

export const getGame = (gameId: string): GameState | undefined => {
    return games.get(gameId)?.export()
}

export const listGames = (): { gameId: string; gameState: GameState }[] => {
    return Array.from(games, ([gameId, game]: [string, Game]) => ({
        gameId,
        gameState: game.export(),
    }))

    /*
        // If needs to be in object
        return Array.from(games).reduce((obj, [key, gameState]) => {
        Object.assign(obj, { [key]: gameState })
        return obj
    }, {}) */
}
