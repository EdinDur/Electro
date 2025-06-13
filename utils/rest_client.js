const RestClient = {
  get: function (url, data, callback, error_callback) {
      $.ajax({
          url: Constants.get_api_base_url() + url,
          type: "GET",
          data: data,
          beforeSend: function (xhr) {
              const storedUser = Utils.get_from_localstorage('user');
              if (storedUser) {
                  try {
                      const token = storedUser.token;
                      if (token) {
                          xhr.setRequestHeader("Authentication", `${token}`);
                      }
                  } catch (e) {
                      console.error("Error accessing user data:", e);
                  }
              }
          },
          success: function (response) {
              if (callback) callback(response);
          },
          error: function (jqXHR, textStatus, errorThrown) {
              console.error("Failed to get data:", jqXHR);
              if (error_callback) error_callback(jqXHR);
          },
      });
  },
  request: function (url, method, data, callback, error_callback) {
      $.ajax({
          url: Constants.get_api_base_url() + url,
          type: method,
          data: data,
          beforeSend: function (xhr) {
              const storedUser = Utils.get_from_localstorage('user');
              if (storedUser) {
                  try {
                      const token = storedUser.token;
                      if (token) {
                          xhr.setRequestHeader("Authentication", `${token}`);
                      }
                  } catch (e) {
                      console.error("Error accessing user data:", e);
                  }
              }
          }
      })
      .done(function (response, status, jqXHR) {
          if (callback) callback(response);
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
          console.error("Request failed:", jqXHR);
          if (error_callback) {
              error_callback(jqXHR);
          } else {
              toastr.error(jqXHR.responseJSON ? jqXHR.responseJSON.message : "Request failed");
          }
      });
  },
  post: function (url, data, callback, error_callback) {
      this.request(url, "POST", data, callback, error_callback);
  },
  delete: function (url, data, callback, error_callback) {
      this.request(url, "DELETE", data, callback, error_callback);
  },
  put: function (url, data, callback, error_callback) {
      this.request(url, "PUT", data, callback, error_callback);
  },
};