const app = require("./app");
const mongoDB = require("mongoose");
const dotenv = require("dotenv");
const MovieModel = require("./Models/MoviesModels");

dotenv.config({ path: "./config.env" });
const PORT = process.env.PORT;
const connectionURI = process.env.CLOUD_CONNECTION;

//create connection of mongoDB
mongoDB
  .connect(connectionURI, { useNewUrlParser: true })
  .then(() => {
    console.log("The Database has been connected succesfully");
  })
  .catch((err) => {
    console.log(err);
    console.log("The database is not connected successfuly");
  });

app.listen(PORT, () => {
  console.log("server is started");
});
