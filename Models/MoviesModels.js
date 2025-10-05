const mongoDB = require("mongoose");
const fs = require("fs");
//create schema
let movieSchema = new mongoDB.Schema(
  {
    name: {
      type: String,
      required: [true, "The name field is required"],
      unique: true,
    },

    description: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, "The duration field is required"],
    },
    rating: {
      type: Number,
      default: 0,
    },
    totalRating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required field"],
    },
    releaseDate: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    genres: {
      type: [String],
      required: [true, "genres field is required"],
    },
    directors: {
      type: [String],
      required: [true, "Director field is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image field is required"],
    },
    actors: {
      type: [String],
      required: [true, "Actors field is required"],
    },
    price: {
      type: Number,
      required: [true, "Price field is required"],
    },
    createdBy: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

movieSchema.virtual("durationInhour").get(function () {
  return this.duration / 60;
});

movieSchema.pre("save", function (next) {
  this.createdBy = "Durgesh";
  console.log(this);
  next();
});

movieSchema.post("save", function (doc, next) {
  let content = `A movie document with name ${doc.name} has been created by ${doc.createdBy}\n`;
  fs.writeFileSync(
    "/home/durgesh/Documents/Node_JS/logs.txt",
    content,
    { flag: "a" },
    (err) => {
      console.log(err.message);
    }
  );
  next();
});

movieSchema.pre(/^find/, function (next) {
  this.where({ releaseDate: { $lte: Date.now() } });
  this.startDate = Date.now();
  next();
});

movieSchema.post(/^find/, function (doc, next) {
  this.where({ releaseDate: { $lte: Date.now() } });
  this.endDate = Date.now();

  let content = `Query took ${this.endDate - this.startDate}`;

  fs.writeFileSync(
    "/home/durgesh/Documents/Node_JS/logs.txt",
    content,
    { flag: "a" },
    (err) => {
      console.log(err.message);
    }
  );
  next();
});

movieSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({
    $match: { releaseDate: { $lte: new Date() } },
  });
  next();
});

//creat model
let MovieModel = mongoDB.model("Movie", movieSchema);
module.exports = MovieModel;
