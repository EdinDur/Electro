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
    }, function(jqXHR) {
        console.error("Error fetching products:", jqXHR);
    });
}
