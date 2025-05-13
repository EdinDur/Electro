let data = [];
let user = Utils.get_from_localstorage("user");
let username = user ? user.username : null;

//Cart Dropdown
RestClient.get("beckend/cart", { username: username }, function(data) {
    if (!data || !data.data) {
        console.error('Invalid cart data');
        return;
    }
    populateCartDropdown(data);
}, function(jqXHR) {
    console.error("Error fetching cart data:", jqXHR);
});

function populateCartDropdown(response) {
    if (!response || !response.data || !Array.isArray(response.data)) {
        console.error('Invalid response data');
        return;
    }

    var responseData = response.data;
    var cartList = $('#cartList');
    var totalItems = $('#totalItems');
    var totalQuantity = $('#totalQuantity');
    var subtotal = $('#subtotal');

    var totalPrice = 0;
    var itemCount = 0;
    var itemsSummary = {};

    responseData.forEach(function(product) {
        var productName = product.productName;
        // Convert price to number
        var price = parseFloat(product.price) || 0;
        
        if (!itemsSummary[productName]) {
            itemsSummary[productName] = {
                count: 0,
                totalPrice: 0,
                productImage: product.mImage,
            };
        }
        itemsSummary[productName].count++;
        itemsSummary[productName].totalPrice += price;
        totalPrice += price;
        itemCount++;
    });

    cartList.empty();

    Object.keys(itemsSummary).forEach(function(productName) {
        var product = itemsSummary[productName];
        var pricePerProduct = product.totalPrice / product.count;
        var productItem = $('<div class="product-widget">');
        productItem.html(`
            <div class="product-img">
                <img src="${product.productImage}" alt="${productName}">
            </div>
            <div class="product-body">
                <h3 class="product-name"><a href="#product">${productName}</a></h3>
                <h4 class="product-price"><span class="qty">${product.count}x</span>$${pricePerProduct.toFixed(2)}</h4>
            </div>
        `);
        cartList.append(productItem);
    });

    totalItems.text(itemCount);
    totalQuantity.text(itemCount > 0 ? itemCount + " Item(s) selected" : "No items selected");
    // Ensure totalPrice is a number before using toFixed
    subtotal.text("SUBTOTAL: $" + (totalPrice || 0).toFixed(2));
}

//Loading store.js
const storeScript = document.createElement('script');
storeScript.src = './js/store.js';
document.body.appendChild(storeScript);

//Loading display_products.js
const productScript = document.createElement('script');
productScript.src = './js/product.js';
document.body.appendChild(productScript);

//Switching pages
function navigateToCategory(categoryName) {
 
    if (categoryName === "home") {
        window.location.href = "#home";
    } else if (categoryName === "allProducts") {
        window.location.href = "#store";
    } else {
        window.location.href = "#store";
    }

    setTimeout(function() {
        if (categoryName === "allProducts") {
            fetchProducts();
        } else {
            fetchCategoryProducts(categoryName);
        }
    }, 50);
}

//Navigation Handling
document.querySelectorAll('.main-nav li').forEach(item => {
    item.addEventListener('click', function(event) {
        event.preventDefault();
        const categoryName = this.getAttribute('name');
        if (categoryName) {
            navigateToCategory(categoryName);           
            document.querySelectorAll('.main-nav li').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Get the search button input
const searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    const inputValue = document.querySelector('.header-search input').value;
    window.location.href = "#store";
    setTimeout(function() {
        SearchFunction(inputValue);
    }, 50);
});

//Quick View Button
$(document).on("click", ".quick-view", function(event) {
    const productName = $(this).closest('.product').find('[data-product-name]').text();
    event.preventDefault();
    window.location.href = "#product";
    setTimeout(function() {
        fetchProductByName(productName);
    }, 50);
});

//Add to cart button
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('add-to-cart-btn')) {
        event.preventDefault();
        var button = event.target;
        var productName;

        // Check if we're on the product page
        if (window.location.hash === '#product') {
            productName = document.querySelector('.product-name').innerText;
        } else {
            // We're on the store/search page
            var productContainer = button.closest('.product');
            if (productContainer) {
                var nameElement = productContainer.querySelector('[data-product-name]');
                if (nameElement) {
                    productName = nameElement.innerText;
                }
            }
        }

        if (productName) {
            addToCart(productName);
        } else {
            console.error('Could not find product name');
            showErrorMessage("Unable to add product to cart");
        }
    }
    else if (event.target.classList.contains('add-to-wishlist')) {
        event.preventDefault();
        var button = event.target;
        var productName;

        // Check if we're on the product page
        if (window.location.hash === '#product') {
            productName = document.querySelector('.product-name').innerText;
        } else {
            // We're on the store/search page
            var productContainer = button.closest('.product');
            if (productContainer) {
                var nameElement = productContainer.querySelector('[data-product-name]');
                if (nameElement) {
                    productName = nameElement.innerText;
                }
            }
        }

        if (productName) {
            AddToWishlist(productName);
        } else {
            console.error('Could not find product name');
            showErrorMessage("Unable to add product to wishlist");
        }
    }
});


//Add to cart
function addToCart(productName) {
    RestClient.post("beckend/cart/add", {productName: productName}, function(response) {
        
    }, function(jqXHR) {
        showErrorMessage("Unable to put product in cart");
    });
}


//Add to wishlist
function AddToWishlist(productName) {
    RestClient.post("beckend/wishlist/add", {productName: productName}, function(response) {
        
    }, function(jqXHR) {
        showErrorMessage("Unable to put product in wishlist");
    });
}