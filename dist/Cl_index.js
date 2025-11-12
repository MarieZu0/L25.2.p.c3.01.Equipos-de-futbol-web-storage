/*
Se requiere una micro-APP que permita registrar la información de unos equipos de jugadores
para distintos partidos de
fútbol. Cada equipo admite hasta 4 jugadores, minimo de 3 jugadores por equipo, de los que
se conoce su nombre y cedula.
Cada equipo también tiene un nombre.
-Los nombres de los equipos deben ser unicos, es decir, no deben repetirse.
-Las cédulas de los jugadores tampoco pueden repetirse.

Se requiere que la micro-APP permita:
-Agregar un nuevo equipo
-Listar los equipos
-Validar las restricciones indicadas
-Los dos datos son obligatorios en cada jugador
*/
import Cl_controlador from "./Cl_controlador.js";
import Cl_mPartido from "./Cl_mPartido.js";
import Cl_vPartido from "./Cl_vPartido.js";
export default class Cl_index {
    constructor() {
        let modelo = new Cl_mPartido();
        modelo.cargar((error) => {
            if (error)
                alert(error);
            if (error)
                throw new Error(error);
            let vista = new Cl_vPartido();
            let controlador = new Cl_controlador(modelo, vista);
            vista.controlador = controlador;
            vista.refresh();
        });
    }
}
