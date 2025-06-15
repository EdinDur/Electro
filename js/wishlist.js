function fetchWishlist() {
    RestClient.get("beckend/wishlist", {}, function(response) {
        var responseData = response.data;
        var tableBody = $('#productWishlistTableBody');
        var totalPrice = 0;
        var products = {};

        responseData.forEach(function(product) {
            var productName = product.productName;
            if (!products[productName]) {
                products[productName] = {
                    count: 0,
                    totalPrice: 0,
                    productImage: product.mImage
                };
            }
            products[productName].count++;
            products[productName].totalPrice += parseFloat(product.price) || 0;
        });

        tableBody.empty();

        Object.keys(products).forEach(function(productName) {
            var product = products[productName];
            var pricePerProduct = product.totalPrice / product.count;
            var row = $('<tr>');
            row.html(`
                <td><img src="${product.productImage}" alt="${productName}" width="50"></td>
                <td class="bold uppercase">${productName}</td>
                <td class="bold uppercase">$${pricePerProduct.toFixed(2)}</td>
                <td class="bold uppercase">${product.count}</td>
                <td class="bold uppercase">$<span class="productTotal">${product.totalPrice.toFixed(2)}</span></td>
                <td>
                    <button class="delete-wishlist-btn custom-button" data-product="${productName}">Delete</button>
                </td>
                <td>
                    <button class="move-to-cart-btn custom-button" data-product="${productName}">Move to Cart</button>
                </td>
            `);
            tableBody.append(row);
            totalPrice += product.totalPrice;
        });
        $('#totalPrice').text('$' + totalPrice.toFixed(2));
    }, function(jqXHR) {
        console.error("Failed to fetch wishlist:", jqXHR);
    });
}
fetchWishlist();

$('#productWishlistTableBody').on('click', '.delete-wishlist-btn', function() {
    var productName = $(this).data('product');
    RestClient.delete("beckend/wishlist/delete-product?productName=" + encodeURIComponent(productName), {}, function() {
        fetchWishlist();
    }, function(jqXHR) {
        console.error("Failed to delete product from wishlist:", jqXHR);
    });
});

$('#productWishlistTableBody').on('click', '.move-to-cart-btn', function() {
    var productName = $(this).data('product');
    // Add to cart
    RestClient.post("beckend/cart/add", { productName: productName }, function() {
        // Remove from wishlist after adding to cart
        RestClient.delete("beckend/wishlist/delete-product?productName=" + encodeURIComponent(productName), {}, function() {
            fetchWishlist();
        }, function(jqXHR) {
            console.error("Failed to delete product from wishlist after moving to cart:", jqXHR);
        });
    }, function(jqXHR) {
        console.error("Failed to move product to cart:", jqXHR);
    });
});

$('#emptyWishlistButton').click(function() {
    RestClient.delete("beckend/wishlist/delete", {}, function() {
        $('#productWishlistTableBody').empty();
        $('#totalPrice').text('$0.00');
    }, function(jqXHR) {
        console.error("Failed to empty the wishlist:", jqXHR);
    });
});