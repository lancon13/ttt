import { Game } from '@ttt/lib'
import { Button, Card } from 'react-daisyui'
import GameRenderer from './GameRenderer'

export interface GameCardProps {
    gameId: string
    game: Game
    onJoinAsPlayerButtonClick: () => void
    onJoinAsOpponentButtonClick: () => void
}

const GameCard = ({ gameId, game, onJoinAsPlayerButtonClick, onJoinAsOpponentButtonClick }: GameCardProps) => {

    return (
        <Card className="bg-base-200 mb-6 drop-shadow-md" side="md">
            <Card.Body>
                <Card.Title tag="h2">{gameId}</Card.Title>
                <p>
                    Size {game.size} x {game.size}
                </p>
                <div className='w-24'>
                    <GameRenderer gameInstance={game}></GameRenderer>
                </div>
                <Card.Actions className="justify-end">
                    <Button
                        color={game.player ? 'success' : 'primary'}
                        onClick={() => {
                            if (!game.player) onJoinAsPlayerButtonClick()
                        }}
                    >
                        {game.player ? `${game.player.name} joined` : 'Join as Player'}
                    </Button>
                    <Button
                        color={game.opponent ? 'success' : 'primary'}
                        onClick={() => {
                            if (!game.opponent) onJoinAsOpponentButtonClick()
                        }}
                    >
                        {game.opponent ? `${game.opponent.name} joined` : 'Join as Opponent'}
                    </Button>
                </Card.Actions>
            </Card.Body>
        </Card>
    )
}

export default GameCard
