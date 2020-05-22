const grps = require('grpc');

function main() {
    var server = new grps.Server()

    server.bind("127.0.0.1:50051", grps.ServerCredentials.createInsecure())
    server.start()

    console.log("Server running on port 127.0.0.1:50051")
}

main()