import './App.css'
import '../components/MusicCard/MusicCard.css'
import Navigation from '../components/Navigation'
import MusicCard from '../components/MusicCard/MusicCard'
import '../components/MusicCard/MusicCard.css'
import { SongList } from '../exampleSongs.js'

function Header() {
    return (
        <header>
          <h1>
            <b className="text-3xl tracking-[0.2em]">
              J A M B O R E E </b>
          </h1>
        </header>
    )
}

function App() {


  return (
    <>

    <main>
      <Navigation />
      <Header />


      <div>
        <section id="music-card">
          <h2>Music Cards</h2>
          <ul>
            <MusicCard {...SongList[0]} />
            <MusicCard {...SongList[1]} />
            <MusicCard {...SongList[2]} />
            <MusicCard {...SongList[3]} />
          </ul>
        </section>
      </div>

    </main>

    </>
  )
}

export default App
