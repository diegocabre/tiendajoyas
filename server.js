const express = require("express");
const joyas = require("./data/joyas.js").results;
const app = express();
const port = 3000;

app.use(express.json());

// Ruta GET /joyas que devuelve la estructura HATEOAS de todas las joyas
app.get("/joyas", (req, res) => {
  const hateoas = joyas.map((joya) => ({
    ...joya,
    links: {
      self: `/joyas/${joya.id}`,
      category: `/joyas/categoria/${joya.category}`,
    },
  }));
  res.json(hateoas);
});

// Ruta GET /joyas/categoria/:categoria que devuelve las joyas de una categoría específica
app.get("/joyas/categoria/:categoria", (req, res) => {
  const categoria = req.params.categoria;
  const joyasCategoria = joyas.filter((joya) => joya.category === categoria);
  res.json(joyasCategoria);
});

// Ruta GET /joyas/filtrar que permite el filtrado por campos
app.get("/joyas/filtrar", (req, res) => {
  let results = [...joyas];
  for (let [key, value] of Object.entries(req.query)) {
    results = results.filter(
      (joya) => joya[key].toString().toLowerCase() === value.toLowerCase()
    );
  }
  res.json(results);
});

// Ruta que devuelve un mensaje de error cuando el id de una joya no existe
app.get("/joyas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const joya = joyas.find((joya) => joya.id === id);
  if (!joya) {
    return res.status(404).json({ error: "Joya no encontrada" });
  }
  res.json(joya);
});

// Ruta GET /joyas/paginacion para permitir la paginación con query string
app.get("/joyas/paginacion", (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const results = joyas.slice(startIndex, endIndex);
  res.json(results);
  console.log(results);
});

// Ruta GET /joyas/ordenamiento para permitir el ordenamiento por valor ascendente o descendente con query string
app.get("/joyas/ordenamiento", (req, res) => {
  const { order = "asc" } = req.query;
  const results = [...joyas].sort((a, b) => {
    if (order === "asc") {
      return a.value - b.value;
    } else {
      return b.value - a.value;
    }
  });
  res.json(results);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
