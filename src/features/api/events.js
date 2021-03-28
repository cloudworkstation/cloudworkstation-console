import getApiEndpoint from "./endpoint";

const sse = new EventSource(getApiEndpoint() + "/event");

const registerEventStream = function(cb) {
  sse.addEventListener("message", function(e) {
    console.log(e.data);
    cb(e.data);
  });
}

export default registerEventStream;