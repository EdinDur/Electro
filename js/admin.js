let allUsers = [];
let allProducts = [];

$(document).ready(function() {
    
    const user = Utils.get_from_localstorage('user');
    if (!user || !user.token) {
        window.location.href = '#login';
        return;
    }

    
    try {
        const payload = JSON.parse(atob(user.token.split('.')[1]));
        if (payload.user.userRole !== 'Admin') {
            window.location.href = '#home';
            return;
        }
    } catch (e) {
        window.location.href = '#login';
        return;
    }

    
    fetchUsers();
    fetchProducts();

    // Initialize search functionality
    $('#userSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        const filteredUsers = allUsers.filter(user => 
            user.username.toLowerCase().includes(value) || 
            user.email.toLowerCase().includes(value)
        );
        renderUsers(value === '' ? allUsers.slice(0, 5) : filteredUsers);
    });

    $('#productSearch').on('keyup', function() {
        const value = $(this).val().toLowerCase();
        const filteredProducts = allProducts.filter(product => 
            product.productName.toLowerCase().includes(value) || 
            product.category.toLowerCase().includes(value)
        );
        renderProducts(value === '' ? allProducts.slice(0, 5) : filteredProducts);
    });
});

function fetchUsers() {
    RestClient.get('beckend/users/get', {}, 
        function(response) {
            if (response && response.data) {
                allUsers = response.data;
                renderUsers(allUsers.slice(0, 5));
            }
        },
        function(error) {
            toastr.error('Failed to fetch users');
            console.error('Error fetching users:', error);
        }
    );
}

function renderUsers(users) {
    const tbody = $('#userTable tbody');
    tbody.empty();

    users.forEach(user => {
        const row = `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>
                    <div class="d-flex">
                        <select class="form-select role-select me-2" data-user-id="${user.id}">
                            <option value="Admin" ${user.userRole === 'Admin' ? 'selected' : ''}>Admin</option>
                            <option value="Customer" ${user.userRole === 'Customer' ? 'selected' : ''}>Customer</option>
                        </select>
                        <button type="button" class="btn btn-primary btn-sm update-role-btn">Update</button>
                    </div>
                </td>
                <td>${user.created_at}</td>
            </tr>
        `;
        tbody.append(row);
    });

    $('.update-role-btn').on('click', function() {
        const userId = $(this).closest('tr').find('.role-select').data('user-id');
        const newRole = $(this).closest('tr').find('.role-select').val();
        updateUserRole(userId, newRole);
    });
}

function fetchProducts() {
    RestClient.get('beckend/products/get', {}, 
        function(response) {
            if (response && response.data) {
                allProducts = response.data;
                renderProducts(allProducts.slice(0, 5));
            }
        },
        function(error) {
            toastr.error('Failed to fetch products');
            console.error('Error fetching products:', error);
        }
    );
}

function renderProducts(products) {
    const tbody = $('#productTable tbody');
    tbody.empty();

    products.forEach(product => {
        const row = `
            <tr>
                <td>${product.productName}</td>
                <td>
                    <div class="d-flex">
                        <input type="number" class="form-control form-control-sm price-input me-2" 
                               value="${product.price}" step="0.01" min="0"
                               style="width:100px;">
                        <button type="button" class="btn btn-primary btn-sm update-price-btn">Update</button>
                    </div>
                </td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                <td>${product.sale || 0}</td>
            </tr>
        `;
        tbody.append(row);
    });

    $('.update-price-btn').on('click', function() {
        const productName = $(this).closest('tr').find('td:first').text();
        const newPrice = $(this).closest('tr').find('.price-input').val();
        updateProductPrice(productName, newPrice);
    });
}

function updateUserRole(userId, newRole) {
    RestClient.post('beckend/users/update-role', 
        {
            user_id: userId,
            role: newRole
        },
        function(response) {
            toastr.success('Role updated successfully');
            fetchUsers();
        },
        function(error) {
            toastr.error('Failed to update role');
            console.error('Error updating role:', error);
        }
    );
}

function updateProductPrice(productName, newPrice) {
    
    if (!productName || !newPrice) {
        toastr.error('Product name and price are required');
        return;
    }

    
    const price = parseFloat(newPrice);
    if (isNaN(price) || price < 0) {
        toastr.error('Invalid price value');
        return;
    }

    RestClient.post('beckend/products/update-price', 
        {
            productName: productName,
            price: price
        },
        function(response) {
            if (response.success) {
                toastr.success(response.message || 'Price updated successfully');
                fetchProducts();
            } else {
                toastr.error(response.error || 'Failed to update price');
                console.error('Update failed:', response);
            }
        },
        function(error) {
            const errorMessage = error.responseJSON?.error || 'Failed to update price';
            toastr.error(errorMessage);
            console.error('Update error:', error);
        }
    );
}

// Toastr configuration
toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};