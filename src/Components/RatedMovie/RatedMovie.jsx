import { Component } from "react"
import { Rate } from "antd"

import MovieCard from "../MovieCard/MovieCard"

export default class RatedMovie extends Component {
  render() {
    const {
      other: { title, overview, poster_path, vote_average, release_date, genre_ids, rating },
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
          <Rate count={10} allowHalf style={{ fontSize: 16 }} disabled value={rating} />
        </div>
      </li>
    )
  }
}
