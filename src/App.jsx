import { useState } from 'react'

import './App.css'

function App() {


  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Hello World
      </h1>
      <p className="text-lg text-red-900">
        I want to try to test out some of the tail-wind classes as it seems a interesting way to style my components.
        I have been using CSS for a while and I am not sure if I want to switch to tail-wind or not, but I will give it a try and see how it goes. Yes!
      </p>
      <input type={"text"} className="border-2 border-gray-300 rounded-md p-4 m-4" placeholder="Enter a song!" />
      <div className="flex justify-center">
        <button className="flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-max justify-center items-center">
          Submit
        </button>
      </div>

    </>
  )
}

export default App
