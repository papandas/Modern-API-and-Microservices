const grpc = require('grpc')

const services = require('../server/protos/dummy_grpc_pb')

function main() {
    console.log('Hello from Client')

    var client = new services.DummyServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )
}

main()