$(document).ready(function() {
    // Fetch user info from localStorage
    const user = Utils.get_from_localstorage('user');
    if (user) {
        $('#profile-username').text(user.username);
        $('#profile-email').text(user.email);
        if (user.userRole === 'Admin') {
            $('#admin-button-container').show();
        } else {
            $('#admin-button-container').hide();
        }
    }

    // Fetch order history
    RestClient.get('beckend/users/orders', {}, function(response) {
        const orders = response.data || [];
        const tbody = $('table tbody');
        tbody.empty();
        orders.forEach(order => {
            const orderId = order.order_id || order.id || '';
            const date = order.date || '';
            const total = order.total || '';
            const status = order.status || '';
            const row = `<tr class="order-row" data-order-id="${orderId}">
                <td>${orderId}</td>
                <td>${date}</td>
                <td>${total}</td>
                <td>${status}</td>
            </tr>`;
            tbody.append(row);
        });

        
        $('.order-row').on('click', function() {
            const orderId = $(this).data('order-id');
            // Fetch order items and show in modal
            RestClient.get(`beckend/orders/${orderId}/items`, {}, function(resp) {
                const items = resp.data || [];
                let html = '<table class="table"><thead><tr><th>Product</th><th>Quantity</th><th>Price</th></tr></thead><tbody>';
                items.forEach(item => {
                    html += `<tr>
                        <td>${item.productName}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                    </tr>`;
                });
                html += '</tbody></table>';
                $('#orderItemsModal .modal-body').html(html);
                $('#orderItemsModal').modal('show');
            }, function() {
                toastr.error('Failed to load order items');
            });
        });
    }, function(xhr) {
        toastr.error('Failed to load order history');
    });
});