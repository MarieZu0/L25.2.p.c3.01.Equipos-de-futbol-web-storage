import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mEquipo, { iEquipo } from "./Cl_mEquipo.js";

interface iResultObjects{
    objects: [iEquipo] | null;
    error: string | false;
}
export default class Cl_mPartido {
    private partido: Cl_mEquipo[] = [];
    private db: Cl_dcytDb;
    readonly tbEquipo: string = "Mi.Equipo.v01";

    constructor(){
        this.db = new Cl_dcytDb({ aliasCuenta: "TERANEXUS CORE"});
    }

    agregarEquipo({
        equipo,
        callback,
    }: {
        equipo: Cl_mEquipo;
        callback: (error: string | false) => void;
    }): void {
        // Validar nombre del equipo repetido
        const nombreRepetido = this.partido.find(
            (e) => e.nombreEquipo.toLowerCase() === equipo.nombreEquipo.toLowerCase()
        );
        if (nombreRepetido) {
            callback(`El equipo ${equipo.nombreEquipo} ya existe`);
            return;
        }
        // Validar que el equipo no tenga menos de tres miembros
        if (equipo.cantidadJugadores() < 3)
        {
            callback(`El equipo ${equipo.nombreEquipo} debe tener al menos tres miembros.`);
            return;
        }


        // Validar cedula repetida
        if (equipo.error()) {
            callback(`El equipo ${equipo.nombreEquipo} tiene cédula repetida internamente.`);
            return;
        }
          // Validar cedulas contra todos los equipos existentes
        for (const e of this.partido) {
            if (
            e.existeCedula(equipo.cedula1) ||
            e.existeCedula(equipo.cedula2) ||
            e.existeCedula(equipo.cedula3) ||
            e.existeCedula(equipo.cedula4)
            ) {
            callback(
                `El equipo ${equipo.nombreEquipo} tiene cédula repetida con el equipo ${e.nombreEquipo}.`
            );
            return;
            }
        }

        // Agregar el equipo a la Web Storage
        this.db.addRecord({
            tabla: this.tbEquipo,
            object: equipo.toJSON(),

            callback: ({ id, objects, error }) => {
                if (!error) this.llenarPartido(objects);
                callback?.(error);
            },
        });
    }
    cargar(callback: (error: string | false) => void): void {
        // Obtener los equipos desde la Web Storage
        this.db.listRecords({
            tabla: this.tbEquipo,
            callback: ({ objects, error }: iResultObjects) => {
                if (!error) this.llenarPartido(objects || []);
                callback(false);
            },
        });
    }
    llenarPartido(partido: iEquipo[]): void {
        this.partido = [];
        partido.map((equipo) => this.partido.push(new Cl_mEquipo(equipo)));
    }
    listar(): iEquipo[] {
        return this.partido.map((equipo) => equipo.toJSON());
        }
    }