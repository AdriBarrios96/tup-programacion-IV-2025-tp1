// BASE PARA INICIAR CON EL SERVIDOR Y UNA API
import express from "express";

const app = express();
const port = 1234;
const alumnos = [];

app.use(express.json());

//Validaciones
const calcularPromedio = (notas) => {
  const suma = notas.reduce((acc, nota) => acc + nota, 0);
  return suma / notas.length;
};

const estadoAlumno = (promedio) => {
  if (promedio < 6) return "reprobado";
  if (promedio >= 6 && promedio <= 7) return "aprobado";
  if (promedio > 8) return "promocionado";
};

const validarNotas = (notas) => {
  return Array.isArray(notas) && notas.length === 3 && notas.every(nota => typeof nota === "number" && nota >= 0 && nota <= 10);
};

//POST, Creamos un nuevo alumno
app.post("/", (req, res) =>{
  const nombre = req.body.nombre;
  const notas = req.body.notas;

  //Validacion del nombre. FIND, chequea si el nombre ya existe, si lo encuentra devuelve 409
  const alumnoExistente = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());
  if (alumnoExistente) {
    return res.status(409).json({ error: "El nombre ya existe."});
  }
  
  //Validamos las notas
  if (!nombre || !validarNotas(notas)) {
    return res.status(400).json({ error: "Debe ingresar notas y nombre obligatoriamente."});
  }
  //Guardamos un alumno
  alumnos.push({ nombre, notas});
  res.status(201).json({mensaje: "Alumno creado exitosamente: "});
});

//GET obtenemos todos los alumnos
app.get("/", (req, res) => {
  res.json(alumnos);
});

//GET - obtiene un alumno y su estado
app.get("/:nombre", (req, res) =>{

  const nombre = req.params.nombre;
  const alumno = alumnos.find(a => a.nombre.toLowerCase() === nombre.toLowerCase());

  if (!alumno) {
    return res.status(404).json({ error: "Alumno no encontrado."});
  }

  //Promedio y estado
  const promedio = calcularPromedio(alumno.notas);
  const estado = estadoAlumno(promedio)

  res.json({
    nombre: alumno.nombre,
    notas: alumno.notas,
    promedio: promedio.toFixed(2),
    estado
  });
});

//PUT - Modificar notas de alumno
app.put("/:nombre", (req, res) => {
    const nombre = req.params.nombre;
    const nuevasNotas = req.body.notas;
    //usamos findIndex para encontrar la posicion del alumno en el arreglo
    const alumnoIndex = alumnos.findIndex(a => a.nombre.toLowerCase() === nombre.toLowerCase());

    //si no encuentra el alumno devuelve 404 Not Found
    if (alumnoIndex === -1) {
        return res.status(404).json({ error: "Alumno no encontrado." });
    }

    // Validación de nuevas notas
    if (!validarNotas(nuevasNotas)) {
        return res.status(400).json({ error: "Las notas deben ser 3 números entre 0 y 10." });
    }

    alumnos[alumnoIndex].notas = nuevasNotas;
    res.json({ mensaje: "NOTAS ACTUALIZADAS!!!.", alumno: alumnos[alumnoIndex]});
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});