require("dotenv").config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

console.log("Connecting to URI: ", url);

mongoose
  .connect(url)
  .then((response) => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error.message);
  });

const personSchema = mongoose.Schema({
  name: {
    type: String,
    minLength: [3, "Name length must be at least 3, got {VALUE}"],
  },
  number: {
    type: String,
    validate: {
      validator: (value) => {
        return /^(?:\d{2}-\d{6}|\d{3}-\d{5})$/.test(value);
      },
      message: (props) => `${props.value} is not a valid phone number`,
    },
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
