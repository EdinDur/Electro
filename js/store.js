let currentPage = 1;
const productsPerPage = 9;

const productCardContainer = $("[data-product-specific-cards-container]");
const productsSearchTemplate = $("[data-product-specific-template]");
const paginationContainer = $(".store-pagination");
const sortSelect = $("#sort-select");

// Price filter variables
let minPrice = 0;
let maxPrice = 10000; // Set a reasonable max, or dynamically set after fetching products

// Ajax Calls
function fetchProducts() {
    RestClient.get("beckend/products", {}, function(response) {
        data = response.data;
        updatePriceSliderRange(data);
        displayProducts(currentPage);
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}


function fetchCategoryProducts(categoryName) {
    RestClient.get("beckend/productsByCategory", { category: categoryName }, function(response) {
        data = response.data;
        updatePriceSliderRange(data);
        displayProducts(currentPage);
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}


function SearchFunction(inputValue) {
    RestClient.get("beckend/productsByInput", { input: inputValue }, function(response) {
        data = response.data;
        updatePriceSliderRange(data);
        displayProducts(currentPage);
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}


//Fetch products by new
function fetchProductNew() {
    RestClient.get("beckend/productsNew", {}, function(response) {
        data = response.data;
        updatePriceSliderRange(data);
        displayProducts(currentPage);
    }, function(error) {
        console.error("Error fetching products:", error);
    });
}


function getSelectedCategories() {
    let selected = [];
    $(".category-checkbox:checked").each(function() {
        selected.push($(this).data("category"));
    });
    return selected;
}

function displayProducts(page) {
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    if (!Array.isArray(data)) {
        console.error("Data is not an array");
        return;
    }

    let filteredProducts = data;

    // Filter by selected categories
    const selectedCategories = getSelectedCategories();
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
            selectedCategories.includes(product.category)
        );
    }

    // Filter by sort option
    const selectedOption = parseInt(sortSelect.val());
    if (selectedOption === 1) {
        filteredProducts = filteredProducts.filter(product => product.productNew === 1);
    } else if (selectedOption === 2) {
        filteredProducts = filteredProducts.filter(product => product.sale > 0);
    }

    // Filter by price
    let min = Number($("#price-min").val()) || minPrice;
    let max = Number($("#price-max").val()) || maxPrice;
    filteredProducts = filteredProducts.filter(product => {
        let price = Number(product.price);
        return price >= min && price <= max;
    });

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

// After fetching products, set slider range dynamically
function updatePriceSliderRange(products) {
    if (!products || products.length === 0) return;
    const prices = products.map(p => Number(p.price));
    minPrice = Math.min(...prices);
    maxPrice = Math.max(...prices);

    $("#price-slider")[0].noUiSlider.updateOptions({
        range: {
            min: minPrice,
            max: maxPrice
        }
    });
    $("#price-min").val(minPrice);
    $("#price-max").val(maxPrice);
}

// Initialize price slider
$(document).ready(function() {
    if ($("#price-slider").length) {
        // Only create if not already initialized
        if (!$("#price-slider")[0].noUiSlider) {
            noUiSlider.create($("#price-slider")[0], {
                start: [minPrice, maxPrice],
                connect: true,
                range: {
                    min: minPrice,
                    max: maxPrice
                },
                step: 1,
                tooltips: true,
                format: {
                    to: value => Math.round(value),
                    from: value => Number(value)
                }
            });
        }

        // On slider update, update input fields
        $("#price-slider")[0].noUiSlider.on('update', function(values, handle) {
            $("#price-min").val(Math.round(values[0]));
            $("#price-max").val(Math.round(values[1]));
        });

        // On slider change, filter products
        $("#price-slider")[0].noUiSlider.on('change', function(values, handle) {
            $("#price-min").val(Math.round(values[0]));
            $("#price-max").val(Math.round(values[1]));
            displayProducts(1); 
        });

        // On input change, update slider and filter products
        $("#price-min, #price-max").on('change', function() {
            let min = Number($("#price-min").val());
            let max = Number($("#price-max").val());
            $("#price-slider")[0].noUiSlider.set([min, max]);
            displayProducts(1); // Always reset to first page on filter
        });
    }
});

			$(document).ready(function() {
				
				function updateAsideVisibility() {
					if(window.location.hash === "#store") {
						$("#categories-aside").show();
					} else {
						$("#categories-aside").hide();
					}
				}

				updateAsideVisibility();

				// Show/hide categories on navigation click
				$(document).on("click", 'li[name="allProducts"] > a', function() {
					$("#categories-aside").show();
				});

				$(document).on("click", 'li[name]:not([name="allProducts"]) > a', function() {
					$("#categories-aside").hide();
				});

				
				$(window).on("hashchange", function() {
					updateAsideVisibility();
				});
			});

// Listen for changes on category checkboxes
$(document).on("change", ".category-checkbox", function() {
    currentPage = 1;
    displayProducts(currentPage);
});

