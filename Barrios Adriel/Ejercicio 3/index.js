// BASE PARA INICIAR CON EL SERVIDOR Y UNA API
import express from "express";

const app = express();
const port = 1234;
const tareas = [];

app.use(express.json());

//POST, Creamos una nueva tarea
app.post("/tareas", (req, res) =>{
  const nombre = req.body.nombre;
  const completada = req.body.completada;

  //Validacion de tarea existente
  const tareaExistente = tareas.find(t => t.nombre.toLowerCase() === nombre.toLowerCase());
  if (tareaExistente) {
    //Si la tarea existe devuelve el error y el mensaje
    return res.status(409).json({ error: "La tarea ya existe."});
  }
  
  //Si el nombre no se repite, guardamos la tarea
  const nuevaTarea = { nombre, completada: completada || false };
  tareas.push(nuevaTarea);
  res.status(201).json(nuevaTarea);
});

//GET obtenemos las tareas filtradas
app.get("/tareas", (req, res) =>{

  const tarea = req.query.tarea;
  
  let tareasFiltradas = tareas;

  //filtramos segun el valor "tarea" 
  if (tarea === "completadas") {
      tareasFiltradas = tareas.filter(t => t.completada == true);
  } else if (tarea === "sin-completar") {
      tareasFiltradas = tareas.filter(t => t.completada == false);
  }

  res.json(tareasFiltradas);
});

//GET filtra las tareas completadas y sin completar
app.get("/tareas", (req, res) =>{
    const tarea = req.query.tarea; // Aquí tenemos el filtro
    let tareasFiltradas = tareas;

    if (tarea === "completadas") {
        tareasFiltradas = tareas.filter(t => t.completada == true);
    } else if (tarea === "sin-completar") {
        tareasFiltradas = tareas.filter(t => t.completada == false);
    }
    res.json(tareasFiltradas);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});