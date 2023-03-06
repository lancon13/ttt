import React from 'react'

export interface HeroProps {
    onStart: () => void
}

const Hero = ({ onStart }: HeroProps) => {
    return (
        <div className="hero bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Tic Tac Toe</h1>
                    <p className="py-6">
                        Multiplayer Game - Tic Tac Toe. Please start a new game
                        or join any existing game listed below
                    </p>
                    {/* <div></div> */}
                    <button
                        className="btn btn-primary"
                        onClick={() => onStart()}
                    >
                        New Game
                    </button>
                </div>
            </div>
        </div>
    )
}
export default Hero
