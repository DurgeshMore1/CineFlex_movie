const morgan = require("morgan");
const movieRoutes = require("./routes/moviesRoutes");
const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const globalErrorhandling = require("./controller/ErrorController");
const CustomeError = require("./CustomeError");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const sanitize = require("express-mongo-sanitize");
const xss = require("xss");

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(morgan("dev"));

app.use(sanitize()); //it clean non sql query coming from api request
app.use(xss()); // it clean html code which is coming from api request

app.use(express.static("./public"));

//apply limit on api call
let limit = rateLimit({
  max: 3,
  windowMs: 60 * 60 * 1000,
  message: "We have reahed maximum limit , please try again after 1 hour",
});

app.use("/Auth", limit);
app.use("/Auth", authRoutes);
app.use("/user", userRoutes);
app.use("/movies", movieRoutes);

app.all(/.*/, (req, resp, next) => {
  let ee = new CustomeError(
    `can't find requested url on ${req.originalUrl}`,
    404
  );
  next(ee);
});

app.use(globalErrorhandling);

module.exports = app;
