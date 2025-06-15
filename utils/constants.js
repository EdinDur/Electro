var Constants = {
    get_api_base_url: function () {
      if (location.hostname == "localhost") {
          return "http://localhost/WebProgramming/";
      } else {
          return "electro-bcqmb.ondigitalocean.app";
      }
    },
  };