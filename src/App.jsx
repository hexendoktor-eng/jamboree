import { useState } from 'react'

import './App.css'

function App() {


  return (
    <>
        <nav className="flex gap-6 justify-center mt-3">
            <a href={"home"} className="px-4 py-2 bg-[#59a9fc] hover:bg-[#4b6dd4] text-white font-bold rounded-md">
                Home
            </a>

            <a href={"about"} className="px-4 py-2 bg-[#59a9fc] hover:bg-[#4b6dd4]  text-white font-bold rounded-md">
                About
            </a>
            <a href={"contact"} className="px-4 py-2 bg-[#59a9fc] hover:bg-[#4b6dd4] text-white font-bold rounded-md">
                Contact
            </a>
        </nav>
      <h1>
        <b className="text-3xl tracking-[0.2em]">
            JAMBOREE </b>
      </h1>
      <p className="text-lg text-red-900">
        I want to try to test out some of the tail-wind classes as it seems a interesting way to style my components.
        I have been using CSS for a while and I am not sure if I want to switch to tail-wind or not, but I will give it a try and see how it goes. Yes!
      </p>
      <input type={"text"} className="border-2 border-gray-300 rounded-md p-4 m-4" placeholder="Enter a song!" />
      <div className="flex justify-center">
        <button className="flex bg-blue hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-max justify-center items-center">
          Submit
        </button>
      </div>

    </>
  )
}

export default App
