const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI).then(
  () => {
    console.log("Connection to MongoDB Established");

    app.listen(port, (req, res) => {
      console.log(`Server is up and listening to port: ${port}`);
    });
  },
  (err) => {
    console.log("Connection error with MongoDB", err);
  }
);
