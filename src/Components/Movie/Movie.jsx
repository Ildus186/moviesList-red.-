import { Component } from "react"
import { Rate } from "antd"

import MovieCard from "../MovieCard/MovieCard"
import "./Movie.css"

export default class Movie extends Component {
  handleRateChange = async (value) => {
    const { guestSessionId, id, handleRatingChoice, postRating } = this.props
    handleRatingChoice(id, value)
    postRating(id, guestSessionId, { value: value })
  }

  render() {
    const {
      rating,
      other: { title, overview, poster_path, vote_average, release_date, genre_ids },
    } = this.props

    return (
      <li>
        <div className="card">
          <MovieCard
            title={title}
            overview={overview}
            poster_path={poster_path}
            vote_average={vote_average}
            release_date={release_date}
            genre_ids={genre_ids}
          />
          <Rate count={10} allowHalf style={{ fontSize: 16 }} onChange={this.handleRateChange} value={rating} />
        </div>
      </li>
    )
  }
}
