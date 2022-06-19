//  Youtube: Magno Efren
//  https://www.youtube.com/c/MagnoEfren/videos

// funcion que muestra el menu responsive
function responsiveMenu(){
	var x = document.getElementById("nav");
	if(x.className===""){
		x.className = "responsive";
	}

	else{
		x.className ="";
	}
}

// funcion para cambiar-responsive

function seleccionar(link){
	var opciones= document.querySelectorAll("#links a");
	opciones[0].className = "";
	opciones[1].className = "";
	opciones[2].className = "";
	opciones[3].className = "";
	opciones[4].className = "";
	link.className ="seleccionado";
	var x =  document.getElementById("nav");
	x.className ="";
}


// Configuramos el Modo dark
var bdark = document.querySelector("#bdark");
var body = document.querySelector("body")

load_data();

bdark.addEventListener('click', e =>{
	body.classList.toggle('darkmode');
	store_app(body.classList.contains('darkmode'));
});

function load_data(){
	var darkmode = localStorage.getItem('darkmode');

 	if(!darkmode){
 		store_app('false');
 	}
 	else if(darkmode=='true'){
 		body.classList.add('darkmode');
 	}
 }

 function store_app(value){
 	localStorage.setItem('darkmode', value);
 }
