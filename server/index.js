const grpc = require('grpc');
const path = require('path')
const protoLoader = require('@grpc/proto-loader');

const port = "127.0.0.1:50051";
const creds = grpc.ServerCredentials.createInsecure();

// Dynamic loading Proto buf
const calcProtoPath = path.join(__dirname, "..", "protos", "calculator.proto")
const calcProtoDefinition = protoLoader.loadSync(calcProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})
const calcPackageDefinition = grpc.loadPackageDefinition(calcProtoDefinition).calculator;



function sum(call, callback) {
    let firstNumber = call.request.first_number;
    let secondNumber = call.request.second_number;

    console.log("Server Received: " + firstNumber + " + " + secondNumber)

    callback(null, { sum_result: (firstNumber + secondNumber) })
}



function primeNumberDecomposition(call, callback) {
    var number = call.request.prime_number;
    var divisor = 2

    console.log("Server Number Request: ", number);

    while (number > 1) {
        if (number % divisor === 0) {

            call.write({ prime_factor: divisor })

            number = number / divisor

            // {message: 'Hello ' + call.request.name}
        } else {
            divisor++
            console.log('Divisor has increased to ', divisor);
        }
    }

    call.end()
}

function main() {
    const server = new grpc.Server()

    const serviceDefinition = calcPackageDefinition.CalculatorService.service;

    server.addService(serviceDefinition, { sum: sum, primeNumberDecomposition: primeNumberDecomposition })

    server.bind(port, creds)
    server.start()

    console.log(`Server running on port ${port}`)
}

main()