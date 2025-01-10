const socket = io()

socket.on('prodCreated', data=>{
    let prodsList = document.getElementById('productsRlTmList')
    prodsList.innerHTML = ``
    data.forEach(prod => {
        if(prod.status === true){
            prodsList.innerHTML += `
                <li>Nombre del producto: ${prod.title}. Descripción: ${prod.description}. Precio:$${prod.price}</li>
            `
        }
        
    });
})

socket.on('message_all', data=>{
    console.log(data);
})

