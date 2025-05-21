export default class MovieService {
  _apiBase = "https://api.themoviedb.org/3/"
  _apiKey = "9f36f1f6e5e5000e0da211b3f98ec3ad"

  createGuestSession = async () => {
    try {
      const response = await fetch(`${this._apiBase}authentication/guest_session/new?api_key=${this._apiKey}`)
      const session = await response.json()

      if (session.success) {
        return session.guest_session_id
      } else {
        console.error("Failed to create guest session:", session)
      }
    } catch (error) {
      console.error("Error creating guest session:", error)
    }
  }

  postRating = async (id, guestSessionId, { value: value }) => {
    try {
      const response = await fetch(`${this._apiBase}movie/${id}/rating?api_key=9f36f1f6e5e5000e0da211b3f98ec3ad&guest_session_id=${guestSessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ value: value }),
      })

      const data = await response.json()

      if (!data.success) {
        console.error("Failed to submit rating:", data)
      }
    } catch (error) {
      console.error("Error submitting rating:", error)
    }
  }

  getRatedMovies = async (guestSessionId, currentRatedPage) => {
    try {
      const response = await fetch(
        `${this._apiBase}guest_session/${guestSessionId}/rated/movies?api_key=${this._apiKey}&language=ru-RU&page=${currentRatedPage}`
      )
      if (!response.ok) {
        throw new Error("GetRatedMovies response was not ok")
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error("Error fetching rated movies:", error)
    }
  }

  getGenres = async () => {
    try {
      const response = await fetch(`${this._apiBase}genre/movie/list?api_key=${this._apiKey}&language=en`)

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const genres = await response.json()
      return genres
    } catch (error) {
      console.error("There was a problem fetching the data:", error)
    }
  }

  getMovies = async (query, currentPage) => {
    try {
      const response = await fetch(
        `${this._apiBase}search/movie?api_key=${this._apiKey}&query=${query}&include_adult=false&language=en-US&page=${currentPage}`
      )
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const movies = await response.json()
      return movies
    } catch (error) {
      console.error("There was a problem fetching the data:", error)
    }
  }
}
