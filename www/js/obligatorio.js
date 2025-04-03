// Usuario :MarianoRam
// contraseña: MarianoRam



class Usuario{
    constructor(usuario,password,idPais){
         this.usuario=usuario
         this.password=password
         this.idPais=idPais

    }
}

class UsuarioLogueado{
    constructor(usuario,password){
        this.usuario= usuario 
        this.password= password
    }
}


class Actividad{
    constructor(idActividad,idUsuario,tiempo,fecha)
    {
    this.idActividad=idActividad
    this.idUsuario=idUsuario
    this.tiempo=tiempo
    this.fecha=fecha 
    }
}

let listaActividades=[]
let map;
let markers = {};

const URLBASE="https://movetrack.develotion.com/"

const MENU= document.querySelector("#menu")
const ROUTER= document.querySelector("#ruteo")
const HOME= document.querySelector("#pantalla-home")
const LOGIN= document.querySelector("#pantalla-login")
const REGISTROU= document.querySelector("#pantalla-registroU")

const REGISTROA = document.querySelector("#pantalla-registroA");
const LISTADO = document.querySelector("#pantalla-listado");
const INFORME = document.querySelector("#pantalla-informe");
const MAPA = document.querySelector("#pantalla-mapa");

inicio()
function cerrarMenu(){
    MENU.close()
}

function inicio(){
    ROUTER.addEventListener("ionRouteDidChange", navegar) 
    document.querySelector("#btnRegistroURegistrar").addEventListener("click", previaRegistro);
    document.querySelector("#btnLoginLogin").addEventListener("click",previaLogin)
    document.querySelector("#btnRegistrarActividad").addEventListener("click", previaRegistroActividad);
    document.querySelector("#btnFiltrarRegistros").addEventListener("click", previaHacerListado);
    document.querySelector("#btnMenuInforme").addEventListener("click", previaHacerInforme);
    document.querySelector("#btnMenuLogout").addEventListener("click", logout);
    document.querySelector("#btnMenuMapa").addEventListener("click", crearMapa);


    
    cargarActividades()
    chequearSesion()
}

function navegar(evt){
     //console.log(evt)
    const ruta= evt.detail.to;
    ocultarPantallas();
    if (ruta=="/") HOME.style.display="block"
    if (ruta=="/login") LOGIN.style.display="block"
    if (ruta=="/registroU") REGISTROU.style.display="block"
    if (ruta == "/registroA") REGISTROA.style.display = "block";
    if (ruta == "/listado") LISTADO.style.display = "block";
    if (ruta == "/informe") INFORME.style.display = "block";
    if (ruta == "/mapa") MAPA.style.display = "block";



}

function ocultarPantallas(){
    HOME.style.display="none"
    LOGIN.style.display="none"
    REGISTROU.style.display="none"
    REGISTROA.style.display = "none";
    LISTADO.style.display = "none";
    INFORME.style.display = "none";
    MAPA.style.display = "none";



}

function cargarActividades(){
    obtenerPaises()
}


//-------------------------------------Registro----------------------------------------------------------------------------------


function previaRegistro(){
    let usuario = document.querySelector("#txtRegistroUsuario").value;
    let password = document.querySelector("#txtRegistroPassword").value;
    let idPais = document.querySelector("#slcPais").value;



    // Validación para el nombre 
    if (usuario.length <= 2) {
        mostrarMensaje("ERROR", "El nombre de usuario debe tener más de 2 caracteres.", "", 2000);
        return; 
    }

    // Validación para la contraseña
    if (password.length <= 2) {
        mostrarMensaje("ERROR", "La contraseña debe tener más de 2 caracteres.", "", 2000);
        return; 
    }

    if (!idPais) {
        mostrarMensaje("ERROR", "Debe seleccionar un país.", "", 2000);
        return; 
    }

    let nuevoUsuario= new Usuario(usuario, password, idPais)
    registrarUsuario(nuevoUsuario)
}

function registrarUsuario(nuevoUsuario){
console.log(nuevoUsuario)
    fetch (`${URLBASE}usuarios.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoUsuario)
        })
        .then(function (response){
            console.log(response)
            return response.json()
        })
        .then(function(informacion){
             
            if (informacion.codigo>199 && informacion.codigo<300){
                mostrarMensaje("SUCCESS","Usuario creado con éxito","",2000)
                localStorage.setItem("id", informacion.id);
                localStorage.setItem("apiKey", informacion.apiKey); 
                ocultarMenu()
                mostrarMenuVIP()       
            } else {
                mostrarMensaje("ERROR","Ya existe usuario","",2000)
            }    
            ocultarPantallas();
            HOME.style.display = "block";
            
            
        })
        .catch(function(error){
        console.log(error)
        })
}

function obtenerPaises(){
    fetch (`${URLBASE}paises.php`)
        .then(function (response){
            console.log(response) 
            return response.json()
        })
        .then(function(informacion){
            console.log(informacion)
            mostrarPaises(informacion.paises)
        })
        .catch(function(error){
        console.log(error)
        })
}

function mostrarPaises(listaPaises)
{
    console.log(listaPaises)
    let miSelect=""
    for(let unPais of listaPaises)
    {
        miSelect += `<ion-select-option value="${unPais.id}">${unPais.name}</ion-select-option>`;
    }
    document.querySelector("#slcPais").innerHTML=miSelect
}


//-------------------------------------Login----------------------------------------------------------------------------------


function previaLogin(){
    let usuario= document.querySelector("#txtLoginUsuario").value       
    let password= document.querySelector("#txtLoginPassword").value  

    let usuarioLogueado= new UsuarioLogueado(usuario,password)
    loguearUsuario(usuarioLogueado)
}


function loguearUsuario(usuarioLogueado){
    fetch (`${URLBASE}login.php`,{
        method:'POST',
        headers:{
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuarioLogueado)
        })
        .then(function (response){
            console.log(response) 
            return response.json()
        })
        .then(function(informacion){
            console.log(informacion)
            if (informacion.codigo=="200"){
                mostrarMensaje("SUCCESS","Bienvenido","",2000)                 
                localStorage.setItem("id",informacion.id)
                localStorage.setItem("apiKey",informacion.apiKey)
                ocultarMenu()
                mostrarMenuVIP()
            }           
            ocultarPantallas()
            HOME.style.display="block"
            
        })
        .catch(function(error){
        console.log(error)
        })

}



//----------------------------------------LOGOUT----------------------------------------------------------F

function logout() {
    localStorage.removeItem("id");
    localStorage.removeItem("apiKey");

    ocultarMenu(); 
    mostrarMenuComun(); 
    ocultarPantallas();
    HOME.style.display = "block";

    mostrarMensaje("SUCCESS", "Has cerrado sesión correctamente.", "", 2000);
}



//-------------------------------------Actividad----------------------------------------------------------------------------------

 
function previaRegistroActividad()
{
    let idActividad= document.querySelector("#slcActividad").value       
    let idUsuario= localStorage.getItem("id")
    let tiempo= document.querySelector("#txtRegistroTiempo").value
    let fecha= document.querySelector("#txtRegistroFecha").value


    // Verificar si no se ha seleccionado una actividad
    if (!idActividad) {
        mostrarMensaje("ERROR", "Debe seleccionar una actividad.", "", 2000);
        return;
    }

    //verificar tiempo valido
    if (tiempo <= 0) {
        mostrarMensaje("ERROR", "El tiempo debe ser mayor a 0 minutos.", "", 2000);
        return; 
    }
       
    let unaActividad= new Actividad(idActividad, idUsuario, tiempo, fecha)
    registrarActividad(unaActividad)
}

function registrarActividad(unaActividad){
    let hoy = new Date().toISOString().split("T")[0]; 
    let fechaActividad = new Date(unaActividad.fecha).toISOString().split("T")[0]; 

    if (fechaActividad > hoy) {
        mostrarMensaje("ERROR", "No puedes registrar actividades en fechas futuras.", "", 2000);
        return; 
    }

    fetch (`${URLBASE}registros.php`,{
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            'iduser':localStorage.getItem("id"),
            'apikey':localStorage.getItem("apiKey"),
        },
        body: JSON.stringify(unaActividad)
        })
        .then(function (response){
            return response.json()
        })
        .then(function(informacion){
                console.log(informacion)
                mostrarMensaje("SUCCESS","Se registro la actividad correctamente","",2000)                         
        })
        .catch(function(error){
        console.log(error)
        })
}


function obtenerActividades(){
    fetch (`${URLBASE}actividades.php`,{
        method:'GET',
        headers:{
        'Content-Type': 'application/json',
        'apikey':localStorage.getItem("apiKey"),
        'iduser':localStorage.getItem("id"),
        },
        })
        .then(function (response){
            console.log(response) 
            return response.json()
        })
        .then(function(informacion){
            mostrarActividades(informacion.actividades) 
            listaActividades=informacion.actividades                                 
        })
        .catch(function(error){
        console.log(error)
        })
}

function mostrarActividades(listaActividades)
{
    console.log(listaActividades)
    let miSelect="" 
    for(let unaActividad of listaActividades)
    {
        miSelect += `<ion-select-option value="${unaActividad.id}">${unaActividad.nombre}</ion-select-option>`;
    }
    document.querySelector("#slcActividad").innerHTML=miSelect
}







//-----------------------------------------Listado-----------------------------------------------------------------------------
 

// Función para obtener la fecha actual en formato YYYY-MM-DD
function obtenerFechaHoy() {
    const hoy = new Date();
    const año = hoy.getFullYear();
    const mes = ('0' + (hoy.getMonth() + 1)).slice(-2);
    const dia = ('0' + hoy.getDate()).slice(-2);
    let fecha=año+"-"+mes+"-"+dia
}


function previaHacerListado(){
    
    let url="https://movetrack.develotion.com/registros.php?idUsuario="+localStorage.getItem("id")
    fetch (`${url}`,{
        method:'GET',
        headers:{
        'Content-Type': 'application/json',
        'apikey':localStorage.getItem("apiKey"),
        'iduser':localStorage.getItem("id"),
        }
        })
        .then(function (response){
            console.log(response)
             return response.json()
        })
        .then(function(informacion){
            console.log(informacion)
            hacerListado(informacion.registros)
        
        })
        .catch(function(error){
        console.log(error)
        })
}


function hacerListado(listaActividadesRealizadas) {
    console.log(listaActividadesRealizadas);
    let hoy = new Date(); // Fecha actual
    let filtro = document.querySelector("#slcFiltro").value; 

    let verActividad = "";

    for (let unaActividadRealizada of listaActividadesRealizadas) {
        let fechaActividad = new Date(unaActividadRealizada.fecha);

        if (filtro === "todo") {
            // Mostrar todas las actividades sin filtro
            nombreA = obtenerNombreActividad(unaActividadRealizada.idActividad);
            foto = obtenerImagenActividad(unaActividadRealizada.idActividad);
            verActividad += `<ion-item>
                                <ion-img src="${foto}"></ion-img>
                                <ion-label>
                                    <h3>Id: ${unaActividadRealizada.id}</h2>
                                    <h3>Nombre: ${nombreA}</h3>
                                    <p>Tiempo: ${unaActividadRealizada.tiempo}</p>
                                    <p>Fecha: ${unaActividadRealizada.fecha}</p>
                                </ion-label>
                                <ion-button onclick="eliminarActividad(${unaActividadRealizada.id})">Eliminar</ion-button>
                            </ion-item>`;
        } else if (filtro === "semana") {
            // Filtro para la semana (últimos 7 días)
            let hace7Dias = new Date(hoy); 
            hace7Dias.setDate(hoy.getDate() - 7); 

            if (fechaActividad >= hace7Dias && fechaActividad <= hoy) {
                nombreA = obtenerNombreActividad(unaActividadRealizada.idActividad);
                foto = obtenerImagenActividad(unaActividadRealizada.idActividad);
                verActividad += `<ion-item>
                                    <ion-img src="${foto}"></ion-img>
                                    <ion-label>
                                        <h3>Id: ${unaActividadRealizada.id}</h2>
                                        <h3>Nombre: ${nombreA}</h3>
                                        <p>Tiempo: ${unaActividadRealizada.tiempo}</p>
                                        <p>Fecha: ${unaActividadRealizada.fecha}</p>
                                    </ion-label>
                                    <ion-button onclick="eliminarActividad(${unaActividadRealizada.id})">Eliminar</ion-button>
                                </ion-item>`;
            }
        } else if (filtro === "mes") {
            // Filtro para el mes actual
            if (fechaActividad.getMonth()  === hoy.getMonth() && 
                fechaActividad.getFullYear() === hoy.getFullYear() ) 
                {
                nombreA = obtenerNombreActividad(unaActividadRealizada.idActividad);
                foto = obtenerImagenActividad(unaActividadRealizada.idActividad);
                verActividad += `<ion-item>
                                    <ion-img src="${foto}"></ion-img>
                                    <ion-label>
                                        <h3>Id: ${unaActividadRealizada.id}</h2>
                                        <h3>Nombre: ${nombreA}</h3>
                                        <p>Tiempo: ${unaActividadRealizada.tiempo}</p>
                                        <p>Fecha: ${unaActividadRealizada.fecha}</p>
                                    </ion-label>
                                    <ion-button onclick="eliminarActividad(${unaActividadRealizada.id})">Eliminar</ion-button>
                                </ion-item>`;
                }      
        }
    }
    document.querySelector("#listaRegistros").innerHTML = verActividad;
}



function eliminarActividad(unRegistro){
    let url="https://movetrack.develotion.com/registros.php?idRegistro="+unRegistro
    fetch(`${url} `, {
        method: 'DELETE',
        headers: {
        'Content-Type': 'application/json',
        'apikey':localStorage.getItem("apiKey"),
        'iduser':localStorage.getItem("id"),
        },
        
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
             console.log(data)
             previaHacerListado()
             mostrarMensaje("SUCCESS","Se elimino la actividad correctamente","",2000)                         


        })
        .catch(function(error){
        console.log(error)
        })
}



function obtenerNombreActividad(id){
    for (let unaActividad of listaActividades){
        if (unaActividad.id==id) return unaActividad.nombre
    }
}

function obtenerImagenActividad(id){
    let url
    for (let unaActividad of listaActividades){
        if (unaActividad.id==id) {
            return url="https://movetrack.develotion.com/imgs/"+unaActividad.imagen+".png"

        }
    }
}






//----------------------------------------INFORME----------------------------------------------------------

function previaHacerInforme() {
    let url = "https://movetrack.develotion.com/registros.php?idUsuario=" + localStorage.getItem("id");

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'apikey': localStorage.getItem("apiKey"),
            'iduser': localStorage.getItem("id"),
        }
    })
    .then(response => response.json())
    .then(informacion => {
        console.log(informacion);
        hacerInforme(informacion.registros);
    })
    .catch(error => console.log(error));
}



function hacerInforme(listaActividadesRealizadas) {
    let tiempoTotal = 0;
    let tiempoDiario = 0;
    let hoy = new Date().toISOString().split("T")[0]; // Convertir a "YYYY-MM-DD"

    for (let unaActividadRealizada of listaActividadesRealizadas) {
        let fechaActividad = new Date(unaActividadRealizada.fecha).toISOString().split("T")[0]; 


        tiempoTotal += parseInt(unaActividadRealizada.tiempo) || 0;

        if (fechaActividad === hoy) { 
            tiempoDiario += parseInt(unaActividadRealizada.tiempo) || 0;
        }
    }
    
    mostrarInformeEnHTML(tiempoTotal, tiempoDiario);
}


function mostrarInformeEnHTML(tiempoTotal, tiempoDiario) {
    document.querySelector("#tiempo-total").textContent = `${tiempoTotal} minutos`;
    document.querySelector("#tiempo-diario").textContent = `${tiempoDiario} minutos`;
}



//----------------------------------------MAPA----------------------------------------------------------

function crearMapa(){

    if (map !== undefined) {
        map.remove(); // Eliminar el mapa existente
    }

    var map = L.map('map').setView([-15, -60], 4); 
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    var paisesLatam = [
        { name: "Argentina", lat: -34.6037, lng: -58.3816 },
        { name: "Bolivia", lat: -16.5000, lng: -68.1500 },
        { name: "Brazil", lat: -15.7801, lng: -47.9292 },
        { name: "Chile", lat: -33.4489, lng: -70.6693 },
        { name: "Colombia", lat: 4.6097, lng: -74.0817 },
        { name: "Ecuador", lat: -0.2295, lng: -78.5243 },
        { name: "Paraguay", lat: -25.2637, lng: -57.5759 },
        { name: "Peru", lat: -12.0464, lng: -77.0428 },
        { name: "Uruguay", lat: -34.9011, lng: -56.1645 },
        { name: "Venezuela", lat: 10.4806, lng: -66.9036 }
    ];


    paisesLatam.forEach(pais => {
        let marcador = L.marker([pais.lat, pais.lng]).addTo(map)
            .bindPopup(`<b>${pais.name}</b><br>Usuarios: 0`);

        markers[pais.name] = {
            marcador: marcador,
            usuarios: 0
        };
    });

    obtenerUsuariosPorPais()
}



    function obtenerUsuariosPorPais() {
        fetch(`${URLBASE}usuariosPorPais.php`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': localStorage.getItem("apiKey"),
                'iduser': localStorage.getItem("id"),
            },
        })
        .then(function(response) {
            return response.json(); 
        })
        .then(function(informacion) {
            actualizarMarcadores(informacion.paises); 
        })
        .catch(function(error) {
            console.log(error);
        });
    }
    

    function actualizarMarcadores(datos) {
    datos.filter(pais => markers[pais.name])  
        .forEach(pais => {
            markers[pais.name].usuarios = pais.cantidadDeUsuarios;
            
            markers[pais.name].marcador.setPopupContent(
                `<b>${pais.name}</b><br>Usuarios: ${pais.cantidadDeUsuarios}`
            );
        });
    }
    




//----------------------------------------MENU----------------------------------------------------------


function ocultarMenu(){
    document.querySelector("#btnMenuRegistroU").style.display="none"
    document.querySelector("#btnMenuLogin").style.display="none"
    document.querySelector("#btnMenuRegistroA").style.display="none"
    document.querySelector("#btnMenuListado").style.display="none"
    document.querySelector("#btnMenuInforme").style.display="none"
    document.querySelector("#btnMenuMapa").style.display="none"
    document.querySelector("#btnMenuLogout").style.display="none"
}


function mostrarMenuComun(){
    document.querySelector("#btnMenuRegistroU").style.display="block"
    document.querySelector("#btnMenuLogin").style.display="block"    
}

function mostrarMenuVIP(){
    document.querySelector("#btnMenuRegistroA").style.display="block"
    document.querySelector("#btnMenuListado").style.display="block"
    document.querySelector("#btnMenuInforme").style.display="block"
    document.querySelector("#btnMenuMapa").style.display="block"
    document.querySelector("#btnMenuLogout").style.display="block"
    obtenerActividades();
    previaHacerListado()
    
}


function chequearSesion(){
    ocultarMenu()
    if (localStorage.getItem("id")==null){
        mostrarMenuComun()
    } else{
        mostrarMenuVIP()
    }
}


function mostrarMensaje(tipo, titulo, texto, duracion) {
    const toast = document.createElement('ion-toast');
    toast.header = titulo;
    toast.message = texto;
    if (!duracion) {
    duracion = 2000;
    }
    toast.duration = duracion;
    if (tipo === "ERROR") {
    toast.color = 'danger';
    toast.icon = "alert-circle-outline";
    } else if (tipo === "WARNING") {
    toast.color = 'warning';
    toast.icon = "warning-outline";
    } else if (tipo === "SUCCESS") {
    toast.color = 'success';
    toast.icon = "checkmark-circle-outline";
    }
    document.body.appendChild(toast);
    toast.present();
}


//Mariano rama 325403
