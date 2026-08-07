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
  const { cedula } = request.query;
  let query = "SELECT * FROM Pacientes";
  let params = [];

  if (cedula) {
    query += " WHERE cedula = ?";
    params.push(cedula);
  }

  db.query(query, params, (err, result) => {
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

app.get("/Medicamentos", (request, response) => {
  db.query("SELECT * FROM Medicamentos", (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return response.json({ error: err });
    }

    response.json(result);
  });
});

app.post("/Consultas", (request, response) => {
  const { cedula, cedulaDoc, idMed, cantidad, dosis, frecuencia, descripcion } = request.body;

  if (!cedula || !cedulaDoc || !idMed || !cantidad || !dosis || !frecuencia) {
    return response.status(400).json({ error: "Cédula del paciente, cédula del doctor, medicamento, cantidad, dosis y frecuencia son obligatorios" });
  }

  db.query(
    "SELECT idPac FROM Pacientes WHERE cedula = ?",
    [cedula],
    (err, pacResults) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error en el servidor al verificar el paciente" });
      }

      if (pacResults.length === 0) {
        return response.status(400).json({ error: "El paciente no se encuentra registrado" });
      }

      const idPac = pacResults[0].idPac;

      db.query(
        "SELECT idDoc FROM Doctores WHERE cedula = ?",
        [cedulaDoc],
        (docErr, docResults) => {
          if (docErr) {
            console.error(docErr);
            return response.status(500).json({ error: "Error en el servidor al verificar el doctor" });
          }

          if (docResults.length === 0) {
            return response.status(400).json({ error: "El doctor no se encuentra registrado" });
          }

          const idDoc = docResults[0].idDoc;

          db.query(
            "SELECT idMed FROM Medicamentos WHERE idMed = ?",
            [idMed],
            (medErr, medResults) => {
              if (medErr) {
                console.error(medErr);
                return response.status(500).json({ error: "Error en el servidor al verificar el medicamento" });
              }

              if (medResults.length === 0) {
                return response.status(400).json({ error: "El medicamento seleccionado no existe" });
              }

              db.query(
                `SELECT c.idCita
                 FROM Citas c
                 LEFT JOIN Consultas co ON co.idCita = c.idCita
                 WHERE c.idDoc = ? AND c.idPac = ? AND c.estado = 'Aprobada' AND co.idCon IS NULL
                 ORDER BY c.fecha_cita DESC LIMIT 1`,
                [idDoc, idPac],
                (citaErr, citaResults) => {
                  if (citaErr) {
                    console.error(citaErr);
                    return response.status(500).json({ error: "Error en el servidor al verificar la cita" });
                  }

                  if (citaResults.length === 0) {
                    return response.status(400).json({ error: "No hay una cita aprobada sin consulta registrada para este paciente" });
                  }

                  const insertConsulta = (idCita) => {
                    db.query(
                      "INSERT INTO Consultas (descripcion, cantidad, dosis, frecuencia, idCita, idMed, idPac) VALUES (?, ?, ?, ?, ?, ?, ?)",
                      [descripcion || null, cantidad, dosis, frecuencia, idCita, idMed, idPac],
                      (insertErr, result) => {
                        if (insertErr) {
                          console.error(insertErr);
                          return response.status(500).json({ error: "Error al registrar la consulta" });
                        }
                        response.json({ message: "Consulta registrada exitosamente" });
                      }
                    );
                  };

                  insertConsulta(citaResults[0].idCita);
                }
              );
            }
          );
        }
      );
    }
  );
});

app.get("/Recetas", (request, response) => {
  const { cedula } = request.query;

  if (!cedula) {
    return response.status(400).json({ error: "La cédula es obligatoria" });
  }

  db.query(
    "SELECT idPac FROM Pacientes WHERE cedula = ?",
    [cedula],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error en el servidor al verificar el paciente" });
      }

      if (results.length === 0) {
        return response.status(400).json({ error: "El paciente no se encuentra registrado" });
      }

      const idPac = results[0].idPac;

      db.query(
        `SELECT co.idCon, co.descripcion, co.cantidad, co.dosis, co.frecuencia,
                c.fecha_cita,
                m.nombre AS medicamento,
                CONCAT(d.nombre, ' ', d.p_apellido, ' ', d.s_apellido) AS doctor,
                a.nombre AS area
         FROM Consultas co
         INNER JOIN Citas c ON co.idCita = c.idCita
         INNER JOIN Medicamentos m ON co.idMed = m.idMed
         INNER JOIN Doctores d ON c.idDoc = d.idDoc
         INNER JOIN Areas a ON d.idArea = a.idArea
         WHERE co.idPac = ?
         ORDER BY c.fecha_cita DESC`,
        [idPac],
        (listErr, recetas) => {
          if (listErr) {
            console.error(listErr);
            return response.status(500).json({ error: "Error al obtener las recetas" });
          }
          response.json(recetas);
        }
      );
    }
  );
});

app.get("/Areas", (request, response) => {
  db.query("SELECT * FROM Areas", (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return response.json({ error: err });
    }

    response.json(result);
  });
});

app.post("/Areas", (request, response) => {
  const { nombre } = request.body;

  if (!nombre || !String(nombre).trim()) {
    return response.status(400).json({ error: "El nombre del área es obligatorio" });
  }

  const nombreLimpio = nombre.trim();

  db.query(
    "SELECT * FROM Areas WHERE nombre = ?",
    [nombreLimpio],
    (findErr, results) => {
      if (findErr) {
        console.error(findErr);
        return response.status(500).json({ error: "Error al verificar el área" });
      }

      if (results.length > 0) {
        return response.status(400).json({ error: "El área ingresada ya se encuentra registrada" });
      }

      db.query(
        "INSERT INTO Areas (nombre) VALUES (?)",
        [nombreLimpio],
        (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);
            return response.status(500).json({ error: "Error al registrar el área" });
          }
          response.json({ message: "Área registrada exitosamente" });
        }
      );
    }
  );
});

app.get("/Doctores", (request, response) => {
  const { area, cedula } = request.query;
  let query = "SELECT * FROM Doctores";
  const conditions = [];
  const params = [];

  if (cedula) {
    conditions.push("cedula = ?");
    params.push(cedula);
  }

  if (area) {
    conditions.push("idArea = ?");
    params.push(area);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return response.json({ error: err });
    }

    response.json(result);
  });
});

app.post("/Citas", (request, response) => {
  const { cedula, idDoc, fecha_cita } = request.body;

  if (!cedula || !idDoc || !fecha_cita) {
    return response.status(400).json({ error: "Cédula, doctor y fecha de cita son obligatorios" });
  }

  db.query(
    "SELECT idPac FROM Pacientes WHERE cedula = ?",
    [cedula],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error en el servidor al verificar el paciente" });
      }

      if (results.length === 0) {
        return response.status(400).json({ error: "El paciente no se encuentra registrado" });
      }

      const idPac = results[0].idPac;

      db.query(
        "INSERT INTO Citas (estado, fecha_cita, idDoc, idPac) VALUES (?, ?, ?, ?)",
        ["Programada", fecha_cita, idDoc, idPac],
        (insertErr, result) => {
          if (insertErr) {
            console.error(insertErr);
            return response.status(500).json({ error: "Error al registrar la cita" });
          }
          response.json({ message: "Cita registrada exitosamente" });
        }
      );
    }
  );
});

app.get("/Citas", (request, response) => {
  const { cedula, idDoc } = request.query;

  if (!cedula && !idDoc) {
    return response.status(400).json({ error: "La cédula o el doctor son obligatorios" });
  }

  const conditions = [];
  const params = [];

  const finish = () => {
    let query =
      `SELECT c.idCita, c.estado, c.fecha_cita,
              CONCAT(d.nombre, ' ', d.p_apellido, ' ', d.s_apellido) AS doctor,
              a.nombre AS area,
              CONCAT(p.nombre, ' ', p.p_apellido, ' ', p.s_apellido) AS paciente
       FROM Citas c
       INNER JOIN Doctores d ON c.idDoc = d.idDoc
       INNER JOIN Areas a ON d.idArea = a.idArea
       INNER JOIN Pacientes p ON c.idPac = p.idPac`;

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY c.fecha_cita DESC";

    db.query(query, params, (listErr, citas) => {
      if (listErr) {
        console.error(listErr);
        return response.status(500).json({ error: "Error al obtener las citas" });
      }
      response.json(citas);
    });
  };

  if (idDoc) {
    conditions.push("c.idDoc = ?");
    params.push(idDoc);
  }

  if (cedula) {
    db.query(
      "SELECT idPac FROM Pacientes WHERE cedula = ?",
      [cedula],
      (err, results) => {
        if (err) {
          console.error(err);
          return response.status(500).json({ error: "Error en el servidor al verificar el paciente" });
        }

        if (results.length === 0) {
          return response.status(400).json({ error: "El paciente no se encuentra registrado" });
        }

        conditions.push("c.idPac = ?");
        params.push(results[0].idPac);
        finish();
      }
    );
  } else {
    finish();
  }
});

app.post("/Citas/estado", (request, response) => {
  const { idCita, cedulaDoc, estado } = request.body;

  if (!idCita || !cedulaDoc || !estado) {
    return response.status(400).json({ error: "Cita, doctor y estado son obligatorios" });
  }

  if (!["Programada", "Aprobada", "Rechazada"].includes(estado)) {
    return response.status(400).json({ error: "El estado de la cita no es válido" });
  }

  db.query(
    `SELECT c.idCita
     FROM Citas c
     INNER JOIN Doctores d ON c.idDoc = d.idDoc
     WHERE c.idCita = ? AND d.cedula = ?`,
    [idCita, cedulaDoc],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error en el servidor al verificar la cita" });
      }

      if (results.length === 0) {
        return response.status(400).json({ error: "La cita no pertenece al doctor conectado" });
      }

      db.query(
        "UPDATE Citas SET estado = ? WHERE idCita = ?",
        [estado, idCita],
        (updateErr, result) => {
          if (updateErr) {
            console.error(updateErr);
            return response.status(500).json({ error: "Error al actualizar la cita" });
          }
          response.json({ message: "Cita actualizada exitosamente" });
        }
      );
    }
  );
});

app.put("/Doctores/:idDoc", (request, response) => {
  const { nombre, p_apellido, s_apellido, cedula, idArea } = request.body;
  const { idDoc } = request.params;

  if (!nombre || !p_apellido || !cedula || !idArea) {
    return response.status(400).json({ error: "Nombre, apellido, cédula y área son obligatorios" });
  }

  db.query(
    "UPDATE Doctores SET nombre = ?, p_apellido = ?, s_apellido = ?, cedula = ?, idArea = ? WHERE idDoc = ?",
    [nombre, p_apellido, s_apellido, cedula, idArea, idDoc],
    (err, result) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error al actualizar el doctor" });
      }
      response.json({ message: "Doctor actualizado exitosamente" });
    }
  );
});

app.delete("/Doctores/:idDoc", (request, response) => {
  const { idDoc } = request.params;

  db.query("DELETE FROM Doctores WHERE idDoc = ?", [idDoc], (err, result) => {
    if (err) {
      console.error(err);
      if (err.errno === 1451) {
        return response.status(400).json({ error: "No se puede eliminar: el doctor tiene citas asociadas" });
      }
      return response.status(500).json({ error: "Error al eliminar el doctor" });
    }
    if (result.affectedRows === 0) {
      return response.status(404).json({ error: "El doctor no existe" });
    }
    response.json({ message: "Doctor eliminado exitosamente" });
  });
});

app.put("/Medicamentos/:idMed", (request, response) => {
  const { nombre, cantidad, fecha_entrega, idArea } = request.body;
  const { idMed } = request.params;

  if (!nombre || !fecha_entrega || !idArea) {
    return response.status(400).json({ error: "Nombre, fecha de entrega y área son obligatorios" });
  }

  db.query(
    "UPDATE Medicamentos SET nombre = ?, cantidad = ?, fecha_entrega = ?, idArea = ? WHERE idMed = ?",
    [nombre, cantidad, fecha_entrega, idArea, idMed],
    (err, result) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error al actualizar el medicamento" });
      }
      response.json({ message: "Medicamento actualizado exitosamente" });
    }
  );
});

app.delete("/Medicamentos/:idMed", (request, response) => {
  const { idMed } = request.params;

  db.query("DELETE FROM Medicamentos WHERE idMed = ?", [idMed], (err, result) => {
    if (err) {
      console.error(err);
      if (err.errno === 1451) {
        return response.status(400).json({ error: "No se puede eliminar: el medicamento tiene consultas asociadas" });
      }
      return response.status(500).json({ error: "Error al eliminar el medicamento" });
    }
    if (result.affectedRows === 0) {
      return response.status(404).json({ error: "El medicamento no existe" });
    }
    response.json({ message: "Medicamento eliminado exitosamente" });
  });
});

app.put("/Areas/:idArea", (request, response) => {
  const { nombre } = request.body;
  const { idArea } = request.params;

  if (!nombre || !String(nombre).trim()) {
    return response.status(400).json({ error: "El nombre del área es obligatorio" });
  }

  db.query(
    "UPDATE Areas SET nombre = ? WHERE idArea = ?",
    [nombre.trim(), idArea],
    (err, result) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error al actualizar el área" });
      }
      response.json({ message: "Área actualizada exitosamente" });
    }
  );
});

app.delete("/Areas/:idArea", (request, response) => {
  const { idArea } = request.params;

  db.query("DELETE FROM Areas WHERE idArea = ?", [idArea], (err, result) => {
    if (err) {
      console.error(err);
      if (err.errno === 1451) {
        return response.status(400).json({ error: "No se puede eliminar: el área tiene registros asociados" });
      }
      return response.status(500).json({ error: "Error al eliminar el área" });
    }
    if (result.affectedRows === 0) {
      return response.status(404).json({ error: "El área no existe" });
    }
    response.json({ message: "Área eliminada exitosamente" });
  });
});

app.put("/Pacientes/:cedula", (request, response) => {
  const { nombre, p_apellido, s_apellido, edad } = request.body;
  const { cedula } = request.params;

  if (!nombre || !p_apellido || !edad) {
    return response.status(400).json({ error: "Nombre, apellido y edad son obligatorios" });
  }

  db.query(
    "UPDATE Pacientes SET nombre = ?, p_apellido = ?, s_apellido = ?, edad = ? WHERE cedula = ?",
    [nombre, p_apellido, s_apellido, edad, cedula],
    (err, result) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error al actualizar el paciente" });
      }
      if (result.affectedRows === 0) {
        return response.status(404).json({ error: "El paciente no existe" });
      }
      response.json({ message: "Paciente actualizado exitosamente" });
    }
  );
});

app.delete("/Pacientes/:cedula", (request, response) => {
  const { cedula } = request.params;

  db.query("DELETE FROM Pacientes WHERE cedula = ?", [cedula], (err, result) => {
    if (err) {
      console.error(err);
      if (err.errno === 1451) {
        return response.status(400).json({ error: "No se puede eliminar: el paciente tiene citas asociadas" });
      }
      return response.status(500).json({ error: "Error al eliminar el paciente" });
    }
    if (result.affectedRows === 0) {
      return response.status(404).json({ error: "El paciente no existe" });
    }
    response.json({ message: "Paciente eliminado exitosamente" });
  });
});

app.put("/Citas/:idCita", (request, response) => {
  const { fecha_cita, estado, cedulaDoc } = request.body;
  const { idCita } = request.params;

  if (!fecha_cita || !cedulaDoc) {
    return response.status(400).json({ error: "Fecha, estado y doctor son obligatorios" });
  }

  db.query(
    `SELECT c.idCita
     FROM Citas c
     INNER JOIN Doctores d ON c.idDoc = d.idDoc
     WHERE c.idCita = ? AND d.cedula = ?`,
    [idCita, cedulaDoc],
    (err, results) => {
      if (err) {
        console.error(err);
        return response.status(500).json({ error: "Error en el servidor al verificar la cita" });
      }

      if (results.length === 0) {
        return response.status(400).json({ error: "La cita no pertenece al doctor conectado" });
      }

      const newEstado = estado && ["Programada", "Aprobada", "Rechazada"].includes(estado) ? estado : results[0].estado;

      db.query(
        "UPDATE Citas SET fecha_cita = ?, estado = ? WHERE idCita = ?",
        [fecha_cita, newEstado, idCita],
        (updateErr, result) => {
          if (updateErr) {
            console.error(updateErr);
            return response.status(500).json({ error: "Error al actualizar la cita" });
          }
          response.json({ message: "Cita actualizada exitosamente" });
        }
      );
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
          return response.json({
            role: "admin",
            nombre: admin.nombre,
            p_apellido: admin.p_apellido,
            s_apellido: admin.s_apellido,
            cedula: admin.cedula
          });
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

              response.json({
                role: "doctor",
                nombre: doctor.nombre,
                p_apellido: doctor.p_apellido,
                s_apellido: doctor.s_apellido,
                cedula: doctor.cedula
              });
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

                response.json({
                  role: "paciente",
                  nombre: paciente.nombre,
                  p_apellido: paciente.p_apellido,
                  s_apellido: paciente.s_apellido,
                  cedula: paciente.cedula
                });
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