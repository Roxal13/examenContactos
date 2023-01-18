let contacts = document.getElementById("contacts");

//variable de localStorage para las empresas marcadas
let empresas = localStorage.empresas ? JSON.parse(localStorage.empresas) : [];
let empresasMarked = empresas.map(e => e = e.id);

updateList();

function updateList() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  fetch("api/contacts", requestOptions)
    .then(response => response.json())
    .then(contactos => {
      if (empresas.length > 0) {
        let contactosMarked = contactos.filter(c => empresasMarked.includes(c.company_id));
        contactosMarked.sort(function (a, b) {
          if(a.first_name < b.first_name){
            return -1;
          }
          if(a.first_name > b.first_name){
            return 1;
          }
          return 0
        });
        contactosMarked.forEach(c => {
          crearCard(c);
        })
      } else {
        contactos.forEach(c => {
          crearCard(c);
        })
      }
    })
    .catch(error => console.log('error', error));
}

function crearCard(c) {
  let card = document.createElement("div");
  card.classList.add("card");

  let id = document.createElement("p");
  id.innerHTML = "Id: " + c.id;
  let name = document.createElement("h4");
  name.innerHTML = "Nombre: " + c.first_name + " " + c.last_name;
  let email = document.createElement("p");
  email.classList.add("email");
  email.innerHTML = "Correo: " + c.email;
  let img = document.createElement("img");
  img.src = "../img/" + c.image;
  let department = document.createElement("p")
  department.innerHTML = "Dpt: " + c.department;
  let company_id = document.createElement("p");
  company_id.innerHTML = "Compañía: " + empresas.filter(e => e.id == c.company_id)[0].name;
  let button = document.createElement("button");
  button.innerHTML = "Borrar";
  button.onclick = function(){
    card.remove();
  };

  card.append(id, name, email, img, department, company_id, button);
  contacts.append(card);
}

function borrarCard(c){
  c.parentElement.remove();
}