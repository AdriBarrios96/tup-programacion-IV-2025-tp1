// BASE PARA INICIAR CON EL SERVIDOR Y UNA API
import express from "express";

const app = express();
const port = 1234;
const array = [];
app.use(express.json());

//Validamos que los numeros sean positivos
const validar = (base, altura) => {
  if (typeof base !== 'number' || typeof altura !== 'number' || base <=0 || altura<=0) {
    return false;
  }
  return true;
};

//ENDPOINT: GET - POST - DELETE - PUT

//POST, Creamos un nuevo calculo
app.post("/base-altura", (req, res) =>{
  const base = req.body.base;
  const altura = req.body.altura;

  //Validacion
  if (!validar(base, altura)) {
    return res.status(400).json({ error: 'La base y la altura deben ser positivas.'});
  }

  const perimetro = 2*(base+altura);
  const superficie = base*altura;
  array.push({base, altura, perimetro, superficie});

  res.json({mensaje: "Envio exitoso."});
});

app.get("/muestra", (req, res) =>{
  //mapeamos el arreglo para agregar el tipo de informacion
  const resultadoTipo = array.map(calculo => {
    //verificamos si es un cuadrado o un rectangulo
    const tipo = (calculo.base === calculo.altura) ? 'cuadrado' : 'rectangulo';
    //retornamos un objeto con los nuevos datos y el nuevo campo 'tipo'
    return { ...calculo, tipo};
  });
  res.json(resultadoTipo);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});