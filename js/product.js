$('#product-main-img').slick({
    infinite: true,
    speed: 300,
    dots: false,
    arrows: true,
    fade: true,
    asNavFor: '#product-imgs'
});
$('#product-imgs').slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    centerMode: true,
    focusOnSelect: true,
    asNavFor: '#product-main-img'
});
$('#product-main-img .product-preview img').zoom();
function changeMainImage(src) {
    document.getElementById('main-product-image').src = src;
    
    const thumbnails = document.querySelectorAll('.thumbnail-image');
    thumbnails.forEach(thumb => {
        if (thumb.querySelector('img').src === src) {
            thumb.classList.add('active');
        } else {
            thumb.classList.remove('active');
        }
    });
}

const productShowTemplate = $("[data-product-template]");
const productShowCarContainer = $("[data-product-container]");

//Fetch Product by Name
function fetchProductByName(productName) {
    console.log(productName);
    
    RestClient.get("beckend/productsByName", { productName: productName }, function(response) {
        const data = response.data;
        const cardContentProduct = productShowTemplate.html();
        const $card = $(cardContentProduct);
        
        $card.find('[data-product-name]').text(data.productName);
        $card.find('[data-product-price]').text("$" + data.price);
        $card.find('[data-product-stock]').text(data.stock > 0 ? "In Stock" : "Out of Stock");
        $card.find('[data-product-mini-description]').text(data.miniDescription);
        $card.find('[data-product-description]').text(data.description);
        $card.find('[data-product-details]').text(data.details);
        $card.find('[data-product-category]').text(data.category);
        
        // Set images
        const mainImg = data.mImage;
        const img1 = data.sImage1;
        const img2 = data.sImage2;
        
        $card.find('[data-product-mImage]').attr("src", mainImg);
        $card.find('[data-product-sImage1]').attr("src", img1);
        $card.find('[data-product-sImage2]').attr("src", img2);

        if (data.productNew) {
            $card.find(".new").text("New");
        } else {
            $card.find(".new").remove();
        }

        if (data.sale) {
            $card.find(".sale").text(`${data.sale}%`);
        } else {
            $card.find(".sale").remove();
        }

        productShowCarContainer.empty().append($card);
        
        
        initializeThumbnailHandlers();
    }, function(jqXHR) {
        console.error("Error fetching products:", jqXHR);
    });
}

function getProductNameFromUrl() {
    
    let hash = window.location.hash;
    if (hash.startsWith("#product")) {
        let params = new URLSearchParams(hash.split("?")[1]);
        return params.get("name");
    }
    
    let params = new URLSearchParams(window.location.search);
    return params.get("name");
}

function displayProductFromData(product) {
    const cardContentProduct = productShowTemplate.html();
    const $card = $(cardContentProduct);        

    $card.find('[data-product-name]').text(product.productName);
    $card.find('[data-product-price]').text("$" + product.price);
    $card.find('[data-product-stock]').text(product.stock > 0 ? "In Stock" : "Out of Stock");
    $card.find('[data-product-mini-description]').text(product.miniDescription);
    $card.find('[data-product-description]').text(product.description);
    $card.find('[data-product-details]').text(product.details);
    $card.find('[data-product-category]').text(product.category);
    $card.find('[data-product-mImage]').attr("src", product.mImage);
    $card.find('[data-product-sImage1]').attr("src", product.sImage1);
    $card.find('[data-product-sImage2]').attr("src", product.sImage2);

    if (product.productNew) {
        $card.find(".new").text("New");
    } else {
        $card.find(".new").remove();
    }

    if (product.sale) {
        $card.find(".sale").text(`${product.sale}%`);
    } else {
        $card.find(".sale").remove();
    }

    productShowCarContainer.html($card);
    
    
    initializeThumbnailHandlers();
}

function initializeThumbnailHandlers() {
    
    $('.thumbnail-image img').click(function() {
        const src = $(this).attr('src');
        changeMainImage(src);
    });
}


$(document).ready(function() {
    const productName = getProductNameFromUrl();
    if (productName) {
        fetchProductByName(productName);
    }

    // Handle hash changes
    $(window).on('hashchange', function() {
        const productName = getProductNameFromUrl();
        if (productName) {
            fetchProductByName(productName);
        }
    });
});
function addToCartFromProductPage(productName, qty) {
    RestClient.post("beckend/cart/add", {
        productName: productName,
        quantity: qty
    }, function(response) {
        alert("Added to cart!");
    }, function(jqXHR) {
        alert("Failed to add to cart.");
    });
}

$(document).on('click', '.add-to-cart-btn-product', function() {
    const $card = $(this).closest('.product-details');
    const productName = $card.find('[data-product-name]').text().trim();
    const qty = parseInt($card.find('.input-number input[type="number"]').val(), 10) || 1;

    addToCartFromProductPage(productName, qty);
});

$(document).on('click', '.qty-up', function() {
    const $input = $(this).siblings('input[type="number"]');
    let val = parseInt($input.val(), 10) || 1;
    $input.val(val + 1);
});

$(document).on('click', '.qty-down', function() {
    const $input = $(this).siblings('input[type="number"]');
    let val = parseInt($input.val(), 10) || 1;
    if (val > 1) {
        $input.val(val - 1);
    }
});