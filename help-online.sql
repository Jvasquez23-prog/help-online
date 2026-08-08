CREATE DATABASE help_online;
USE help_online;

CREATE TABLE Administradores (
	idAdm INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    p_apellido VARCHAR(255) NOT NULL,
    s_apellido VARCHAR(255) NOT NULL,
    cedula VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

INSERT INTO Administradores (nombre, p_apellido, s_apellido, cedula, contrasena)
VALUES ("Julio", "Vásquez", "Rodriguez", "123456789", "admin");

CREATE TABLE Pacientes(
	idPac INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    p_apellido VARCHAR(255) NOT NULL,
    s_apellido VARCHAR(255) NOT NULL,
    cedula VARCHAR(255) NOT NULL,
    edad INT NOT NULL,
    contrasena VARCHAR(255) NOT NULL
);

CREATE TABLE Areas(
	idArea INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
);

INSERT INTO Areas (nombre)
VALUES ("Cardiología");

INSERT INTO Areas (nombre)
VALUES ("Dermatología");

INSERT INTO Areas (nombre)
VALUES ("Oftamología");

INSERT INTO Areas (nombre)
VALUES ("Psciología");

INSERT INTO Areas (nombre)
VALUES ("Paliativos");

CREATE TABLE Doctores(
	idDoc INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    p_apellido VARCHAR(255) NOT NULL,
    s_apellido VARCHAR(255) NOT NULL,
    cedula VARCHAR(255) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    idArea INT NOT NULL,
    
    FOREIGN KEY (idArea) REFERENCES Areas(idArea)
);

CREATE TABLE Medicamentos (
	idMed INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cantidad INT,
    fecha_entrega DATE NOT NULL,
    idArea INT NOT NULL,
    
    FOREIGN KEY (idArea) REFERENCES Areas(idArea)
);

CREATE TABLE Citas(
	idCita INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(255) NOT NULL,
    fecha_cita DATETIME NOT NULL,
	idDoc INT NOT NULL,
    idPac INT NOT NULL,
    
    FOREIGN KEY (idDoc) REFERENCES Doctores(idDoc),
    FOREIGN KEY (idPac) REFERENCES Pacientes(idPac)
);

CREATE TABLE Consultas(
	idCon INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    descripcion TEXT NULL,
    cantidad INT NOT NULL,
    dosis VARCHAR(255) NOT NULL,
    frecuencia VARCHAR(255) NOT NULL,
    idCita INT NOT NULL,
    idMed INT NOT NULL,
    idPac INT NOT NULL,
    
    FOREIGN KEY (idCita) REFERENCES Citas(idCita),
    FOREIGN KEY (idMed) REFERENCES Medicamentos(idMed),
    FOREIGN KEY (idPac) REFERENCES Pacientes(idPac)
);

-- SELECT * FROM Pacientes;
-- SELECT * FROM Administradores;
-- SELECT * FROM Doctores;
-- SELECT * FROM Medicamentos;
-- SELECT * FROM Citas;