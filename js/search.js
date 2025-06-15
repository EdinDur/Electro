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
    var totalProductQuantity = 0;

    cartList.empty();

    responseData.forEach(function(product) {
        var productName = product.productName;
        var price = parseFloat(product.price) || 0;
        var quantity = parseInt(product.quantity, 10) || 1;
        var productImage = product.mImage;
        var productTotal = price * quantity;

        var productItem = $('<div class="product-widget">');
        productItem.html(`
            <div class="product-img">
                <img src="${productImage}" alt="${productName}">
            </div>
            <div class="product-body">
                <h3 class="product-name"><a href="#product">${productName}</a></h3>
                <h4 class="product-price"><span class="qty">${quantity}x</span>$${price.toFixed(2)}</h4>
            </div>
        `);
        cartList.append(productItem);

        totalPrice += productTotal;
        itemCount++;
        totalProductQuantity += quantity;
    });

    totalItems.text(itemCount);
    totalQuantity.text(totalProductQuantity > 0 ? totalProductQuantity + " Item(s) selected" : "No items selected");
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
    if (event.target.classList.contains('add-to-cart-btn') || event.target.classList.contains('add-to-wishlist')) {
        event.preventDefault();
        var button = event.target;
        var productName = null;

        // Try to find the closest ancestor with [data-product-name]
        var nameElement = button.closest('[data-product-name]');
        if (nameElement) {
            productName = nameElement.innerText.trim();
        }

        // If not found, try within .product-details
        if (!productName) {
            var productDetails = button.closest('.product-details');
            if (productDetails) {
                var nameInDetails = productDetails.querySelector('[data-product-name]');
                if (nameInDetails) {
                    productName = nameInDetails.innerText.trim();
                }
            }
        }

        if (!productName) {
            var productContainer = button.closest('.product');
            if (productContainer) {
                var nameInProduct = productContainer.querySelector('[data-product-name]');
                if (nameInProduct) {
                    productName = nameInProduct.innerText.trim();
                }
            }
        }

        if (!productName) {
            var globalName = document.querySelector('[data-product-name]');
            if (globalName) {
                productName = globalName.innerText.trim();
            }
        }

        if (productName) {
            if (event.target.classList.contains('add-to-cart-btn')) {
                addToCart(productName);
            } else {
                AddToWishlist(productName);
            }
        } else {
            console.error('Could not find product name');
            showErrorMessage("Unable to add product to cart/wishlist");
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