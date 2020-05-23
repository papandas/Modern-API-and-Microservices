const grpc = require('grpc');
const path = require('path')
const protoLoader = require('@grpc/proto-loader');


let address = 'localhost:50051';
if (process.env.SERVER_ADDRESS) {
    address = process.env.SERVER_ADDRESS;
}

const credentials = grpc.credentials.createInsecure();

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


function callSum() {
    const client = new calcPackageDefinition.CalculatorService(address, credentials)

    //console.log("Client", client)

    var request = {
        first_number: 30,
        second_number: 100
    }

    client.sum(request, (error, response) => {
        if (!error) {
            console.log("Client Sum Resonse: ", response.sum_result);
        } else {
            console.error(error)
        }
    })
}


function callPrimeNumberDecomposition() {
    const client = new calcPackageDefinition.CalculatorService(address, credentials)

    var request = { prime_number: 150 }

    var call = client.primeNumberDecomposition(request, (error, response) => {
        if (!error) {
            console.log("Prime Number Response: ", response.prime_factor);
        } else {
            console.error(error)
        }
    })

    call.on('status', (status) => { console.log(status); })

    call.on('data', (response) => { console.log('Client Streaming Response: ', response.prime_factor); })

    call.on('error', (error) => { console.error(error); })

    call.on('end', () => { console.log('Streaming Ended!'); })
}

function main() {
    console.log('Hello from Client')
    console.log("Server Address", address)

    callSum()
    callPrimeNumberDecomposition()
}

main()