import { Card } from 'react-daisyui'

const EmptyGameList = () => {
    return (
        <Card className="bg-base-200" side="md">
            <Card.Body className="items-center">
                <img src="/icons/empty.svg" style={{ width: '5rem' }} />
                <Card.Title className="" tag="h1">
                    Please start a New Game
                </Card.Title>
            </Card.Body>
        </Card>
    )
}

export default EmptyGameList
