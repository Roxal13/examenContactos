let tbody = document.querySelector("tbody");
const FORM_CREATE = document.forms.form_create;

//variable de localStorage para las empresas marcadas
let empresas = localStorage.empresas ? JSON.parse(localStorage.empresas) : [];

updateList();

//función actualizar lista
function updateList() {
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  tbody.innerHTML = "<tr><td colspan='5'>Cargando...</td></tr>";

  fetch("api/companies", requestOptions)
    .then(response => response.json())
    .then(datos => {
      tbody.innerHTML = "";
      if(localStorage.sortValue == "capital"){
        datos.sort(function(a,b) { return a.capital - b.capital;});
      }else{
        datos.sort(sortCompany)
      }

      datos.forEach(empresa => {
        showCompany(empresa);
      })
    })
    .catch(error => console.log('error', error));
}

//creación de empresas  
FORM_CREATE.addEventListener('submit', (e) => {
  e.preventDefault();

  let empresa = {
    "name": FORM_CREATE.name.value,
    "industry": FORM_CREATE.industry.value,
    "sector": FORM_CREATE.sector.value,
    "capital": FORM_CREATE.capital.value
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify(empresa)

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("api/companies", requestOptions)
    .then(response => response.json())
    .then(result => showCompany(result))
    .catch(error => console.log('error', error));
})

//función añadir compañía a la lista
function showCompany(c) {
  let newLine = document.createElement('tr')
  //comprobación de marcado
  if (empresas.filter(e => e.id == c.id).length > 0) {
    newLine.classList.add("marcada");
  }

  newLine.innerHTML = `
  <td>${c.id}</td>
  <td>${c.name}</td>
  <td>${c.industry}</td>
  <td>${c.sector}</td>
  <td>${c.capital}</td>
`;

  //ver contactos de la empresa
  var requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };

  let contacts = 0;
  fetch("api/contacts", requestOptions)
    .then(response => response.json())
    .then(contactos => {
      for(let i = 0; i < contactos.length; i++){
        if(contactos[i].company_id == c.id){
          contacts++;
        }
      }
      newLine.innerHTML += `<td>${contacts}</td>`;
    })
    .catch(error => console.log('error', error));

  //addEventListener de marcado
  newLine.addEventListener('click', () => {
    newLine.classList.toggle("marcada");
    if (!empresas.filter(e => e.id == c.id).length > 0) {
      empresas.push(c);
      localStorage["empresas"] = JSON.stringify(empresas);
    } else {
      empresas = empresas.filter(e => e.id !== c.id);
      localStorage["empresas"] = JSON.stringify(empresas);
    }
  })
  tbody.append(newLine);
}

//listener para elegir el valor de ordenar
let headers = document.querySelectorAll("thead th");
headers.forEach(th => {
  th.addEventListener('click', () => {
    localStorage.sortValue = th.getAttribute("name");
    updateList();
  })
})

//function para ordenar
function sortCompany(a, b) {
  if(!localStorage.sortValue){
    localStorage.sortValue = "id";
  }
  if (a[localStorage.sortValue] < b[localStorage.sortValue]) {
    return -1;
  }
  if (a[localStorage.sortValue] > b[localStorage.sortValue]) {
    return 1;
  }
  return 0
}