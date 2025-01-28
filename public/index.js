

const socket = io()


document.getElementById('creatingProdForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const createdProd = {
        title: document.getElementById("prodName").value, 
        description: document.getElementById("prodDesc").value,
        code: document.getElementById("prodCode").value,
        status: true,
        stock: document.getElementById("prodStock").value,
        price: document.getElementById("prodPrice").value,
        category: document.getElementById("prodCategory").value
    }
    socket.emit('prodCreatedFromForm', createdProd)
})

socket.on('prodCreated', data=>{
    let prodsList = document.getElementById('productsRlTmList')
    prodsList.innerHTML = ``
    data.forEach(prod => {
        if(prod.status === true){
            prodsList.innerHTML += `
                <li>Nombre del producto: ${prod.title} - Descripción: ${prod.description} - Precio:$${prod.price}</li>
            `
        }
        
    });
})

socket.on('message_all', data=>{
    console.log(data);
})

