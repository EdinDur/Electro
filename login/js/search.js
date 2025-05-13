let data=[];
let username="edin1234";


//Cart Dropdown
$.ajax({
    url: "beckend/cart",
    type:"GET",
    data:{username:username},
    dataType: "json",
    success: function(data) {
        populateCartDropdown(data);
    },
    error: function(xhr, status, error) {

    }
});

function populateCartDropdown(response) {
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
        if (!itemsSummary[productName]) {
            itemsSummary[productName] = {
                count: 0,
                totalPrice: 0,
                productImage: product.mImage,
            };
        }
        itemsSummary[productName].count++;
        itemsSummary[productName].totalPrice += product.price;
        totalPrice += product.price;
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
    subtotal.text("SUBTOTAL: $" + totalPrice.toFixed(2));
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
        var productContainer = button.closest('.product');
        var productName = productContainer.querySelector('[data-product-name]').innerText;
        addToCart(productName);
    }
    else if (event.target.classList.contains('add-to-wishlist')){
        event.preventDefault();
        var button = event.target;
        var productContainer = button.closest('.product');
        var productName = productContainer.querySelector('[data-product-name]').innerText;
        AddToWishlist(productName);
    }
});

//Add to cart
function addToCart(productName) {
    var cartProduct = {
        productName: productName,
        username: username
    };
    $.ajax({
        url: "beckend/cart/add",
        type: "POST",
        data: JSON.stringify(cartProduct),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            

                     
            
        },
        error: function(xhr, status, error) {
            showErrorMessage("Unable to put product in cart");
        }
    });
}

//Add to wishlist
function AddToWishlist(productName) {
    var cartProduct = {
        productName: productName,
        username: username
    };
    $.ajax({
        url: "beckend/wishlist/add",
        type: "POST",
        data: JSON.stringify(cartProduct),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            

                     
            
        },
        error: function(xhr, status, error) {
            showErrorMessage("Unable to put product in cart");
        }
    });
}