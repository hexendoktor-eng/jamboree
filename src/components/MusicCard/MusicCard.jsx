

export default function MusicCard({image, title, artist}) {
    return (
        <li>
        <img src={image} alt ={title} />
        <h3>{title}</h3>
        <p>{artist}</p>
        </li>
    )
}