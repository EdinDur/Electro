RestClient.get("beckend/cart", { username: username }, function(data) {
    populateTableWithData(data);
    populateOrderSummary(data);
}, function(xhr) {
    console.error("Failed to get cart data:", xhr);
});

$('#emptyCartButton').click(function() {
    RestClient.delete("beckend/cart/delete", {username: username}, function() {
        $('#productTableBody').empty();
        $('#totalPrice').text('$0.00');
    }, function(xhr) {
        console.error("Failed to empty the cart:", xhr);
    });
});

function populateTableWithData(response) {
    var responseData = response.data;
    var tableBody = $('#productTableBody');
    var totalPrice = 0;
    var products = {};

    tableBody.empty();

    responseData.forEach(function(product) {
        var productName = product.productName;
        var productPrice = parseFloat(product.price) || 0;
        var productImage = product.mImage;
        var quantity = parseInt(product.quantity, 10) || 1;
        var totalProductPrice = productPrice * quantity;

        var row = $('<tr>');
        row.attr('data-name', productName);
        var imageHtml = productImage ? `<td><img src="${productImage}" alt="${productName}" width="50"></td>` : '<td colspan="1">Image not available</td>';
        row.html(`
            ${imageHtml}
            <td class="bold uppercase">${productName}</td>
            <td class="bold uppercase">$${productPrice.toFixed(2)}</td>
            <td class="bold uppercase productQuantity">${quantity}</td>
            <td class="bold uppercase">$<span class="productTotal">${totalProductPrice.toFixed(2)}</span></td>
            <td>
                <button class="delete-cart-btn custom-button" data-product="${productName}">Delete</button>
            </td>
        `);
        tableBody.append(row);

        totalPrice += totalProductPrice;
    });

    $('#totalPrice').text('$' + totalPrice.toFixed(2));
}

function populateOrderSummary(data) {
    var orderSummaryContainer = $('#orderSummaryContainer');
    var totalPrice = 0;

    orderSummaryContainer.empty();

    var orderSummary = $('<div class="order-summary">');

    data.forEach(function(product) {
        var quantity = parseInt(product.quantity, 10) || 1;
        var productTotal = product.price * quantity;
        var productRow = $('<div class="order-col">');
        productRow.html(`
            <div>${product.productName} x${quantity}</div>
            <div>$${productTotal.toFixed(2)}</div>
        `);
        orderSummary.append(productRow);
        totalPrice += productTotal;
    });

    var shippingRow = $('<div class="order-col">');
    shippingRow.html(`
        <div>Shipping</div>
        <div>FREE</div>
    `);
    orderSummary.append(shippingRow);

    var totalRow = $('<div class="order-col">');
    totalRow.html(`
        <div><strong>TOTAL</strong></div>
        <div><strong class="order-total">$${totalPrice.toFixed(2)}</strong></div>
    `);
    orderSummary.append(totalRow);

    orderSummaryContainer.append(orderSummary);
}

$('#productTableBody').on('click', '.delete-cart-btn', function() {
    var productName = $(this).data('product');
    RestClient.delete("beckend/cart/delete-product?productName=" + encodeURIComponent(productName), {}, function() {
        RestClient.get("beckend/cart", {}, function(data) {
            populateTableWithData(data);
            populateOrderSummary(data);
        });
    }, function(xhr) {
        console.error("Failed to delete product from cart:", xhr);
    });
});