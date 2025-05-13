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

        if (products[productName]) {
            products[productName].quantity++;
            products[productName].totalPrice += productPrice;

            var row = tableBody.find(`tr[data-name="${productName}"]`);
            row.find('.productQuantity').text(products[productName].quantity);
            row.find('.productTotal').text(products[productName].totalPrice.toFixed(2));
        } else {
            products[productName] = {
                quantity: 1,
                totalPrice: productPrice
            };

            var row = $('<tr>');
            row.attr('data-name', productName);
            var imageHtml = productImage ? `<td><img src="${productImage}" alt="${productName}" width="50"></td>` : '<td colspan="1">Image not available</td>';
            row.html(`
                ${imageHtml}
                <td class="bold uppercase">${productName}</td>
                <td class="bold uppercase">$${productPrice.toFixed(2)}</td>
                <td class="bold uppercase productQuantity">1</td>
                <td class="bold uppercase">$<span class="productTotal">${productPrice.toFixed(2)}</span></td>
            `);
            tableBody.append(row);
        }

        totalPrice += productPrice;
    });

    $('#totalPrice').text('$' + totalPrice.toFixed(2));
}

function populateOrderSummary(data) {
    var orderSummaryContainer = $('#orderSummaryContainer');
    var totalPrice = 0;

    orderSummaryContainer.empty();

    var orderSummary = $('<div class="order-summary">');

    data.forEach(function(product) {
        var productRow = $('<div class="order-col">');
        productRow.html(`
            <div>${product.name}</div>
            <div>$${product.price.toFixed(2)}</div>
        `);
        orderSummary.append(productRow);
        totalPrice += product.price;
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
