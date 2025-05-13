let currentPage = 1;
const productsPerPage = 9;

const productCardContainer = $("[data-product-specific-cards-container]");
const productsSearchTemplate = $("[data-product-specific-template]");
const paginationContainer = $(".store-pagination");
const sortSelect = $("#sort-select");

// Ajax Calls
function fetchProducts() {
    RestClient.get("beckend/products", {}, function(response) {
        data = response.data;
        displayProducts(currentPage);
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}


function fetchCategoryProducts(categoryName) {
    RestClient.get("beckend/productsByCategory", { category: categoryName }, function(response) {
        data = response.data;
        displayProducts(currentPage);
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}


function SearchFunction(inputValue) {
    RestClient.get("beckend/productsByInput", { input: inputValue }, function(response) {
        data = response.data;
        displayProducts(currentPage);
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}


//Fetch products by new
function fetchProductNew() {
    RestClient.get("beckend/productsNew", {}, function(response) {
        data = response.data;
        displayProducts(currentPage);
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}


function displayProducts(page) {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    if (!Array.isArray(data)) {
        console.error("Data is not an array");
        return;
    }

    let filteredProducts = data;

    const selectedOption = parseInt(sortSelect.val());

    if (selectedOption === 1) {
        filteredProducts = data.filter(product => product.productNew === 1);
    } else if (selectedOption === 2) {
        filteredProducts = data.filter(product => product.sale > 0);
    }

    const totalFilteredProducts = filteredProducts.length;
    const totalPages = Math.ceil(totalFilteredProducts / productsPerPage);

    const productsToShow = filteredProducts.slice(startIndex, endIndex);

    productCardContainer.empty();

    $.each(productsToShow, function(index, product) {
        const cardContent = productsSearchTemplate.html();
        const $card = $(cardContent);

        $card.find("[data-product-name]").text(product.productName);
        $card.find("[data-product-price]").text("$" + product.price);
        $card.find("[data-product-category]").text(product.category);
        $card.find("[data-product-image]").attr("src", product.mImage);

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

        productCardContainer.append($card);
    });

    generatePagination(totalPages);
}

// Pagination
function generatePagination(totalPages) {
    paginationContainer.empty();

    for (let i = 1; i <= totalPages; i++) {
        const li = $("<li>").text(i).attr("data-page", i);

        if (i === currentPage) {
            li.addClass("active");
        }

        paginationContainer.append(li);
    }
}

paginationContainer.on("click", "li", function() {
    const page = parseInt($(this).attr("data-page"));

    if (!isNaN(page)) {
        currentPage = page;
        displayProducts(currentPage);
    }
});

sortSelect.on("change", function() {
    currentPage = 1;
    displayProducts(currentPage);
});

productCardContainer.on("click", ".quick-view", function(event) {
    const productName = $(this).closest('.product').find('[data-product-name]').text();
    event.preventDefault();
    window.location.href = "#product";
    fetchProductByName(productName);
});

function fetchProductByName(productName) {
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
        $card.find('[data-product-mImage]').attr("src", data.mImage);
        $card.find('[data-product-sImage1]').attr("src", data.sImage1);
        $card.find('[data-product-sImage2]').attr("src", data.sImage2);

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
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}

