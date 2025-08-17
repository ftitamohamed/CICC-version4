let slugs = [];
let images = [];
let titles = [];
let Prices = [];

let productsFetshingSlug = localStorage.getItem('productsFetshingSlug');
console.log('your data is selected slug is  : ', productsFetshingSlug);
fetchslugs();
async function createPanel() {
    console.log('the slugs are: ', slugs);
    console.log('the titles are: ', titles);
    console.log('your data is: ', images);
    console.log('your data is prices : ', Prices);
  
    let container = document.querySelector('main');
    container.innerHTML = '';
    console.log(container);
  
    slugs.forEach((slug, index) => {
      let price = parseFloat(parseFloat(Prices[index]) + 50)
      let panel = document.createElement('div');
      panel.className = 'card';
      panel.id = `panel-${index}`;
      
      let img = document.createElement('img');
      img.src = images[index];
      panel.appendChild(img);
      /* panel.style.backgroundImage = `url('${images[index]}')`; */
  
      // Create title <h3> with data-full
      let title = document.createElement('h3');
      
      title.innerText = titles[index];
      panel.appendChild(title);
      let span = document.createElement('span');
      span.className = 'price';
      span.innerText =  `Price:  ${Prices[index]} SAR`;
      panel.appendChild(span);
     /*  let span1 = document.createElement('span');
      span1.className = 'price';
      span1.innerText =  `${price} SAR ${Prices[index]} SAR`;
      panel.appendChild(span1); */
      let button = document.createElement('button');
      button.innerText = "customize now";
      panel.appendChild(button);
      
      // Add click to panel
      panel.addEventListener('click', async () => {
        localStorage.setItem('selectedSlug', slug);
        localStorage.setItem('wearHouseImage',images[index]);
        localStorage.setItem('wearHouseTitle',titles[index]);
        await setGuidnessImages(`https://custmize.digitalgo.net/api/single-external-product/${slug}`,slug)
        // Add slug to URL so backend dev can share it
        
        /* window.location.href = 'wearHouseCustomize.html'; */
      });
     
    
      container.appendChild(panel);
    });

    document.getElementById("home-logo").addEventListener("click", function (event) {
        if (event.target === event.currentTarget) {
            window.location.href = "index.html"; // Replace with your desired URL
        }
      });
  

  
    console.log('panel created successfully');
  }
async function fetchslugs() {
  const response = await fetch(`${productsFetshingSlug}`, {
    method: 'GET', // or 'POST' if needed
    headers: {
      'Accept-Language': 'en'
    }
  });
    const data = await response.json();
    console.log('wearhouse data is ', data);
    
    if (data.success) {
      let products = data.data;
      console.log('products are ', products);
      products.forEach(product => {
        slugs.push(product.id);
        images.push(product.image);
        titles.push(product.title);
        Prices.push(product.price);
      });
      }
  
      /* await fetchFrontImages(); */
      await createPanel();
     
  }

  async function setGuidnessImages(apiUrl,slug){

    fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          if (data.success) {
              console.log('this is the guidness pictures:', data.data.Guiding_pictures);
              const guidness_pictures = data.data.Guiding_pictures;
              localStorage.setItem('guidness_pictures', JSON.stringify(guidness_pictures));
              window.location.href = 'wearHouseCustomize.html';
              window.location.href = `wearHouseCustomize.html?id=${encodeURIComponent(slug)}`;
              
          } else {
              console.error("Error while fetching data");
          }
      })
      .catch(error => {
          console.error("Error fetching data from API:", error);
      });
  }