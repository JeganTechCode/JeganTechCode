var env = "local"
var configuration = {};
if (env == "local") {
    configuration = {
       
        localhostBackend : 'http://localhost:3001', 
        localhostFrontend:'http://localhost:3000', 
    }
} else {
    configuration = {
       
        
       
    }
}

// http://3.110.127.65:3001
// localhost: 'http://localhost:3001'

export default configuration;