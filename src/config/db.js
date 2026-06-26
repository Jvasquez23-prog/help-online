import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: '',
  user: '',
  password: '',
  database: ''
});

db.connect((error) => {
  if (error) {
    console.error('Error de conexión MySQL: ', error);
  } else {
    console.log('!Conexión Existosa!')
  }
});

app.get("/Administrador", (request, response) => {
  db.query("SELECT * FROM Administradores", (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return response.json({ error: err });
    }
    
    response.json(result);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});