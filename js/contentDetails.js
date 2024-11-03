// Parse product ID from URL using URLSearchParams
const params = new URLSearchParams(window.location.search);
const productId = params.get('id');
// console.log("Product ID:", productId);

// Update cart badge from cookie if available
if (document.cookie.includes('counter=')) {
    const counter = document.cookie.split(',').find(item => item.includes('counter')).split('=')[1];
    document.getElementById("badge").innerHTML = counter;
}

// Function to dynamically render the product details
function dynamicContentDetails(ob) {
    const mainContainer = document.createElement('div');
    mainContainer.id = 'containerD';
    document.getElementById('containerProduct').appendChild(mainContainer);

    // Image section for main product image
    const imageSectionDiv = document.createElement('div');
    imageSectionDiv.id = 'imageSection';

    const imgTag = document.createElement('img');
    imgTag.id = 'imgDetails';
    imgTag.src = ob.preview;
    imageSectionDiv.appendChild(imgTag);

    // Product details section
    const productDetailsDiv = document.createElement('div');
    productDetailsDiv.id = 'productDetails';

    const h1 = document.createElement('h1');
    h1.textContent = ob.name;

    const h4 = document.createElement('h4');
    h4.textContent = ob.brand;

    const detailsDiv = document.createElement('div');
    detailsDiv.id = 'details';

    const h3DetailsDiv = document.createElement('h3');
    h3DetailsDiv.textContent = 'Rs ' + ob.price;

    const h3 = document.createElement('h3');
    h3.textContent = 'Description';

    const para = document.createElement('p');
    para.textContent = ob.description;

    const productPreviewDiv = document.createElement('div');
    productPreviewDiv.id = 'productPreview';

    const h3ProductPreviewDiv = document.createElement('h3');
    h3ProductPreviewDiv.textContent = 'Product Preview';
    productPreviewDiv.appendChild(h3ProductPreviewDiv);

    // Product preview images
    ob.photos.forEach(photo => {
        const imgTagProductPreviewDiv = document.createElement('img');
        imgTagProductPreviewDiv.className = 'previewImg';
        imgTagProductPreviewDiv.src = photo;
        imgTagProductPreviewDiv.onclick = function() {
            imgTag.src = this.src; // Update main image when clicked
        };
        productPreviewDiv.appendChild(imgTagProductPreviewDiv);
    });


    function addToCart(productId) {
        // console.log(productId)
        let counter = 1;
        let orderIds = productId;
    
        // console.log(document.cookie)
        if (document.cookie.includes('counter=')) {
            counter = Number(document.cookie.split(',').find(item => item.includes('counter')).split('=')[1]) + 1;
            orderIds = document.cookie.split(',').find(item => item.includes('orderId')).split('=')[1] + " " + productId;
        }
    
        document.cookie = `orderId=${orderIds},counter=${counter}`;
        document.getElementById("badge").innerHTML = counter;
        // console.log("Updated cookie:", document.cookie);
    }


    // Add to Cart button
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'button';

    const buttonTag = document.createElement('button');
    buttonTag.textContent = 'Add to Cart';
    const Buybutton = document.createElement('button');
    Buybutton.textContent = 'Buy Now';
    buttonTag.onclick = function() {
        addToCart(productId);
    };
    buttonDiv.appendChild(buttonTag);
    buttonDiv.appendChild(Buybutton);

    // Append all elements to the main container
    mainContainer.appendChild(imageSectionDiv);
    mainContainer.appendChild(productDetailsDiv);
    productDetailsDiv.appendChild(h1);
    productDetailsDiv.appendChild(h4);
    productDetailsDiv.appendChild(detailsDiv);
    detailsDiv.appendChild(h3DetailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(para);
    productDetailsDiv.appendChild(productPreviewDiv);
    productDetailsDiv.appendChild(buttonDiv);
}


// Backend request to fetch product data
const httpRequest = new XMLHttpRequest();
httpRequest.onreadystatechange = function() {
    if (this.readyState === 4) {
        if (this.status === 200) {
            const contentDetails = JSON.parse(this.responseText);
            dynamicContentDetails(contentDetails); // Call the function to display product details
        } else {
            console.error('Failed to fetch product details. Status:', this.status);
        }
    }
};

// Error handling for network failures
httpRequest.onerror = function() {
    console.error('Network error while fetching product details.');
};

// API request to retrieve product data
httpRequest.open('GET', `https://5d76bf96515d1a0014085cf9.mockapi.io/product/${productId}`, true);
httpRequest.send();
