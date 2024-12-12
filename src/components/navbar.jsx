import React from 'react'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <>
            {/* Navbar */}
            <nav className="w-full absolute">
                <div className="max-w-7xl w-11/12 mx-auto px-4 py-4 flex justify-between text-black">
                    <Link to='/'>
                        <div className='flex items-center cursor-pointer'>
                            <img
                                src="./assets/logo.png"
                                alt="netkit"
                                className="h-12"
                            />
                            <div className="text-2xl tracking-tighter">Mail-Scheduler</div>
                        </div>
                    </Link>
                    <div className="max-w-3xl w-min hidden md:flex justify-between whitespace-nowrap">
                        <ul className="w-full flex gap-x-6 justify-around items-center text-xl">
                            <Link to="/">
                                <li className="cursor-pointer border-b-2 border-transparent  hover:border-sky-500 px-2 py-1">
                                    Home
                                </li>
                            </Link>
                            <Link to="/admin">
                                <li className="cursor-pointer border-b-2 border-transparent  hover:border-sky-500 px-2 py-1">
                                    Admin
                                </li>
                            </Link>
                            <Link to="/about">
                                <li className="cursor-pointer border-b-2 border-transparent  hover:border-sky-500 px-2 py-1">
                                    About us
                                </li>
                            </Link>
                            <Link to="/contact">
                                <li className="cursor-pointer border-b-2 border-transparent  hover:border-sky-500 px-2 py-1">
                                    Contact us
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>
            </nav>
        </>

    )
}

export default Navbar