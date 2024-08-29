const express = require("express");
const cors = require('cors')
const app = express();
const requestLogger = (request, response, next) => {
  console.log("Back: Method:", request.method);
  console.log("Back: Path:  ", request.path);
  console.log("Back: Body:  ", request.body);
  console.log("---");
  next();
};

// Sin json-parser, la propiedad body no estaría definida.
app.use(express.json()); //de json a obj
app.use(cors())
app.use(requestLogger);

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
  {
    id: 4,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  // console.log(request.headers);
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.statusMessage = "Note not found";
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((note) => note.id !== id);

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;

  const note = request.body; //con json-parser transforma el Json a un objeto
  console.log("Back: note del body: ", note);

  note.id = maxId + 1;

  notes = notes.concat(note);

  response.json(note); //devuelve un json de las notas
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
