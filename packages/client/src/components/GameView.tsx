import { CellState, findWinningIndexesCombination, Game, getPosition, Position } from '@ttt/lib'
import { useEffect, useRef, MouseEvent } from 'react'
import { faXmark, faCircle } from '@fortawesome/free-solid-svg-icons'

export interface GameViewProps {
    game: Game
    handlePositionClick?: (_pos: Position) => void
}

const crossIcon = new Path2D('M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z')
const circleIcon = new Path2D('M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM256 48C141.1 48 48 141.1 48 256C48 370.9 141.1 464 256 464C370.9 464 464 370.9 464 256C464 141.1 370.9 48 256 48z')



const GameView = ({ game, handlePositionClick }:GameViewProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const draw = (ctx: CanvasRenderingContext2D) => {
        const boxSize = ctx.canvas.width / game.size

        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Determine the win
        const playerWins = findWinningIndexesCombination(CellState.PLAYER, game.cells, game.size, game.numInRow)
        if ( playerWins ) {
            ctx.save()
            ctx.fillStyle = '#93b7db'
            playerWins.forEach((cellIndex)=>{
                const { x, y } = getPosition(game.size, cellIndex)
                ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize)
            })
            ctx.restore()
        }
        const opponentWins = findWinningIndexesCombination(CellState.OPPONENT, game.cells, game.size, game.numInRow)
        if ( opponentWins ) {
            ctx.save()
            ctx.fillStyle = '#ee9999'
            opponentWins.forEach((cellIndex)=>{
                const { x, y } = getPosition(game.size, cellIndex)
                ctx.fillRect(x * boxSize, y * boxSize, boxSize, boxSize)
            })
            ctx.restore()
        }

        // Border
        ctx.strokeStyle = '#666666'
        ctx.lineWidth = 20
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        for (let i = 0; i <= game.size; i++)
            for (let j = 0; j <= game.size; j++) ctx.strokeRect(i * boxSize, j * boxSize, i + 1 * boxSize, j + 1 * boxSize)

        // Cell
        game.cells.forEach((cell: CellState, index: number) => {
            ctx.save()
            const pos = getPosition(game.size, index)
            ctx.strokeStyle = '#000000'
            if (cell === CellState.PLAYER) {
                ctx.scale(0.5, 0.5)
                ctx.translate(pos.x * ( boxSize * 2) + 170, pos.y * ( boxSize * 2) + 90)
                ctx.fillStyle = '#1976d2'
                ctx.fill(crossIcon)
                ctx.stroke(crossIcon)
            } else if (cell === CellState.OPPONENT) {
                ctx.scale(0.4, 0.4)
                ctx.translate(pos.x * ( boxSize * 2.5) + 150, pos.y * ( boxSize * 2.5) + 150)
                ctx.fillStyle = '#cc0000'
                ctx.fill(circleIcon)
                ctx.stroke(circleIcon)
            }
            ctx.restore()
        })
    }
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        //Our first draw
        if (context) draw(context)
    }, [game])

    const handleCanvasMouseDown = (event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        const rect = canvas?.getBoundingClientRect()
        if (rect) {
            const boxSize = rect.width / game.size
            const mx = event.clientX - rect.left
            const my = event.clientY - rect.top
            const x = Math.floor(mx / boxSize)
            const y = Math.floor(my / boxSize)
            if (handlePositionClick && game.getAt({ x,y }) === CellState.EMPTY)
                handlePositionClick({ x, y })
        }
    }

    return <canvas ref={canvasRef} onMouseDown={handleCanvasMouseDown} className="max-w-full max-h-full aspect-square" width="1000" height="1000"></canvas>
}

export default GameView
