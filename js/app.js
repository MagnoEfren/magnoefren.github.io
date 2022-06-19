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

// funcion que me ampli ael estil a la opcion selecionada en el menu quita la previsuacion selecionada

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


//Modo oscuro (Dark Mode)


var bdark = document.querySelector("#bdark");
var body = document.querySelector("body")

load();


bdark.addEventListener('click', e =>{
	body.classList.toggle('darkmode');
	store(body.classList.contains('darkmode'));
});



 function load(){
 	var darkmode = localStorage.getItem('darkmode');

 	if(!darkmode){
 		store('false');
 	}
 	else if(darkmode=='true'){
 		body.classList.add('darkmode');
 	}
 }

 function store(value){
 	localStorage.setItem('darkmode', value);
 }
