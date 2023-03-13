import { Button } from '@mui/material'

export interface HeroProps {
    handleNewGameButtonClick: () => void
}

const Hero = ({ handleNewGameButtonClick }: HeroProps) => {
    return (
        <section className="body-font bg-gradient-to-r from-cyan-100 to-blue-500">
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center max-w-5xl">
                <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:text-left mb-16 md:mb-0 text-center">
                    <h1 className="title-font font-bold text-4xl mb-4">Tic Tac Toe</h1>
                    <p className="mb-8 leading-relaxed">This is a multi-player game written in Typescript with server / client support.</p>
                    <div className='flex flex-col items-center md:flex-row'>
                        <Button onClick={handleNewGameButtonClick} color='primary' variant="contained">New Game</Button>
                    </div>
                </div>
                <div className="lg:max-w-md md:w-1/3 w-3/6">
                    <img className="object-cover object-center rounded bg-transparent" src="bg.jpg" />
                </div>
            </div>
        </section>
    )
}
export default Hero
