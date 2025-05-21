import { Component } from "react"
import "./App.css"
import { Tabs } from "antd"
import { Offline, Online } from "react-detect-offline"

import MoviesList from "./Components/MoviesList/MoviesList"
import RatedMoviesList from "./Components/RatedMoviesList/RatedMoviesList"
import SearchMovie from "./Components/SearchMovie/SearchMovie"
import { GenresProvider } from "./Components/GenresContext/GenresContext"
import MovieService from "./Services/movie-service"

export default class App extends Component {
  state = {
    data: [],
    genres: [],
    totalMovies: null,
    isLoading: false,
    isRatedLoading: false,
    error: null,
    errorRated: null,
    currentPage: 1,
    currentRatedPage: 1,
    query: "return",
    activeTab: "1",
    guestSessionId: null,
    ratedMovies: [],
    totalRatedMovies: null,
  }

  movieService = new MovieService()

  componentDidMount() {
    this.loadMovies()
    this.loadGenres()
    this.loadGuestSession()
  }

  loadMovies = async () => {
    this.setState({ isLoading: true, error: null })
    try {
      const { query, currentPage } = this.state
      const data = await this.movieService.getMovies(query, currentPage)
      this.setState({ data: data.results, isLoading: false, totalMovies: data.total_results })
    } catch (error) {
      console.error("Error loading movies:", error)
      this.setState({ error: true, isLoading: false })
    }
  }

  loadRatedMovies = async () => {
    this.setState({ isRatedLoading: true, errorRated: null })
    try {
      const { guestSessionId, currentRatedPage } = this.state
      const data = await this.movieService.getRatedMovies(guestSessionId, currentRatedPage)
      this.setState({ ratedMovies: data.results, isRatedLoading: false, totalRatedMovies: data.total_results })
    } catch (error) {
      console.error("Error loading rated movies:", error)
      this.setState({ errorRated: true, isRatedLoading: false })
    }
  }

  loadGenres = async () => {
    try {
      const data = await this.movieService.getGenres()
      this.setState({ genres: data.genres })
    } catch (error) {
      console.error("Error loading genres:", error)
      this.setState({ error: true })
    }
  }

  loadGuestSession = async () => {
    try {
      const result = await this.movieService.createGuestSession()
      this.setState({ guestSessionId: result })
    } catch (error) {
      console.error("Error loading guest session:", error)
      this.setState({ errorRated: true })
    }
  }

  changeTab = (newTab) => {
    this.setState(
      {
        activeTab: newTab,
        currentPage: 1,
        currentRatedPage: 1,
      },
      () => {
        if (this.state.activeTab === "2") {
          this.loadRatedMovies()
        }
      }
    )
    this.loadMovies()
  }

  changePage = (page) => {
    this.setState(
      {
        currentPage: page,
      },
      () => {
        this.loadMovies()
      }
    )
  }

  changeRatedPage = (page) => {
    this.setState(
      {
        currentRatedPage: page,
      },
      () => {
        this.loadRatedMovies()
      }
    )
  }

  changeQuery = (query) => {
    this.setState(
      {
        query: query,
      },
      () => {
        this.loadMovies()
      }
    )
  }

  render() {
    const {
      data,
      isLoading,
      isRatedLoading,
      error,
      errorRated,
      currentPage,
      currentRatedPage,
      totalMovies,
      totalRatedMovies,
      genres,
      guestSessionId,
      ratedMovies,
    } = this.state

    const items = [
      {
        key: "1",
        label: "Search",
        children: (
          <>
            <GenresProvider value={genres}>
              <SearchMovie changeQuery={this.changeQuery} changePage={this.changePage} />
              <MoviesList
                data={data}
                changePage={this.changePage}
                currentPage={currentPage}
                totalMovies={totalMovies}
                isLoading={isLoading}
                error={error}
                guestSessionId={guestSessionId}
                postRating={this.movieService.postRating}
              />
            </GenresProvider>
          </>
        ),
      },
      {
        key: "2",
        label: "Rated",
        children: (
          <>
            <GenresProvider value={genres}>
              <RatedMoviesList
                data={ratedMovies}
                changeRatedPage={this.changeRatedPage}
                currentRatedPage={currentRatedPage}
                totalRatedMovies={totalRatedMovies}
                isRatedLoading={isRatedLoading}
                errorRated={errorRated}
              />
            </GenresProvider>
          </>
        ),
      },
    ]

    return (
      <>
        <Online>
          <Tabs centered activeKey={this.state.activeTab} items={items} onChange={this.changeTab} />
        </Online>
        <Offline>
          <p>You are offline now. An internet connection is required to work with the application!</p>
        </Offline>
      </>
    )
  }
}
