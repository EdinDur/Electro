$("#register-form").validate({
  rules: {
      uname: {
          required: true
      },
      email: {
          required: true
      },
      psw: {
          required: true,
          minlength: 8
      },
      psw2: {
          required: true,
          equalTo: "#psw"
      }
  },
  messages: {
      uname: {
          required: "You must fill this field"
      },
      email: {
          required: "You must fill this field"
      },
      psw2: {
          equalTo: "Enter the same password"
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
    let jsonResult = {
        username: form.uname.value,
        email: form.email.value,
        psw: form.psw.value
    };
    return jsonResult;
}

function apiFormHandler(form, event) {
    event.preventDefault();
    blockUi("#register-form");
    let data = serializeForm(form);

    $.ajax({
        url: "beckend/users/add",
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
        dataType: "json",
        success: function(response) {
            $("#register-form")[0].reset();
            showSuccessMessage("Registration successful!");
            console.log("Form submitted successfully");

           
                setTimeout(function() {
                    window.location.href = '#home';
                }, 2000);
            
        },
        error: function(xhr, status, error) {
            showErrorMessage("Username or Email already exist");
        },
        complete: function() {
            unblockUi("#register-form");
        }
    });
}


