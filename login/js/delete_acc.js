const username = "edin4321";


$(document).ready(function(){
    $("#yes-btn").click(function(){
        $.ajax({
            url: "beckend/users/delete",
            type: "DELETE",
            data: JSON.stringify({ username: username }),
            contentType: "application/json",
            dataType: "json",
            success: function(response) {
                setTimeout(function() {
                window.location.href = '#home';
            }, 2000);
            },
            error: function(xhr, status, error) {
                showErrorMessage("Failed to delete");
            }
        });
    });

    $("#no-btn").click(function(){
        window.location.href = "#home";
    });
});
