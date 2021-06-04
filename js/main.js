let items = []
let juguetes = []
let farmacia = []
let carrito = []

fetch("https://apipetshop.herokuapp.com/api/articulos")
    .then(res => res.json())
    .then(json => {
        items = json.response
        separar()
        if (document.title === "Pet Shop | Juguetería") {
            pintar(juguetes)
        } else if (document.title === "Pet Shop | Farmacía") {
            pintar(farmacia)
        }
        addCarrito()
    })
    .catch(error => console.log(error.message))

function separar () {
    items.forEach (item => {
        if (item.tipo === "Juguete") {
            juguetes.push(item)
        } else {
            farmacia.push(item)
        }
    })
}

const padre = document.getElementById("grid")
const tbody = document.querySelector("#tbody")

function pintar (array) {
    array.forEach (item => {
        let producto = document.createElement("div")
        let img = document.createElement("img")
        let info = document.createElement("div")

        producto.classList.add("producto")
        img.classList.add("producto__imagen")
        info.classList.add("producto__informacion")

        img.src = item.imagen
        info.innerHTML = `<p class="producto__nombre">${item.nombre}</p>
        <p class="producto__descripcion descripcion"><span class="underline">Detalles:</span> ${item.descripcion}</p>
        <p class="producto__precio">Precio: $${item.precio}</p>
        <button id = "button" class = "boton boton--primario">Agregar al Carrito</button>`

        if (item.stock <= 5) {
            img.src = item.imagen
            info.innerHTML = `<p class="producto__nombre">${item.nombre}</p>
            <p class="producto__descripcion descripcion"><span class="underline">Detalles:</span> ${item.descripcion}</p>
            <p class="producto__precio">Precio: $${item.precio}</p>
            <button id = "button" class = "boton boton--primario">Agregar al Carrito</button>
            <p class = "unidades">Ultimas Unidades!</p>`
        } else {
            img.src = item.imagen
            info.innerHTML = `<p class="producto__nombre">${item.nombre}</p>
            <p class="producto__descripcion descripcion"><span class="underline">Detalles:</span> ${item.descripcion}</p>
            <p class="producto__precio">Precio: $${item.precio}</p>
            <button id = "button" class = "boton boton--primario">Agregar al Carrito</button>`
        }

        padre.appendChild(producto)
        producto.appendChild(img)
        producto.appendChild(info)
    })
}

function addCarrito () {
    // Click en boton "Agregar al carrito"
    const button = document.querySelectorAll("#button")
    button.forEach (btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target
            // Que sea al boton mas cercano
            const item = button.closest(".producto")
            // console.log(item)
            const itemTitle = item.querySelector(".producto__nombre").textContent
            // console.log(itemTitle)
            const itemPrice = item.querySelector(".producto__precio").textContent
            // console.log(itemPrice)
            const itemImg = item.querySelector(".producto__imagen").src
            // console.log(itemImg)
            // Creo objeto para pushear al carrito
            const newCarrito = {
                title: itemTitle,
                precio: itemPrice,
                img: itemImg,
                cantidad: 1,
                id : 1
            }
            addItem(newCarrito)
        })
    })
}

function addItem (item) {

    // Mensaje de se añadio item al carrito
    const alert = document.querySelector(".alert")

    setTimeout( function() {
        alert.classList.add("hide")
    }, 2000)
    alert.classList.remove("hide") 

    const input = tbody.getElementsByClassName("input__element")

    // Si se repeite un item se suma la cantidad, no se duplica
    for (let i = 0; i < carrito.length; i++) {
        // trim() para eliminar los espacios en blanco
        if (carrito[i].title.trim() === item.title.trim()) {
            carrito[i].cantidad++
            const valueInput = input[i]
            valueInput.value++
            return null
        }
    }
    // Les doy un id distinto para despues poder identificarlos
    carrito.push(item)
    renderCarrito()
}

function renderCarrito () {
    // Imprimir en carrito al tocar el boton
    tbody.innerHTML = ""

    carrito.map(item => {
        const tr = document.createElement("tr")

        tr.classList.add("itemCarrito")

        const content = 
        // <th scope = "row">${item.id}</th>
        `<td class = "table__productos">
            <img src = ${item.img} alt = "">
            <h6 class = "title">${item.title}</h6>
        </td>
        <td class = "table__price">${item.precio}</td>
        <td class = "table__cantidad">
            <input type = "number" min = "1" value = ${item.cantidad} class = "input__element">
            <button class = "delete btn btn-danger">x</button>
        </td>`

        tr.innerHTML = content
        tbody.appendChild(tr)

        // Eliminar del carrito al tocar el boton delete
        tr.querySelector(".delete").addEventListener('click', deleteItem)
    })
    addLocalStorage()
}

function deleteItem(e) {
    const deleteCart = e.target
    const x = deleteCart.closest(".itemCarrito")
    const title = x.querySelector(".title").textContent
    // Cambio el contenido del array
    for(let i=0; i < carrito.length; i++) {
        if (carrito[i].title.trim() === title) {
            carrito.splice(i, 1)
        }
    }
    x.remove()
    // localStorage.removeItem('carrito', JSON.stringify(carrito))

    // Alerta de producto removido!
    const alert = document.querySelector(".remove")
    setTimeout( function() {
        alert.classList.add("remove")
    }, 2000)
    alert.classList.remove("remove") 
}

function addLocalStorage () {
    localStorage.setItem('carrito', JSON.stringify(carrito)) // Guardamos siempre un string
}

// Cada vez que se refresque la pagina
window.onload = function() {
    // Busca si existe carrito
    const storage = JSON.parse(localStorage.getItem('carrito'))
    if (storage) {
        // Guardo en carrito lo que haya en storage
        carrito = storage
        renderCarrito()
    }
}


// Mensaje de contacto
let contacto = document.querySelector("#liveToastBtn")
contacto.addEventListener('click', () => {
    alert("Mensaje Enviado!")
})