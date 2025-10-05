let express = require("express");
let routes = express.Router();
let authProtect = require("../controller/authController");
const requestHandler = require("../controller/moviesController");

routes
  .route("/getHighestRatingRecord")
  .get(
    authProtect.protect,
    requestHandler.getHighestRating,
    requestHandler.getAllMovies
  );

routes
  .route("/movie-stat")
  .get(authProtect.protect, requestHandler.getMovieStat);

routes
  .route("/movie-by-genre/:genres")
  .get(authProtect.protect, requestHandler.getMovieByGenres);

routes
  .route("/createMovie")
  .post(authProtect.protect, requestHandler.createMovie);

routes
  .route("/getAllMovies")
  .get(authProtect.protect, requestHandler.getAllMovies);

routes
  .route("/:id")
  .get(authProtect.protect, requestHandler.getMovie)
  .patch(authProtect.protect, requestHandler.updateMovie)
  .delete(
    authProtect.protect,
    authProtect.restrict("admin"),
    requestHandler.deleteMovie
  );

module.exports = routes;
