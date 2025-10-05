const MovieModel = require("../Models/MoviesModels");
let movieModel = require("../Models/MoviesModels");
let ApiFeature = require("../utilities/ApiFeature");

const getHighestRating = (req, resp, next) => {
  console.log(req.query.name);
  Object.defineProperty(req, "query", {
    value: { ...req.query, sort: "-rating", limit: "3" },
    writable: true,
  });
  next();
};

const getAllMovies = async (req, resp) => {
  try {
    const apiFeature = new ApiFeature(movieModel.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination();

    const movies = await apiFeature.query;

    if (!movies || movies.length === 0) {
      return resp.status(404).json({
        status: "fail",
        message: "No movies found with the specified criteria.",
        data: { movies: [] },
      });
    }

    resp.status(200).json({
      status: "success",
      length: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    console.error("Error fetching movies:", error);
    resp.status(500).json({
      status: "error",
      message: "An internal server error occurred.",
      details: error.message,
    });
  }
};

const createMovie = async (req, resp) => {
  try {
    await movieModel.create(req.body);
    resp
      .status(200)
      .json({ status: "success", message: "record created successfully" });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: exception.message,
    });
  }
};

const getMovie = async (req, resp) => {
  try {
    let movie = await movieModel.findById({ _id: req.params.id });

    if (!movie) {
      return resp.status(400).json({
        status: "fail",
        message: "The provided movie id is not available in databse",
      });
    }
    resp.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: "The" + req.param.id + "is not found in record",
    });
  }
};

const updateMovie = async (req, resp) => {
  try {
    let movie = await movieModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!movie) {
      return resp.status(400).json({
        status: "fail",
        message: "The provided movie ID is not available in database",
      });
    }
    resp.status(200).json({
      status: "success",
      data: {
        movie,
      },
    });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: "The" + req.param.id + "is not found in record",
    });
  }
};

const deleteMovie = async (req, resp) => {
  try {
    await movieModel.findByIdAndDelete(req.params.id);
    resp.status(200).json({
      status: "success",
      data: null,
    });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: "The delet action is not comformed" + "",
    });
  }
};

const getMovieStat = async (req, resp) => {
  try {
    let pipeline = [
      { $match: { rating: { $gte: 4.5 } } },
      {
        $group: {
          _id: "$releaseYear",
          avgRating: { $avg: "$rating" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          totalPrice: { $sum: "$price" },
          movieCount: { $sum: 1 },
        },
      },
      { $sort: { rating: -1 } },
    ];

    let movie = await movieModel.aggregate(pipeline);
    console.log(movie);
    resp.status(200).json({
      status: "success",
      count: movie.length,
      data: movie,
    });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: exception,
    });
  }
};

const getMovieByGenres = async (req, resp) => {
  try {
    let genres = req.params.genres;
    let getMovieByGenresResult = await MovieModel.aggregate([
      { $unwind: "$genres" },
      {
        $group: {
          _id: "$genres",
          movieCount: { $sum: 1 },
          movies: { $push: "$name" },
        },
      },
      { $addFields: { genres: "$_id" } },
      { $project: { _id: 0 } },
      { $sort: { movieCount: -1 } },
      { $match: { genres: genres } },
    ]);

    resp.status(200).json({
      status: "success",
      count: getMovieByGenresResult.length,
      data: getMovieByGenresResult,
    });
  } catch (exception) {
    resp.status(400).json({
      status: "fail",
      message: exception,
    });
  }
};
module.exports = {
  getAllMovies,
  createMovie,
  getMovie,
  updateMovie,
  deleteMovie,
  getHighestRating,
  getMovieStat,
  getMovieByGenres,
};
