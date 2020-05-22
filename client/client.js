const greet = require('../server/protos/greet_pb')
const greetService = require('../server/protos/greet_grpc_pb');

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

const services = require('../server/protos/dummy_grpc_pb')

function callGreetings() {
    var client = new greetService.GreetServiceClient(address, credentials)

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

function callDynamicGreetings() {
    const client = new greetPackageDefinition.GreetService(address, credentials)

    var request = {
        greeting: {
            first_name: "DynamicPapan",
            last_name: "DynamicDas"
        }
    }

    client.greet(request, (error, response) => {
        if (!error) {
            console.log("Greeting Resonse: ", response.result);
        } else {
            console.error(error)
        }
    })
}

function callGreatManyTimes() {
    var client = new greetService.GreetServiceClient(address, credentials)

    var request = new greet.GreetManyTimesRequest()
    var greeting = new greet.Greeting()
    greeting.setFirstName("PapanManyTimes")
    greeting.setLastName("DasManyTimes")

    request.setGreeting(greeting)

    var call = client.greetManyTimes(request, (error, response) => {
        if (!error) {
            console.log("Greeting Resonse: ", response.getResult());
        } else {
            console.error(error)
        }
    })

    call.on('status', (status) => { console.log(status); })

    call.on('data', (response) => { console.log('Client Streaming Response: ', response.getResult()); })

    call.on('error', (error) => { console.error(error); })

    call.on('end', () => { console.log('Streaming Ended!'); })
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

    //callGreetings()
    //callDynamicGreetings()
    //callGreatManyTimes()
    //callSum();
    callPrimeNumberDecomposition()


}

main()