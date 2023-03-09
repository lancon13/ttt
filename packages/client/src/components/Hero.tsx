import React from 'react'

export interface HeroProps {
    onStartClick: () => void
}

const Hero = ({ onStartClick }: HeroProps) => {
    return (
        <div className="hero bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md flex flex-col items-center">
                    <h1 className="text-5xl font-bold">Tic Tac Toe</h1>
                    <p className="py-6">Multiplayer Game - Tic Tac Toe. Please start a new game or join any existing game listed below</p>
                    <img src="icons/ttt.svg" style={{ width: '5rem', margin: '1rem' }} />
                    <button className="btn btn-primary" onClick={onStartClick}>
                        New Game
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Hero
