const mongoose = require("mongoose");

//check for correct number of args

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log("Incorrect number of arguments received");
  process.exit(1);
}

//get password from command line
const password = process.argv[2];
//url to connect to db
const url = `mongodb+srv://nicofullstack:${password}@practicecluster.tkz7t.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=PracticeCluster`;

//connect to db
mongoose.set("strictQuery", false);
mongoose.connect(url);

// define person schema
const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

// create model based on schema
const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  //print all phonebook entries
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else {
  //get name and number from command line arguments
  const name = process.argv[3];
  const number = process.argv[4];

  // add name number to phonebook

  //create person object (document) of Person model
  const person = new Person({
    name: name,
    number: number,
  });

  //save person to db
  person.save().then((result) => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
