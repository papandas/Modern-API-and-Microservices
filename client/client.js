const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc');
const path = require('path')
const protoLoader = require('@grpc/proto-loader');

const address = 'localhost:50051';
const credentials = grpc.credentials.createInsecure();

// Dynamic loading Proto buf : Calculator
const calcProtoPath = path.join(__dirname, "..", "protos", "calculator.proto")
const calcProtoDefinition = protoLoader.loadSync(calcProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})
const calcPackageDefinition = grpc.loadPackageDefinition(calcProtoDefinition).greet;

function callPrimeNumberDecomposition() {
    var client = new calcService.CalculatorServiceClient(address, credentials)

    var primeNumberDecompositionRequest = new calc.PrimeNumberDecompositionRequest()
    primeNumberDecompositionRequest.setPrimeNumber(100000000)


    var call = client.primeNumberDecomposition(primeNumberDecompositionRequest, (error, response) => {
        if (!error) {
            console.log("Prime Number Response: ", response.getPrimeFactor());
        } else {
            console.error(error)
        }
    })

    call.on('status', (status) => { console.log(status); })

    call.on('data', (response) => { console.log('Client Streaming Response: ', response.getPrimeFactor()); })

    call.on('error', (error) => { console.error(error); })

    call.on('end', () => { console.log('Streaming Ended!'); })
}

function main() {
    console.log('Hello from Client')

    callPrimeNumberDecomposition()
}

main()