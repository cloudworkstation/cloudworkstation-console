const getApiEndpoint = function() {
  if(window.location.hostname === "localhost") {
    return "http://localhost:5000";
  } else {
    return "/api"
  }
}

export default getApiEndpoint;