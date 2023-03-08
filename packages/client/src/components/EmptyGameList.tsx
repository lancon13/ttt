import { Card } from 'react-daisyui'

const EmptyGameList = () => {
    return (
        <Card className="bg-base-200" side="md">
            <Card.Body className="items-center">
                <img src="/public/icons/empty.svg" style={{ width: '10rem' }} />
                <Card.Title className="" tag="h1">
                    Please start a New Game
                </Card.Title>
            </Card.Body>
        </Card>
    )
}

export default EmptyGameList
