import { Component } from "react"
import { parse, format } from "date-fns"

import lenta from "./lenta.png"
import { GenresConsumer } from "../GenresContext/GenresContext"

export default class MovieCard extends Component {
  changeDate = (date) => {
    if (date === "") return "The release date is unknown"
    const parsedDate = parse(date, "yyyy-MM-dd", new Date())
    const formattedDate = format(parsedDate, "MMMM d, yyyy")
    return formattedDate
  }

  croppedText = (string, start, end) => {
    if (string.length < start + 1) return string
    let foundIndex = -1
    for (let i = start; i < end; i++) {
      if (string[i] === " ") {
        foundIndex = i
        break
      }
    }
    const changeString = string.slice(0, foundIndex)
    return `${changeString} ...`
  }

  render() {
    const { title, overview, poster_path, vote_average, release_date, genre_ids } = this.props

    const releaseDate = this.changeDate(release_date)
    const croppedOverview = this.croppedText(overview, 170, 185)
    const croppedTitle = this.croppedText(title, 20, 35)
    const voteAverage = vote_average.toFixed(1)

    const imageURL = `https://image.tmdb.org/t/p/original${poster_path}`

    let borderStyle = {}
    if (voteAverage < 3) {
      borderStyle = { borderColor: "#E90000" }
    } else if (voteAverage >= 3 && voteAverage < 5) {
      borderStyle = { borderColor: "#E97E00" }
    } else if (voteAverage >= 5 && voteAverage < 7) {
      borderStyle = { borderColor: "#E9D100" }
    } else {
      borderStyle = { borderColor: "#66E900" }
    }

    return (
      <>
        <div className="posterBox">
          <img className="poster" src={poster_path ? imageURL : lenta} />
        </div>
        <div className="content">
          <div className="tittleBox">
            <h1 className="tittle">{croppedTitle}</h1>
            <div className="vote" style={borderStyle}>
              {voteAverage}
            </div>
          </div>
          <p className="release">{releaseDate}</p>
          <GenresConsumer>
            {(genres) => {
              const movieGenres = genre_ids
                .map((el) => {
                  const genre = genres.find((g) => g.id === el)
                  return genre ? genre.name : ""
                })
                .slice(0, 3)
              return (
                <div className="genreBox">
                  {movieGenres.map((genre, index) => (
                    <span key={index} className="genre">
                      {genre}
                    </span>
                  ))}
                </div>
              )
            }}
          </GenresConsumer>
          <p className="overview">{croppedOverview}</p>
        </div>
      </>
    )
  }
}
