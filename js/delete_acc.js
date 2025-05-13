$(document).ready(function(){
    $("#yes-btn").click(function(){
        RestClient.delete("beckend/users/delete", { username: username }, function(response) {
            setTimeout(function() {
                Utils.logout();
            }, 2000);
        }, function(xhr, status, error) {

        });
    });
    $("#no-btn").click(function(){
        window.location.href = "#home";
    });
});

