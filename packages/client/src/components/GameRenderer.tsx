import { CellState, Game, getPosition, Position } from '@ttt/lib'
import { useEffect, useRef, MouseEvent } from 'react'

export interface GameRendererProps {
    gameInstance: Game
    onPositionClick?: (_pos: Position) => void
}

const GameRenderer = ({ gameInstance, onPositionClick }: GameRendererProps) => {
    // const playerIcon = new Path2D('m 856.2152 26.7752 q 23.7552 0 39.5212 15.766 t 15.766 39.5212 q 0 23.3305 -15.9783 39.3088 l -348.2055 347.7543 l 348.2055 347.7543 q 15.9783 15.9783 15.9783 39.3088 q 0 23.7552 -15.766 39.5212 t -39.5212 15.766 q -23.3305 0 -39.3088 -15.9783 l -347.7543 -348.2055 l -347.7543 348.2055 q -15.9783 15.9783 -39.3088 15.9783 q -23.7552 0 -39.5212 -15.766 t -15.766 -39.5212 q 0 -23.3305 15.9783 -39.3088 l 348.2055 -347.7543 l -348.2055 -347.7543 q -15.9783 -15.9783 -15.9783 -39.3088 q 0 -23.7552 15.766 -39.5212 t 39.5212 -15.766 q 23.3305 0 39.3088 15.9783 l 347.7543 348.2055 l 347.7543 -348.2055 q 15.9783 -15.9783 39.3088 -15.9783 z')
    // const opponentIcon = new Path2D('M 455.76 5.76 a 460.8 460.8 90 1 0 460.8 460.8 A 460.8 460.8 90 0 0 455.76 5.76 z m 0 829.44 a 368.64 368.64 90 1 1 368.64 -368.64 a 368.64 368.64 90 0 1 -368.64 368.64 z')

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const draw = (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        // Border
        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 20
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const boxSize = ctx.canvas.width / gameInstance.size
        for (let i = 0; i <= gameInstance.size; i++)
            for (let j = 0; j <= gameInstance.size; j++) ctx.strokeRect(i * boxSize, j * boxSize, i + 1 * boxSize, j + 1 * boxSize)

        // Cell
        gameInstance.cells.forEach((cell: CellState, index: number) => {
            ctx.save()
            const pos = getPosition(gameInstance.size, index)
            if (cell === CellState.PLAYER) {
                const playerIcon = new Image()
                playerIcon.onload = () => {
                    ctx.drawImage(playerIcon, pos.x * boxSize, pos.y * boxSize, boxSize, boxSize)
                }
                playerIcon.src = '/icons/cross.png'
            } else if (cell === CellState.OPPONENT) {
                const opponentIcon = new Image()
                opponentIcon.onload = () => {
                    ctx.drawImage(opponentIcon, pos.x * boxSize, pos.y * boxSize, boxSize, boxSize)
                }
                opponentIcon.src = '/icons/circle.png'
            }

            ctx.restore()
        })
    }
    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas?.getContext('2d')
        //Our first draw
        if (context) draw(context)
    }, [gameInstance])

    const onCanvasMouseDown = (event: MouseEvent) => {
        const canvas = canvasRef.current
        const rect = canvas?.getBoundingClientRect()
        if (rect) {
            const boxSize = rect.width / gameInstance.size
            const mx = event.clientX - rect.left
            const my = event.clientY - rect.top
            const x = Math.floor(mx / boxSize)
            const y = Math.floor(my / boxSize)
            if (onPositionClick && gameInstance.getAt({ x,y }) === CellState.EMPTY)
                onPositionClick({ x, y })

        }
    }

    return <canvas ref={canvasRef} onMouseDown={onCanvasMouseDown} className="w-96 max-w-full aspect-square" width="1000" height="1000"></canvas>
}

export default GameRenderer
