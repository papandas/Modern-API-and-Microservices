const greet = require('../server/protos/greet_pb')
const greetService = require('../server/protos/greet_grpc_pb');

const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc');
const path = require('path')
const protoLoader = require('@grpc/proto-loader');

const port = "127.0.0.1:50051";
const creds = grpc.ServerCredentials.createInsecure();

// Dynamic loading Proto buf
const greetProtoPath = path.join(__dirname, "..", "protos", "greet.proto")
const greetProtoDefinition = protoLoader.loadSync(greetProtoPath, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
})
const greetPackageDefinition = grpc.loadPackageDefinition(greetProtoDefinition).greet;

/**
 * Implementing Calculator method
 * @param {*} call 
 * @param {*} callback 
 */

function sum(call, callback) {
    var sumResponse = new calc.SumResponse();

    sumResponse.setSumResult(call.request.getFirstNumber() + call.request.getSecondNumber())

    callback(null, sumResponse)
}

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


/**
 * Implement GRPC greet  method
 */

function greetFunc(call, callback) {
    var greeting = new greet.GreetResponse()

    console.log("Server Received: ", call.request.getGreeting().getFirstName(), call.request.getGreeting().getLastName())

    greeting.setResult(
        "Hello " + call.request.getGreeting().getFirstName()
    )

    callback(null, greeting)
}

function dynamicGreetFunc(call, callback) {
    let firstName = call.request.greeting.first_name;
    let lastName = call.request.greeting.last_name;

    console.log("Server Received: " + firstName + " " + lastName)

    callback(null, { result: "Hello " + firstName + " " + lastName })
}


function greetManyTimes(call, callback) {
    let firstName = call.request.getGreeting().getFirstName()
    let lastName = call.request.getGreeting().getLastName()



    let count = 0,
        intervalId = setInterval(function() {
            let greetManyTimeResponse = new greet.GreetManyTimesResponse()
            greetManyTimeResponse.setResult(firstName, lastName)

            // setup streaming

            call.write(greetManyTimeResponse)

            if (++count > 9) {
                clearInterval(intervalId)
                call.end()
            }
        }, 1000)
}

function main() {
    const server = new grpc.Server()

    // const serviceDefinition = greetService.GreetServiceService
    server.addService(greetService.GreetServiceService, { greet: greetFunc, greetManyTimes: greetManyTimes })
        //server.addService(greetPackageDefinition.GreetService.service, { greet: dynamicGreetFunc })
    server.addService(calcService.CalculatorServiceService, { sum: sum, primeNumberDecomposition: primeNumberDecomposition })

    server.bind(port, creds)
    server.start()

    console.log(`Server running on port ${port}`)
}

main()