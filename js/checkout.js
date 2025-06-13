RestClient.get("beckend/cart?username=" + username, function(data) {
    populateOrderSummary(data);
}, function(xhr) {
    console.error("Failed to get cart data:", xhr);
});

//CHECKOUT
function populateOrderSummary(response) {
    var responseData = response.data;
    var orderSummaryContainer = $('#orderSummaryContainer');
    var totalPrice = 0;

    // Clear existing order summary
    orderSummaryContainer.empty();

    // Populate order summary
    var orderSummary = $('<div class="order-summary">');

    // Add product details
    responseData.forEach(function(product) {
        var price = Number(product.price); // Ensure price is a number
        var productRow = $('<div class="order-col">');
        productRow.html(`
            <div>${product.productName}</div>
            <div>$${price.toFixed(2)}</div>
        `);
        orderSummary.append(productRow);
        totalPrice += price;
    });

    // Add shipping details
    var shippingRow = $('<div class="order-col">');
    shippingRow.html(`
        <div>Shipping</div>
        <div>FREE</div>
    `);
    orderSummary.append(shippingRow);

    // Add total
    var totalRow = $('<div class="order-col">');
    totalRow.html(`
        <div><strong>TOTAL</strong></div>
        <div><strong class="order-total">$${totalPrice.toFixed(2)}</strong></div>
    `);
    orderSummary.append(totalRow);

    // Append order summary to container
    orderSummaryContainer.append(orderSummary);
}

$("#billingForm").validate({
    rules: {
        fname: {
            required: true
        },
        lname: {
            required: true
        },
        email: {
            required: true
        },
        address: {
            required: true
        },
        city: {
            required: true
        },
        country: {
            required: true
        },
        zip: {
            required: true
        },
        tel: {
            required: true
        },
        onotes: {
            required: false
        }
    }
  });
  
  $.validator.addMethod("expdate", function(value, element) {
    return this.optional(element) || /^(0[1-9]|1[0-2])\/\d{2}$/.test(value);
}, "Please enter a valid expiration date (MM/YY).");

  $("#paymentForm").validate({
    rules: {
        "card-number": {
            required: function() {
                return $("#Visa").is(":checked");
            },
            minlength: 16,
            maxlength: 16,
            digits: true
        },
        "exp-date": {
            required: function() {
                return $("#Visa").is(":checked");
            },
            expdate: true
        },
        "ccv": {
            required: function() {
                return $("#Visa").is(":checked");
            },
            minlength: 3,
            maxlength: 3,
            digits: true
        },
        "username": {
            required: function() {
                return $("#Paypal").is(":checked");
            }
        },
        "verification": {
            required: function() {
                return $("#Paypal").is(":checked");
            },
            minlength: 4
        }
    },
    messages: {
        "exp-date": {
            pattern: "Please enter a valid expiration date (MM/YY)."
        }
    }   
});


$(document).on('input', '#exp-date', function() {
    let val = $(this).val().replace(/[^\d]/g, '');
    if (val.length > 2) {
        val = val.slice(0,2) + '/' + val.slice(2,4);
    }
    $(this).val(val.slice(0,5));
});

// Only allow 3 digits for CCV
$(document).on('input', '#ccv', function() {
    this.value = this.value.replace(/\D/g, '').slice(0,3);
});

$("#submitButton").click(function(event) {
    event.preventDefault();
    var billingFormValid = $("#billingForm").valid();
    var paymentFormValid = $("#paymentForm").valid();
    
    if (billingFormValid && paymentFormValid) {
        blockUi("#paymentForm");
        blockUi("#billingForm");

        // Serialize both forms
        var billingData = serializeForm("#billingForm");
        var paymentData = serializeForm("#paymentForm");

        // Extract selected payment method
        var paymentMethod = $("input[name='payment']:checked").attr("id");
        paymentData.payment = paymentMethod;

        // Get username from localstorage/session
        var user = Utils.get_from_localstorage('user');
        var username = user && user.username ? user.username : null;

        // Combine all data
        var checkoutData = {
            username: username,
            billing: billingData,
            payment: paymentData
        };

        RestClient.post("beckend/checkout", JSON.stringify(checkoutData), function(response) {
            unblockUi("#paymentForm");
            unblockUi("#billingForm");
            toastr.success("Order placed successfully!");
            // Optionally redirect or clear forms
        }, function(xhr) {
            unblockUi("#paymentForm");
            unblockUi("#billingForm");
            toastr.error("Failed to place order.");
        });

    } else {
        unblockUi("#paymentForm");
        unblockUi("#billingForm");
        toastr.error("Please fill out all required fields.");
    }
});

function blockUi(element) {
    $(element).block({
        message: '<div class="spinner-border text-primary" role="status"></div>',
        css: {
            backgroundColor: "transparent",
            border: "0",
        },
        overlayCSS: {
            backgroundColor: "#000",
            opacity: 0.25,
        },
    });
  }
  
  function unblockUi(element) {
    $(element).unblock({});
  }
  
  function serializeForm(form) {
    let jsonResult = {};
    $.each($(form).serializeArray(), function() {
        jsonResult[this.name] = this.value;
    });
    return jsonResult;
  }