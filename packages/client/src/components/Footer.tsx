function Footer() {
    return (
        <footer className="footer items-center p-4 bg-neutral text-neutral-content flex justify-center">
            <div className="items-center">
                <p>Tic Tac Toe &copy; {new Date().getFullYear()}</p>
            </div>
        </footer>
    )
}
export default Footer
