const greet = require('../server/protos/greet_pb')
const greetService = require('../server/protos/greet_grpc_pb');

const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc')

const address = 'localhost:50051';
const credentials = grpc.credentials.createInsecure();

//const services = require('../server/protos/dummy_grpc_pb')

function callGreetings() {
    var client = new greetService.GreetServiceClient(
        'localhost:50051',
        grpc.credentials.createInsecure()
    )

    var request = new greet.GreetRequest()
    var greeting = new greet.Greeting()
    greeting.setFirstName("Papan")
    greeting.setLastName("Das")

    request.setGreeting(greeting)




    client.greet(request, (error, response) => {
        if (!error) {
            console.log("Greeting Resonse: ", response.getResult());
        } else {
            console.error(error)
        }
    })
}

function callSum() {
    var client = new calcService.CalculatorServiceClient(address, credentials)

    var sumRequest = new calc.SumRequest()
    sumRequest.setFirstNumber(3)
    sumRequest.setSecondNumber(10)

    client.sum(sumRequest, (error, response) => {
        if (!error) {
            console.log("Greeting Resonse: ", response.getSumResult());
        } else {
            console.error(error)
        }
    })
}

function main() {
    console.log('Hello from Client')

    //callGreetings()
    callSum();


}

main()