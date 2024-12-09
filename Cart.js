document.addEventListener('DOMContentLoaded', () => {
    const subtotalElement = document.querySelector('body > main > aside > div:nth-child(5) > span');
    
    const totalPriceElement = document.querySelector('body > main > aside > div:nth-child(9) > span');
    const payNowButton = document.querySelector('.pay-now');
    const items = document.querySelectorAll('.shopping-items .item input[type="checkbox"]');
    
    const shippingCost = 15.00; // Constant shipping cost
    const taxRate = 9.6; // Constant tax amount
    
    const cartData = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };
    const orders = cartData.cart.orders || [];
    function updateOrderSummary() {
        let subtotal = 0;
        
        // Calculate the subtotal based on selected items
        items.forEach((item) => {
            if (item.checked) {
                const priceElement = item.closest('.item').querySelector(' span.price');
                const price = parseFloat(priceElement.textContent.replace('$', ''));
                subtotal += price;
               
            }
        });
        
        
        
        
        // Update subtotal, tax, and total price
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        const total = subtotal + shippingCost + taxRate;
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
        
        // Update Pay Now button text
        payNowButton.textContent = `Pay now ($${total.toFixed(2)})`;
        items.forEach((item,index) => {
            if (item.checked,index) {
                
                
                console.log(index);
                console.log(total,subtotal);
                console.log(orders[index]);
            }
        });
    }
    
    // Add event listeners to item checkboxes
    items.forEach((item) => {
        item.addEventListener('change', updateOrderSummary);
    });

    // Initial update
    updateOrderSummary();
});

// Functions to handle showing/hiding additional data
function showData() {
    const otpFrame = document.querySelector('.otp');
    otpFrame.style.display = 'block';
}

function hideData() {
    const otpFrame = document.querySelector('.otp');
    otpFrame.style.display = 'none';
}


const draggableDiv = document.getElementById("draggableDiv");
console.log(draggableDiv)
// Variables to store the current position and the offset
let isDragging = false;
let offsetX, offsetY;

// Mouse down: Initialize dragging
draggableDiv.addEventListener("mousedown", (event) => {
    isDragging = true;

    // Calculate the offset from the mouse position to the top-left corner of the div
    offsetX = event.clientX - draggableDiv.offsetLeft;
    offsetY = event.clientY - draggableDiv.offsetTop;

    // Add event listeners for mousemove and mouseup
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

// Function to handle the dragging
function onMouseMove(event) {
    if (!isDragging) return;

    // Calculate the new position
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;

    // Update the position of the div
    draggableDiv.style.left = `${x}px`;
    draggableDiv.style.top = `${y}px`;
}

// Mouse up: Stop dragging
function onMouseUp() {
    isDragging = false;

    // Remove event listeners
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}
function hideData(){
    document.querySelector(`.exit`).style='display:none';
    document.querySelector(`.otp`).style='display:none';}
function showData(){
    document.querySelector(`.exit`).style='display:block';
    document.querySelector(`.otp`).style='display:block';}
document.getElementById("home-logo").addEventListener("click", function (event) {
        if (event.target === event.currentTarget) {
            window.location.href = "index.html"; // Replace with your desired URL
        }
      });
      window.addEventListener('DOMContentLoaded', (event) => {
        const loginLink = document.getElementById('loginLink');
        
        const userName = localStorage.getItem('userName');
        
        if (userName) {
            // If userName exists in localStorage, update the link to show the user's name
            loginLink.innerHTML = `<i class="fa-solid fa-user"></i> مرحبًا, ${userName}`;
            loginLink.setAttribute('href', 'Profile.html'); // Prevent navigation to login page
            
      
        }
      });

  /*     logoButton.addEventListener("click", () => {
        window.location.href = "index.html"; // Replace with your desired URL
    }); */
   /*  window.onload = function() {
        updateCartCount();
    };
    
    function updateCartCount() {
        // Retrieve the cartData1 object from localStorage
        const cartData1 = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };
        const orders = cartData1.cart.orders || [];
    
        // Get the cart count element
        const cartCount = document.getElementById('cart-count');
    
        // Check if orders array has any items
        if (orders.length > 0) {
            // Show the red dot with the number of items
            cartCount.style.display = 'block';
            cartCount.textContent = orders.length;
        } else {
            // Hide the red dot if no items
            cartCount.style.display = 'none';
        }
    } */
    