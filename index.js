require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

morgan.token("request-body", (req) => JSON.stringify(req.body));
morgan.token("id", (req) => req.body.id);

const app = express();
app.use(cors());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :request-body"
  )
);
app.use(express.json());
app.use(express.static("dist"));

// let persons = [
//   {
//     id: "1",
//     name: "Artos Hellas",
//     number: "040-123456",
//   },
//   {
//     id: "2",
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: "3",
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: "4",
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

app.get("/", (request, response) =>
  response.send("<h1>Hello these are people</h1>")
);

app.get("/info", (request, response) => {
  Person.find({}).then((persons) => {
    return response.send(`
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
      `);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    return response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  // const person = persons.find((p) => p.id === id);
  Person.findById(id).then((person) => {
    response.json(person);
  });
  // if (person) response.json(person);
  // else {
  //   response.statusMessage = `resource with id ${id} not found`;
  //   response.status(404).end();
  // }
});

app.delete("/api/persons/:id", (request, response) => {
  // const id = request.params.id;
  // persons = persons.filter((p) => p.id !== id);
  // response.status(204).end();
  console.log("Delete not implemented");
});

// const generateId = () => String(Math.floor(Math.random() * 1000));

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number)
    return response.status(400).json({ error: "name or number missing" });

  // if (persons.find((p) => p.name === body.name))
  //   return response.status(400).json({ error: "name must be unique" });

  // const person = {
  //   id: generateId(),
  //   name: body.name,
  //   number: body.number,
  // };
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((result) => {
    console.log(`Added ${body.name} number ${body.number} to phonebook`);
    return response.json(person);
  });
  // persons = persons.concat(person);
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
