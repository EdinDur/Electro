$("#login-form").validate({
    rules: {
        uname: {
            required: true
        },       
        psw: {
            required: true
        }
    }, 
    submitHandler: function(form, event) {
        apiFormHandler(form, event);
    }
});

function showSuccessMessage(message) {
    toastr.success(message);
}

function showErrorMessage(message) {
    toastr.error(message);
}

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
    let formData = {
        username: form.uname.value,
        psw: form.psw.value
    };

    return formData;
}

function apiFormHandler(form, event) {
    event.preventDefault();
    blockUi("#login-form");
    let data = serializeForm(form);

    RestClient.post('beckend/auth/login', data, function(response) {
        if (response.token && response.username) {
            $("#login-form")[0].reset();

            showSuccessMessage("Login successful!");
            console.log("Login successful");
                
            Utils.set_to_localstorage('user', response);

            setTimeout(function() {
                window.location = '../';
            }, 2000);
        } else {
            showErrorMessage("Invalid username or password");
        }
        unblockUi("#login-form");
    }, function() {
        showErrorMessage("Failed to login");
        unblockUi("#login-form");
    });
}
