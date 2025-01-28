const socket = io()
let currentCartID = null; 


const formCartID = document.getElementById('formCartID');
formCartID.addEventListener('submit', (event) => {
    event.preventDefault(); 
    currentCartID = document.getElementById('cartID').value; 
    socket.emit('getCartID', currentCartID);
    console.log('Cart ID actualizado:', currentCartID);
})


document.querySelectorAll('.btnAddCart').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault(); 
        const productID = button.id; 
        fetch(`/api/carts/${currentCartID}/products/${productID}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartID: currentCartID }) 
        })
        .then(response => {
            if (response.ok) {
                console.log('Producto agregado al carrito');
            } else {
                console.error('Error al agregar el producto al carrito');
            }
        });
    });
});