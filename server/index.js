const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc');
const path = require('path')
const protoLoader = require('@grpc/proto-loader');

const port = "127.0.0.1:50051";
const creds = grpc.ServerCredentials.createInsecure();

// Dynamic loading Proto buf
const greetProtoPath = path.join(__dirname, "..", "protos", "calculator.proto")
const greetProtoDefinition = protoLoader.loadSync(greetProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})
const greetPackageDefinition = grpc.loadPackageDefinition(greetProtoDefinition).greet;

function primeNumberDecomposition(call, callback) {
    var number = call.request.getPrimeNumber()
    var divisor = 2

    console.log("Server Number Request: ", number);

    while (number > 1) {
        if (number % divisor === 0) {
            var primeNumberDecompositionResponse = new calc.PrimeNumberDecompositionResponse();
            primeNumberDecompositionResponse.setPrimeFactor(divisor)

            number = number / divisor

            call.write(primeNumberDecompositionResponse)
        } else {
            divisor++
            console.log('Divisor has increased to ', divisor);
        }
    }

    call.end()
}

function main() {
    const server = new grpc.Server()

    const serviceDefinition = calcService.CalculatorServiceService

    server.addService(serviceDefinition, { primeNumberDecomposition: primeNumberDecomposition })

    server.bind(port, creds)
    server.start()

    console.log(`Server running on port ${port}`)
}

main()