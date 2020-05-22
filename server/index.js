const greet = require('../server/protos/greet_pb')
const greetService = require('../server/protos/greet_grpc_pb');

const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grps = require('grpc');

const port = "127.0.0.1:50051";
const creds = grps.ServerCredentials.createInsecure();

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

function main() {
    var server = new grps.Server()

    // const serviceDefinition = greetService.GreetServiceService
    //server.addService(greetService.GreetServiceService, { greet: greetFunc })
    server.addService(calcService.CalculatorServiceService, { sum: sum })

    server.bind(port, creds)
    server.start()

    console.log(`Server running on port ${port}`)
}

main()