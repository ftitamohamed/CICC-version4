document.getElementById("home-logo").addEventListener("click", function (event) {
    if (event.target === event.currentTarget) {
        window.location.href = "index.html";
    }
});

const code = localStorage.getItem('TrackerCode');
const apiUrl = `https://custmize.digitalgo.net/api/track_order?code=${code}`;

const ordersSection = document.querySelector('.orders');
let status;
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const groupedOrders = groupOrders(data.data.order_detiles,data.data);
            
            populateOrders(groupedOrders);
        } else {
            displayNoOrdersMessage();
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        displayNoOrdersMessage();
    });

function displayNoOrdersMessage() {
    if (!ordersSection.querySelector('.empty')) {
        const noOrdersMessage = document.createElement('p');
        noOrdersMessage.classList.add('empty');
        noOrdersMessage.textContent = 'لا توجد طلبات حتى الآن';
        ordersSection.appendChild(noOrdersMessage);
    }
}

function groupOrders(orderDetails,data) {
    const groupedOrders = [];
    
    orderDetails.forEach(item => {
        // Check if order_status_info exists before using it
        const orderStatus = data.order_status || 'Unknown Status';

        // Check if the order already exists in groupedOrders
        const existingOrder = groupedOrders.find(order => order.id === item.id);

        if (existingOrder) {
            // Add item to the existing order
            existingOrder.items.push(item);
        } else {
            // Create a new order entry
            groupedOrders.push({
                id: item.id,
                status: orderStatus,
                totalAmount: item.full_price,
                items: [item]
            });
        }
    });

    return groupedOrders;
}

function populateOrders(groupedOrders) {
    if (!groupedOrders || groupedOrders.length === 0) {
        displayNoOrdersMessage();
        return;
    }

    groupedOrders.forEach(order => {
        const orderElement = createOrderCard(order);
        ordersSection.appendChild(orderElement);
    });
}

function createOrderCard(order) {
    const orderContainer = document.createElement('div');
    orderContainer.classList.add('order-card');

    // Order Header
    const orderHeader = document.createElement('div');
    orderHeader.classList.add('order-header');

    const orderNumber = document.createElement('span');
    orderNumber.classList.add('order-number');
    orderNumber.textContent = `#${order.id}`;

    const orderStatus = document.createElement('span');
    orderStatus.classList.add('order-status');
    orderStatus.textContent = order.status;

    orderHeader.appendChild(orderNumber);
    orderHeader.appendChild(orderStatus);

    // Total Price
    const orderInfo = document.createElement('div');
    orderInfo.classList.add('order-info');

    const totalPrice = document.createElement('span');
    totalPrice.classList.add('total-price');
    totalPrice.textContent = `SAR ${order.totalAmount || '0.00'}`;

    orderInfo.appendChild(totalPrice);

    orderContainer.appendChild(orderHeader);
    orderContainer.appendChild(orderInfo);

    // Ordered Items (Individual Containers)
    order.items.forEach(item => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('order-item');

        const itemImage = document.createElement('img');
        itemImage.src = item.front_image;
        itemImage.classList.add("item-image");

        const itemName = document.createElement('span');
        itemName.textContent = item.product.title;
        itemName.classList.add("item-name");

        const itemQuantity = document.createElement('span');
        itemQuantity.textContent = `Quantity: ${item.quantity}`;
        itemQuantity.classList.add("item-quantity");

        itemContainer.appendChild(itemImage);
        itemContainer.appendChild(itemName);
        itemContainer.appendChild(itemQuantity);
        orderContainer.appendChild(itemContainer);
    });

    return orderContainer;
}
