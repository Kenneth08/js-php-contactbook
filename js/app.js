const formularioContactos = document.querySelector('#contacto'),
    listadoContactos = document.querySelector('#listado-contactos tbody');
inputBuscador = document.querySelector('#buscar');
eventListeners();

function eventListeners() {
    //Cuando se ejecua el formulario de editar o agregar
    formularioContactos.addEventListener('submit', leerFormulario);
    //Listener para eliminar contacto
    if (listadoContactos) {
        listadoContactos.addEventListener('click', eliminarContacto);
    }
    //Buscar contactos
    inputBuscador.addEventListener('input', buscarContactos);
    //Número de contactos
    numeroContactos();
}
//Lee el formulario
function leerFormulario(e) {
    e.preventDefault();

    //Leer los datos de los inputs
    const nombre = document.querySelector('#nombre').value,
        empresa = document.querySelector('#empresa').value,
        telefono = document.querySelector('#telefono').value;
    accion = document.querySelector('#accion').value;

    if (nombre === '' || empresa === '' || telefono === '') {
        // 2 parametros: texto y clase
        mostrarNotificacion('Error: ¡Complete los espacios!', 'error');
    } else {
        //Pasa a validacion, crear llamado AJAX
        const infoContacto = new FormData();
        infoContacto.append('nombre', nombre);
        infoContacto.append('empresa', empresa);
        infoContacto.append('telefono', telefono);
        infoContacto.append('accion', accion);
        //console.log(...infoContacto);
        if (accion === 'crear') {
            //Crear un nuevo contacto

            insertarBD(infoContacto);
        } else {
            //Editar contacto
            //Leer id
            const idRegistro = document.querySelector('#id').value;
            infoContacto.append('id', idRegistro);
            actualizarRegistro(infoContacto);
        }

    }
}
//Inserta en la Base de Datos via AJAX
function insertarBD(infoContacto) {
    //llamado a AJAX
    //Crear el objeto
    const xhr = new XMLHttpRequest();
    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php');
    //Pasar los datos
    xhr.onload = function() {
            if (this.status === 200) {
                console.log(JSON.parse(xhr.responseText));
                //Leemos la respuesta de PHP
                const respuesta = JSON.parse(xhr.responseText);

                //Inserta un nuevo elemento a la tabla
                const nuevoContacto = document.createElement('tr');

                nuevoContacto.innerHTML = `
                <td>${respuesta.datos.nombre}</td>
                <td>${respuesta.datos.empresa}</td>
                <td>${respuesta.datos.telefono}</td>
                `;

                //Contenedor para los botones
                const contenedorAcciones = document.createElement('td');

                //Crear Icono de Editar
                const iconoEditar = document.createElement('i');
                iconoEditar.classList.add('fas', 'fa-user-edit');

                //Crear el enlace para editar
                const btnEditar = document.createElement('a');
                btnEditar.appendChild(iconoEditar);
                btnEditar.href = `editar.php?id=${respuesta.datos.id_insertado}`;
                btnEditar.classList.add('btn', 'btn-editar', 'cambio');

                //Agregra btnEditar al padre
                contenedorAcciones.appendChild(btnEditar);

                //Crear icono Eliminar
                const iconoEliminar = document.createElement('i');
                iconoEliminar.classList.add('fas', 'fa-trash-alt');

                //Crear el boton de eliminar
                const btnEliminar = document.createElement('button');
                btnEliminar.appendChild(iconoEliminar);
                btnEliminar.setAttribute('data-id', respuesta.datos.id_insertado);
                btnEliminar.classList.add('btn', 'btn-borrar', 'cambio');

                //Agregra btnEliminar al padre
                contenedorAcciones.appendChild(btnEliminar);

                //Agragarlo al tr
                nuevoContacto.appendChild(contenedorAcciones);

                //Agregarlo con los contactos
                listadoContactos.appendChild(nuevoContacto);

                //Recetear el formulario
                document.querySelector('form').reset();

                //Mostrar notificacion
                mostrarNotificacion('Contacto creado correctamente', 'correcto');

                //Actualizar número
                numeroContactos();
            }
        }
        //Enviar los datos
    xhr.send(infoContacto);
}
//Actualiza el registro al editarlo
function actualizarRegistro(infoContacto) {
    //console.log(...infoContacto);
    //Crear el objeto
    const xhr = new XMLHttpRequest();
    //Abrir la conexion
    xhr.open('POST', 'inc/modelos/modelo-contactos.php', true);
    //leer la respuesta
    xhr.onload = function() {
            if (this.status === 200) {
                const resultado = JSON.parse(xhr.responseText);

                if (resultado.respuesta === 'correcto') {
                    mostrarNotificacion('Contacto editado correctamente', 'correcto');
                } else {
                    mostrarNotificacion('Hubo un error...', 'error');
                }
                //Despues de 3 segundos redireccionar
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 4000);
            }
        }
        //enviar la peticion
    xhr.send(infoContacto);
}
//Eliminar Contacto
function eliminarContacto(e) {
    if (e.target.parentElement.classList.contains('btn-borrar')) {
        //Tomar id
        const id = e.target.parentElement.getAttribute('data-id');
        //console.log(id);
        //Preguntar al usuario si esta seguro
        const respuesta = confirm('¿Quieres eliminar el Contacto?');
        if (respuesta) {
            //Llamado a AJAX
            //Crear el objeto
            const xhr = new XMLHttpRequest();
            //Abrir la conexión
            xhr.open('GET', `inc/modelos/modelo-contactos.php?id=${id}&accion=borrar`, true);
            //Leer la respuesta
            xhr.onload = function() {
                    if (this.status === 200) {
                        const resultado = JSON.parse(xhr.responseText);
                        console.log(resultado);

                        if (resultado.respuesta === 'correcto') {
                            //Eliminar el registro del DOM
                            e.target.parentElement.parentElement.parentElement.remove();
                            //Mostrar Notificacion
                            mostrarNotificacion('Contacto eliminado', 'correcto');
                            //Actualiza el número
                            numeroContactos();
                        } else {
                            //Mostar una notificacion de que no se borró
                            mostrarNotificacion('Hubo un error...', 'error');
                        }
                    }
                }
                //Enviar la peticion
            xhr.send();



            //console.log('Eliminado');
        }
    }
}

//Notificacion en pantalla
function mostrarNotificacion(mensaje, clase) {
    const notificacion = document.createElement('div');
    notificacion.classList.add(clase, 'notificacion', 'sombra');
    notificacion.textContent = mensaje;

    //Formulario
    formularioContactos.insertBefore(notificacion, document.querySelector('form legend'));

    //Mostrar y ocultar notificaciones
    setTimeout(() => {
        notificacion.classList.add('visible');
        setTimeout(() => {
            notificacion.classList.remove('visible');

            setTimeout(() => {
                notificacion.remove();
            }, 500);
        }, 4000);
    }, 100);
}
//Busca los contactos
function buscarContactos(e) {
    const expresion = new RegExp(e.target.value, "i"),
        registros = document.querySelectorAll('tbody tr');

    registros.forEach(registro => {
        registro.style.display = 'none';
        console.log(registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1);
        if (registro.childNodes[1].textContent.replace(/\s/g, " ").search(expresion) != -1) {
            registro.style.display = 'table-row';
        }
        numeroContactos();
    })
}

//Muestra el número de contactos
function numeroContactos() {
    const totalContactos = document.querySelectorAll('tbody tr'),
        contenedorNumero = document.querySelector('.total-contactos span');

    let total = 0;
    totalContactos.forEach(contacto => {
        if (contacto.style.display === '' || contacto.style.display === 'table-row') {
            total++;
        }
    });
    // console.log(total);
    contenedorNumero.textContent = total;
}