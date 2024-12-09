const slider = document.getElementById("imageSlider");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;
let counter = 0;
console.log(slider.children.length)
const updateSliderPosition = () => {
    slider.style.transform = `translateX(-${currentIndex * 300}px)`;
};

prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
        currentIndex--;
        counter -= 6;
        updateSliderPosition();
    }
});

nextBtn.addEventListener("click", () => {
    if (counter < slider.children.length - 1) {
        currentIndex++;
        counter += 6;
        updateSliderPosition();
    }
});

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

let keyList  = document.querySelectorAll('.toggelers p');
keyList.forEach((key)=>{
    
    key.addEventListener("click",function(){
        for(let i=0; i<keyList.length;i++){
            keyList[i].classList.remove("toggelers-active");
            
        };
        key.classList.toggle("toggelers-active");
        
    }); 
    
}); 




function formatText(command, value = null) {
    document.execCommand(command, false, value);
  }


 
  document.getElementById("home-logo").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
        window.location.href = "index.html"; // Replace with your desired URL
    }
  });


  let priceCounter = 0; // Total price
  let tracker; // Price tracker element
  let countNumber; // Current count of items
  let count; // Element to display the count
  let logoPrices = new Map(); // Map to store prices for each logo object
  let mainPrice = 0; // Base price of the product
  let minimum = 0; // Minimum sale value
  
  document.addEventListener('DOMContentLoaded', () => {
      fetch('http://custmize.digitalgo.net/api/get_single_product/DIHAW14054')
          .then(response => response.json())
          .then(data => {
              if (data.success) {
                  mainPrice = parseFloat(data.data.main_price);
                  minimum = parseInt(data.data.min_sale, 10);
  
                  document.querySelector('.piecePrice').textContent = `${mainPrice}$`;
  
                  countNumber = minimum;
                  priceCounter = mainPrice * minimum;
                  tracker = document.querySelector('#draggableDiv div span.totalPrice');
                  count = document.querySelector('.count');
  
                  if (tracker) tracker.innerText = `${priceCounter.toFixed(2)}$`;
                  if (count) count.textContent = countNumber;
  
                  setupCounterControls();
              } else {
                  console.error("Product data not found or invalid:", data);
              }
          })
          .catch(error => {
              console.error("Error fetching product data:", error);
          });
  
      setupCanvas(); // Initialize canvas and related functionality
  });
  
  function updatePriceDisplay() {
      // Sum up logo prices
      const totalLogoPrice = Array.from(logoPrices.values()).reduce((acc, price) => acc + price, 0);
      priceCounter = mainPrice * countNumber + totalLogoPrice;
      if (tracker) tracker.innerText = `${priceCounter.toFixed(2)}$`;
  }
  
  function setupCounterControls() {
      const plus = document.querySelector('.fa-plus');
      const minus = document.querySelector('.fa-minus');
  
      if (plus) {
          plus.addEventListener('click', () => {
              countNumber += 1;
              if (count) count.textContent = countNumber;
              updatePriceDisplay();
          });
      }
  
      if (minus) {
          minus.addEventListener('click', () => {
              if (countNumber > minimum) {
                  countNumber -= 1;
                  if (count) count.textContent = countNumber;
                  updatePriceDisplay();
              }
          });
      }
  }
  const uploadedElements = [];
  function saveLogosToStorage() {
    const logos = uploadedElements.map((element) => {
        if (element.type === 'image') {
            return {
                type: element.type,
                id: element.id,
                url: element.url,
                properties: element.properties,
            };
        } else if (element.type === 'text') {
            return {
                type: element.type,
                id: element.id,
                content: element.content,
                properties: element.properties,
            };
        }
    });

    // Save logos array to localStorage or any other storage
    localStorage.setItem('logos', JSON.stringify(logos));
    console.log("Logos saved to localStorage:", logos);
}
  function setupCanvas() {
      const canvasElement = document.getElementById("canvas");
      const imageInput = document.getElementById("imageInput");
      const textInput = document.getElementById("textInput");
      const addTextButton = document.getElementById("addTextButton");
      const deleteButton = document.getElementById("deleteButton");
      const canvas = new fabric.Canvas(canvasElement);
  
      fetch('https://custmize.digitalgo.net/api/size_calculate')
          .then(response => response.json())
          .then(data => {
              if (!data.success) throw new Error('Failed to fetch logo pricing data');
  
              canvas.on('object:scaling', (e) => {
                  const activeObject = e.target;
                  if (activeObject) {
                      const width = activeObject.width * activeObject.scaleX;
                      const height = activeObject.height * activeObject.scaleY;
                      const area = width * height;
  
                      const percentage = parseFloat(data.data.persantige);
                      console.log(percentage,area);
                      const factor = parseFloat(data.data.factor);
                      let result = area * percentage;
                      const less = parseFloat(data.data.if_output_is_less_factor);
                      const equals = parseFloat(data.data.if_output_is_equal_factor);
                      const bigger = parseFloat(data.data.if_output_is_greater_factor);

                    console.log(result,factor)
                      let objectPrice;
                      if (result < factor) {
                          objectPrice = less;
                      } else if (result === factor) {
                          objectPrice = equals;
                      } else {
                          objectPrice = bigger;
                      }
  
                      // Update the price for this specific object
                      logoPrices.set(activeObject.id, objectPrice);
                      updatePriceDisplay();
                      console.log(objectPrice);
                  }
              });
          })
          .catch(error => {
              console.error("Error fetching logo pricing data:", error);
          });
          
      imageInput.addEventListener("change", (e) => {
          const imgObj = e.target.files[0];
          if (imgObj) {
              const reader = new FileReader();
              reader.onload = (e) => {
                  const imageUrl = e.target.result;
                  const imageElement = document.createElement("img");
                  imageElement.src = imageUrl;
  
                  imageElement.onload = function () {
                      const image = new fabric.Image(imageElement);
                      image.set({
                          left: 0,
                          top: 0,
                          scaleY: 0.1,
                          scaleX: 0.1,
                      });
  
                      // Assign a unique ID for tracking prices
                      image.id = `img_${Date.now()}`;
                      logoPrices.set(image.id, 0); // Initialize with no price
                      canvas.add(image);
                      canvas.centerObject(image);
                      canvas.setActiveObject(image);
                      uploadedElements.push({
                        type: 'image',
                        id: image.id,
                        url: imageUrl, // Save image URL for later use
                        properties: {
                            left: image.left,
                            top: image.top,
                            scaleY: image.scaleY,
                            scaleX: image.scaleX,
                        }
                    });
                  };
              };
  
              reader.readAsDataURL(imgObj);
          }
      });
  
      addTextButton.addEventListener('click', () => {
          const editor = document.querySelector('.editor');
          const styledHTML = editor.innerHTML.trim();
          if (styledHTML) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = styledHTML;
              let topPosition = 50;
  
              Array.from(tempDiv.childNodes).forEach((node) => {
                  const textObject = new fabric.Text(node.textContent, {
                      left: 50,
                      top: topPosition,
                      fontSize: 16,
                      fill: 'black',
                      fontFamily: 'Arial',
                  });
                  textObject.id = `text_${Date.now()}`; // Assign a unique ID
                  logoPrices.set(textObject.id, 0); // Initialize price for the text object
                  canvas.add(textObject);
                  uploadedElements.push({
                    type: 'text',
                    id: textObject.id,
                    content: node.textContent, // Save text content
                    properties: {
                        left: textObject.left,
                        top: textObject.top,
                        fontSize: textObject.fontSize,
                        fill: textObject.fill,
                        fontFamily: textObject.fontFamily,
                    }
                });
                  topPosition += 30;
              });
  
              updatePriceDisplay();
          } else {
              alert('Please enter some text in the editor.');
          }
      });
  
      

      deleteButton.addEventListener("click", () => {
          const activeObject = canvas.getActiveObject();
          if (activeObject) {
              canvas.remove(activeObject);
              // Remove the associated price
              logoPrices.delete(activeObject.id);
              updatePriceDisplay();
          } else {
              alert("No item selected to delete!");
          }
      });
  }
  
  
 

function saveToLocalStorage() {
    const node = document.getElementById('tshirt-div'); // Div containing both the image and the canvas

    domtoimage.toPng(node).then(function (dataUrl) {
        // Retrieve existing images from local storage if available
        let tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || [];
        let prices =  JSON.parse(localStorage.getItem('fruits')) || [];
        
        // Add the new image to the array
        tshirtImages.push(dataUrl);
        prices.push(priceCounter);
        /* console.log(prices); */
        const selectedSize = JSON.parse(localStorage.getItem('selectedSize')) || {};
        const selectedColor = JSON.parse(localStorage.getItem('selectedColor')) || {};
        const ProductInfo = JSON.parse(localStorage.getItem('ProductInfo')) || {};
        localStorage.setItem('fruits', JSON.stringify(prices));
        // Save the updated array back to local storage
        localStorage.setItem('tshirtImages', JSON.stringify(tshirtImages));
        tshirtImages = JSON.parse(localStorage.getItem('tshirtImages')) || [];
        let priceForColorSize = priceCounter - (mainPrice * countNumber);
        console.log(priceForColorSize);
        localStorage.setItem('full_price', JSON.stringify(priceCounter));
        localStorage.setItem('initial_Price', JSON.stringify(mainPrice));
        localStorage.setItem('quantity', JSON.stringify(countNumber));
        localStorage.setItem('Price_for_color_size', JSON.stringify(priceForColorSize));
        const newOrder = {
            product_id: ProductInfo.Product_id, // Placeholder, replace with your product ID logic
            product_name: ProductInfo.name, // Placeholder, replace with your product name logic
            color_id: selectedColor.id || null,
            size_id: selectedSize.id || null,
            quantity: countNumber,
            price_without_size_color_price: mainPrice,
            price_for_size_color_price: priceForColorSize,
            full_price: priceCounter,
            front_image: tshirtImages[0] || "",
            back_image:  "",
            logos: ""
        };
        const newOrder1 = {
            product_id: ProductInfo.Product_id, // Placeholder, replace with your product ID logic
            product_name: ProductInfo.name, // Placeholder, replace with your product name logic
            color: selectedColor.color_code  || null,
            size_id: selectedSize.name || null,
            quantity: countNumber,
            price_without_size_color_price: mainPrice,
            price_for_size_color_price: priceForColorSize,
            full_price: priceCounter,
            front_image: tshirtImages[0] || "",
            back_image:  "",
            logos: ""
        };
        let existingCart = JSON.parse(localStorage.getItem('cartData')) || { cart: { orders: [] } };
        let existingCart1 = JSON.parse(localStorage.getItem('cartData1')) || { cart: { orders: [] } };

        // Add the new order to the cart
        existingCart.cart.orders.push(newOrder);

        // Save the updated cart back to localStorage
        localStorage.setItem('cartData', JSON.stringify(existingCart));
        existingCart1.cart.orders.push(newOrder1);

        // Save the updated cart back to localStorage
        localStorage.setItem('cartData1', JSON.stringify(existingCart1));

        alert('تم حفظ طلبك تحقق من سلة التسوق');
        
        tshirtImages =  [];
        localStorage.setItem('tshirtImages', JSON.stringify(tshirtImages));
        saveLogosToStorage() 
        function logCartData() {
            const cartData = localStorage.getItem('cartData'); // Retrieve cart data from localStorage
        
            if (cartData) {
                const parsedCart = JSON.parse(cartData); // Parse the JSON string into an object
                console.log("Cart Data:", parsedCart); // Log the entire cart object
        
                // Optionally, log specific details for better readability
                if (parsedCart.cart && parsedCart.cart.orders) {
                    console.log("Orders in Cart:");
                    parsedCart.cart.orders.forEach((order, index) => {
                        console.log(`Order ${index + 1}:`, order);
                    });
                } else {
                    console.warn("Cart data is missing expected structure.");
                }
            } else {
                console.warn("No cart data found in localStorage.");
            }
        }
        
        // Call the function to log the cart data
        logCartData();
        
        updateCartCount();
    }).catch(function (error) {
        console.error('oops, something went wrong!', error);
    });
}


// Get the button and the file input
const triggerButton = document.getElementById('triggerButton');
const imageInput = document.getElementById('imageInput');

// Add click event listener to the button
triggerButton.addEventListener('click', () => {
    imageInput.click(); // Trigger the file input
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

window.onload = function() {
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
}


const imageSlider1 = document.querySelectorAll('.image-slider img'); // Get all images inside the imageSlider
            console.log(imageSlider1);
            imageSlider1.forEach((img) => {
                img.addEventListener('click', () => {
                    const imageUrl = img.src; // Get the source of the clicked image
                    document.getElementById('image').src = imageUrl; 
                    console.log(imageUrl);// Change the main product image to the clicked image
                });
            });

function downloadImage() {
                const node = document.getElementById('tshirt-div'); // Div containing both the image and the canvas
                
                // Use dom-to-image to capture the div as a PNG image
                domtoimage.toPng(node).then(function (dataUrl) {
                   
                    // Create an image element to display the generated PNG
                    const img = new Image();
                    img.src = dataUrl;
                    /* document.body.appendChild(img); */ // This will display the PNG on the page
            
                    // Trigger the download of the PNG file
                    const link = document.createElement('a');
                    link.href = dataUrl;
                    link.download = 'custom-tshirt.png'; // Name for the downloaded image
                    link.click();
                }).catch(function (error) {
                    console.error('oops, something went wrong!', error);
                });
            };

// Get all the <li> elements inside the <ul class="Sizes">


   /*          let priceCounter = 0; // Total price
            let tracker; // Price tracker element
            let countNumber; // Current count of items
            let count; // Element to display the count
            let logoPrices = new Map(); // Map to store prices for each logo object
            let mainPrice = 0; // Base price of the product
            let minimum = 0; // Minimum sale value
            
            document.addEventListener('DOMContentLoaded', () => {
                fetch('http://custmize.digitalgo.net/api/get_single_product/DIHAW14054')
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            mainPrice = parseFloat(data.data.main_price);
                            minimum = parseInt(data.data.min_sale, 10);
            
                            document.querySelector('.piecePrice').textContent = `${mainPrice}$`;
            
                            countNumber = minimum;
                            priceCounter = mainPrice * minimum;
                            tracker = document.querySelector('#draggableDiv div span.totalPrice');
                            count = document.querySelector('.count');
            
                            if (tracker) tracker.innerText = `${priceCounter.toFixed(2)}$`;
                            if (count) count.textContent = countNumber;
            
                            setupCounterControls();
                        } else {
                            console.error("Product data not found or invalid:", data);
                        }
                    })
                    .catch(error => {
                        console.error("Error fetching product data:", error);
                    });
            
                setupCanvas(); // Initialize canvas and related functionality
            });
            
            function updatePriceDisplay() {
                // Sum up logo prices
                const totalLogoPrice = Array.from(logoPrices.values()).reduce((acc, price) => acc + price, 0);
                priceCounter = mainPrice * countNumber + totalLogoPrice;
                if (tracker) tracker.innerText = `${priceCounter.toFixed(2)}$`;
            }
            
            function setupCounterControls() {
                const plus = document.querySelector('.fa-plus');
                const minus = document.querySelector('.fa-minus');
            
                if (plus) {
                    plus.addEventListener('click', () => {
                        countNumber += 1;
                        if (count) count.textContent = countNumber;
                        updatePriceDisplay();
                    });
                }
            
                if (minus) {
                    minus.addEventListener('click', () => {
                        if (countNumber > minimum) {
                            countNumber -= 1;
                            if (count) count.textContent = countNumber;
                            updatePriceDisplay();
                        }
                    });
                }
            }
            
            function setupCanvas() {
                const canvasElement = document.getElementById("canvas");
                const imageInput = document.getElementById("imageInput");
                const textInput = document.getElementById("textInput");
                const addTextButton = document.getElementById("addTextButton");
                const deleteButton = document.getElementById("deleteButton");
                const canvas = new fabric.Canvas(canvasElement);
            
                fetch('https://custmize.digitalgo.net/api/size_calculate')
                    .then(response => response.json())
                    .then(data => {
                        if (!data.success) throw new Error('Failed to fetch logo pricing data');
            
                        canvas.on('object:scaling', (e) => {
                            const activeObject = e.target;
                            if (activeObject) {
                                const width = activeObject.width * activeObject.scaleX;
                                const height = activeObject.height * activeObject.scaleY;
                                const area = width * height;
            
                                const percentage = parseFloat(data.persantige);
                                const factor = parseFloat(data.factor);
                                let result = area * percentage;
            
                                let objectPrice;
                                if (result < factor) {
                                    objectPrice = 0.5;
                                } else if (result === factor) {
                                    objectPrice = 1.0;
                                } else {
                                    objectPrice = 1.5;
                                }
            
                                // Update the price for this specific object
                                logoPrices.set(activeObject.id, objectPrice);
                                updatePriceDisplay();
                            }
                        });
                    })
                    .catch(error => {
                        console.error("Error fetching logo pricing data:", error);
                    });
            
                imageInput.addEventListener("change", (e) => {
                    const imgObj = e.target.files[0];
                    if (imgObj) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const imageUrl = e.target.result;
                            const imageElement = document.createElement("img");
                            imageElement.src = imageUrl;
            
                            imageElement.onload = function () {
                                const image = new fabric.Image(imageElement);
                                image.set({
                                    left: 0,
                                    top: 0,
                                    scaleY: 0.1,
                                    scaleX: 0.1,
                                });
            
                                // Assign a unique ID for tracking prices
                                image.id = Date.now();
                                logoPrices.set(image.id, 0); // Initialize with no price
                                canvas.add(image);
                                canvas.centerObject(image);
                                canvas.setActiveObject(image);
                            };
                        };
            
                        reader.readAsDataURL(imgObj);
                    }
                });
            
                addTextButton.addEventListener('click', () => {
                    const editor = document.querySelector('.editor');
                    const styledHTML = editor.innerHTML.trim();
                    if (styledHTML) {
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = styledHTML;
                        let topPosition = 50;
            
                        Array.from(tempDiv.childNodes).forEach((node) => {
                            const textObject = new fabric.Text(node.textContent, {
                                left: 50,
                                top: topPosition,
                                fontSize: 16,
                                fill: 'black',
                                fontFamily: 'Arial',
                            });
                            canvas.add(textObject);
                            topPosition += 30;
                        });
            
                        updatePriceDisplay();
                    } else {
                        alert('Please enter some text in the editor.');
                    }
                });
            
                deleteButton.addEventListener("click", () => {
                    const activeObject = canvas.getActiveObject();
                    if (activeObject) {
                        canvas.remove(activeObject);
                        // Remove the associated price
                        logoPrices.delete(activeObject.id);
                        updatePriceDisplay();
                    } else {
                        alert("No item selected to delete!");
                    }
                });
            }
             */