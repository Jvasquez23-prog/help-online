import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'help_online'
});

db.connect((error) => {
  if (error) {
    console.error('Error de conexión MySQL: ', error);
  } else {
    console.log('!Conexión Existosa!')
  }
});

function verificarCedulaUnica(cedula, callback) {
  db.query(
    "SELECT 'Pacientes' AS tabla FROM Pacientes WHERE cedula = ? " +
    "UNION SELECT 'Administradores' FROM Administradores WHERE cedula = ? " +
    "UNION SELECT 'Doctores' FROM Doctores WHERE cedula = ?",
    [cedula, cedula, cedula],
    (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    }
  );
}

app.get("/Administrador", (request, response) => {
  db.query("SELECT * FROM Administradores", (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return response.json({ error: err });
    }
    
    response.json(result);
  });
});

app.get("/Pacientes", (request, response) => {
  db.query("SELECT * FROM Pacientes", (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return response.json({ error: err });
    }
    
    response.json(result);
  });
});

app.post("/Pacientes", (request, response) => {
  const { nombre, p_apellido, s_apellido, cedula, edad, contrasena } = request.body;

  verificarCedulaUnica(cedula, (err, results) => {
    if (err) {
      console.error(err);
      return response.status(500).json({ error: "Error en el servidor al verificar la cédula" });
    }

    if (results.length > 0) {
      return response.status(400).json({ error: "La cédula ingresada ya se encuentra registrada" });
    }

    bcrypt.hash(contrasena, 10, (hashErr, contrasenaEncriptada) => {
      if (hashErr) {
        console.error(hashErr);
        return response.status(500).json({ error: "Error interno al procesar la seguridad" });
      }

      db.query(
        "INSERT INTO Pacientes (nombre, p_apellido, s_apellido, cedula, edad, contrasena) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, p_apellido, s_apellido, cedula, edad, contrasenaEncriptada],
        (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);
            return response.status(500).json({ error: "Error al registrar el paciente" });
          }
          response.json({ message: "Usuario registrado exitosamente" });
        }
      );
    });
  });
});

app.post("/Doctores", (request, response) => {
  const { nombre, p_apellido, s_apellido, cedula, contrasena, idArea } = request.body;

  verificarCedulaUnica(cedula, (err, results) => {
    if (err) {
      console.error(err);
      return response.status(500).json({ error: "Error en el servidor al verificar la cédula" });
    }

    if (results.length > 0) {
      return response.status(400).json({ error: "La cédula ingresada ya se encuentra registrada" });
    }

    bcrypt.hash(contrasena, 10, (hashErr, contrasenaEncriptada) => {
      if (hashErr) {
        console.error(hashErr);
        return response.status(500).json({ error: "Error interno al procesar la seguridad" });
      }

      db.query(
        "INSERT INTO Doctores (nombre, p_apellido, s_apellido, cedula, contrasena, idArea) VALUES (?, ?, ?, ?, ?, ?)",
        [nombre, p_apellido, s_apellido, cedula, contrasenaEncriptada, idArea],
        (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);
            return response.status(500).json({ error: "Error al registrar el doctor" });
          }
          response.json({ message: "Doctor registrado exitosamente" });
        }
      );
    });
  });
});

app.post("/Medicamentos", (request, response) => {
  const { nombre, cantidad, fecha_entrega, idArea } = request.body;

  db.query(
    "INSERT INTO Medicamentos (nombre, cantidad, fecha_entrega, idArea) VALUES (?, ?, ?, ?)",
    [nombre, cantidad, fecha_entrega, idArea],
    (insertErr, result) => {
      if (insertErr) {
        console.error(insertErr);
        return response.status(500).json({ error: "Error al registrar el medicamento" });
      }
      response.json({ message: "Medicamento registrado exitosamente" });
    }
  );
});

app.post("/Login", (request, response) => {
  const { cedula, contrasena } = request.body;

  db.query(
    "SELECT * FROM Administradores WHERE cedula = ?",
    [cedula],
    (adminErr, adminResults) => {
      if (adminErr) {
        console.error(adminErr);
        return response.status(500).json({ error: "Error en el servidor al verificar el administrador" });
      }

      if (adminResults.length > 0) {
        const admin = adminResults[0];
        if (admin.contrasena === contrasena) {
          return response.json({ role: "admin", nombre: admin.nombre });
        }
        return response.status(400).json({ error: "La cédula o contraseña no es válida" });
      }

      db.query(
        "SELECT * FROM Doctores WHERE cedula = ?",
        [cedula],
        (docErr, docResults) => {
          if (docErr) {
            console.error(docErr);
            return response.status(500).json({ error: "Error en el servidor al verificar el doctor" });
          }

          if (docResults.length > 0) {
            const doctor = docResults[0];
            bcrypt.compare(contrasena, doctor.contrasena, (bcryptErr, match) => {
              if (bcryptErr) {
                console.error(bcryptErr);
                return response.status(500).json({ error: "Error en el servidor al verificar la contraseña" });
              }

              if (!match) {
                return response.status(400).json({ error: "La cédula o contraseña no es válida" });
              }

              response.json({ role: "doctor", nombre: doctor.nombre });
            });
            return;
          }

          db.query(
            "SELECT * FROM Pacientes WHERE cedula = ?",
            [cedula],
            (pacErr, pacResults) => {
              if (pacErr) {
                console.error(pacErr);
                return response.status(500).json({ error: "Error en el servidor al verificar el paciente" });
              }

              if (pacResults.length === 0) {
                return response.status(400).json({ error: "La cédula o contraseña no es válida" });
              }

              const paciente = pacResults[0];
              bcrypt.compare(contrasena, paciente.contrasena, (bcryptErr, match) => {
                if (bcryptErr) {
                  console.error(bcryptErr);
                  return response.status(500).json({ error: "Error en el servidor al verificar la contraseña" });
                }

                if (!match) {
                  return response.status(400).json({ error: "La cédula o contraseña no es válida" });
                }

                response.json({ role: "paciente", nombre: paciente.nombre });
              });
            }
          );
        }
      );
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});