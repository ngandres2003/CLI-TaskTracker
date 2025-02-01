import { existsSync, writeFileSync, readFileSync } from 'fs'
const ruta = './tareas.json'

if (!existsSync(ruta)) {

    writeFileSync(ruta, '[]')
}

const tareas = JSON.parse(readFileSync(ruta))

function guardarTareas() {
    writeFileSync(ruta, JSON.stringify(tareas, null, 2));
}

function obtenerHora() {
    return new Date().toISOString();
}

function agregarTarea(descripcion) {
    
    const id = tareas.length ? tareas[tareas.length - 1].id + 1 : 1


    const nuevaTarea = { 
        id, 
        descripcion, 
        estado: 'pendiente', 
        fechaCreacion: obtenerHora(), 

        fechaModificacion: obtenerHora() 
    };
    tareas.push(nuevaTarea)

    guardarTareas()

    console.log(`Tarea agregada (ID: ${id})`);
}

function actualizarTarea(id, descripcion) {

    const tarea = tareas.find(tarea => tarea.id === id)

    if (tarea) {


        tarea.descripcion = descripcion;

        tarea.fechaModificacion = obtenerHora();

        guardarTareas();
        console.log(`Tarea ${id} modificada a "${descripcion}"`);

    } else {
        console.log(`Tarea${id} no encontrada`);
    }


}

function eliminarTarea(id) {

    const index = tareas.findIndex(tarea => tarea.id === id);

    if (index !== -1) {

        tareas.splice(index, 1);

        guardarTareas();
        console.log(`Tarea ${id} eliminada`);
    } else {
        console.log(`Tarea ${id} no encontrada`);
    }
    console.log("aqui")
}

function marcarTarea(id, estado) {

    const tarea = tareas.find(tarea => tarea.id === id);
    if (tarea) {


        tarea.estado = estado
        tarea.fechaModificacion = obtenerHora()
        guardarTareas()

        console.log(`Tarea ${id} marcada como ${estado}`);
    } else {
        console.log(`Tarea ${id} no encontrada`);
    }
}

function listarTareas(filtro) {

    tareas.filter(tarea => !filtro || tarea.estado === filtro).forEach(tarea => {
        console.log(`${tarea.id}. ${tarea.descripcion} [${tarea.estado}] 
            (Creado: ${tarea.fechaCreacion},
             Actualizado: ${tarea.fechaModificacion})`);

    })
}

const [accion, ...args] = process.argv.slice(2);

switch (accion) {

    case 'agregar':
        agregarTarea(args.join(' '));
        break
    case 'actualizar':
        actualizarTarea(parseInt(args[0]), args.slice(1).join(' '));

        break
    case 'eliminar':
        eliminarTarea(parseInt(args[0]));
        break
    case 'marcar-en-progreso':

        marcarTarea(parseInt(args[0]), ' en-progreso');

        break
    case 'marcar-completada':
        marcarTarea(parseInt(args[0]), ' ompletada');
        break

    case 'listar':
        listarTareas(args[0]);
        break

    default:
        console.log('Uso: node app.js <accion> <args>');
        console.log(`Acciones: agregar <descripcion>, actualizar <id> <descripcion>, 
            eliminar <id>, marcar-en-progreso <id>, marcar-completada <id>, listar [estado]`);
}
