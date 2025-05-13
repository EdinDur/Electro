const productsNewTemplate = $("[data-product-new-template]");
const productCardHomeContainer = $("[data-product-new-cards-container]");

const productsBestSellingTemplate = $("[data-product-best-selling-template]");
const productBestSellingContainer = $("[data-product-best-selling-cards-container]");

RestClient.get("beckend/products", {}, function(response) {
    const data = response.data;

    const newProducts = data.filter(product => product.productNew === 1);
    const bestSellingProducts = data.filter(product => product.productNew === 0 && product.sale);
    const bestSellingProductsToDisplay = bestSellingProducts.slice(0, 4);
    const newProductsToDisplay = newProducts.slice(0, 4);

    $.each(newProductsToDisplay, function(index, product) {
        const cardContent = productsNewTemplate.html();     
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

        productCardHomeContainer.append($card);
    });

    $.each(bestSellingProductsToDisplay, function(index, product) {
        const cardContent = productsBestSellingTemplate.html();
        const $card = $(cardContent);

        $card.find("[data-product-name]").text(product.productName);
        $card.find("[data-product-price]").text("$" + product.price);
        $card.find("[data-product-category]").text(product.category);
        $card.find("[data-product-image]").attr("src", product.mImage);
    
        const newIndicator = $card.find(".new");
        if (product.productNew) {
            newIndicator.text("New");
        } else {
            newIndicator.remove();
        }
    
        const onSaleIndicator = $card.find(".sale");
        if (product.sale) {
            onSaleIndicator.text(`${product.sale}%`);
        } else {
            onSaleIndicator.remove();
        }

        productBestSellingContainer.append($card);
    });
}, function(xhr) {
    console.error("Error fetching data:", xhr);
});

//button listeners
const buttons = document.querySelectorAll('.cta-btn');

buttons.forEach(button => {
    button.addEventListener('click', function(event) {
        event.preventDefault();
        const category = this.getAttribute('data-category');
        if(category==="new"){
            window.location.href = "#store";
            fetchProductNew();
        }
        else{
            window.location.href = "#store";
            fetchCategoryProducts(category); 
        }
    });
});