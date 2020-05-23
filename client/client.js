const greet = require('../server/protos/greet_pb')
const greetService = require('../server/protos/greet_grpc_pb');

const calc = require('../server/protos/calculator_pb');
const calcService = require('../server/protos/calculator_grpc_pb');

const grpc = require('grpc');
const address = 'localhost:50051';
const credentials = grpc.credentials.createInsecure();


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

function callLongGreet() {
    var client = new greetService.GreetServiceClient(address, credentials)

    var request = new greet.LongGreetRequest()

    var call = client.longGreet(request, (error, response) => {
        if (!error) {
            console.log("Greeting Resonse: ", response.getResult());
        } else {
            console.error(error)
        }
    })

    let count = 0,
        intervalId = setInterval(function() {
            var greeting = new greet.Greeting()
            greeting.setFirstName("PapanLongGreet")
            greeting.setLastName("DasLongGreet")

            request.setGreeting(greeting)

            call.write(request)

            if (++count > 9) {
                clearInterval(intervalId)
                call.end()
            }
        }, 1000)

    call.on('status', (status) => { console.log(status); })

    call.on('data', (response) => { console.log('Client Streaming Response: ', response.getResult()); })

    call.on('error', (error) => { console.error(error); })

    call.on('end', () => { console.log('Streaming Ended!'); })
}

async function sleep(interval) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), interval)
    })
}

async function callGreetEveryone() {
    var client = new greetService.GreetServiceClient(address, credentials)

    var call = client.greetEveryone(request, (error, response) => {
        if (!error) {
            console.log("Greet Everyone Response: ", response.getResult());
        } else {
            console.error(error)
        }
    })

    call.on('status', (status) => { console.log(status); })

    call.on('data', (response) => { console.log('Client: Greet Everyone Response: ', response.getResult()); })

    call.on('error', (error) => { console.error(error); })

    call.on('end', () => { console.log('Client Ended!'); })

    for (var i = 0; i < 10; i++) {
        var greeting = new greet.Greeting();
        greeting.setFirstName(`ClientPapan${i}`)
        greeting.setLastName(`ClientDas${i}`)


        var request = new greet.GreetEveryoneRequest();
        request.setGreeting(greeting)

        call.write(request)

        await sleep(1500)
    }

    call.end()
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

function callComputeAverage() {
    var client = new calcService.CalculatorServiceClient(address, credentials)

    var request = new calc.ComputeAverageRequest()

    var call = client.computeAverage(request, (error, response) => {
        if (!error) {
            console.log("Client: Compute Average Resonse: ", response.getAverageResult());
        } else {
            console.error(error)
        }
    })

    let count = 0,
        intervalId = setInterval(function() {

            request.setStreamNumber(++count)

            call.write(request)

            if (count > 9) {
                clearInterval(intervalId)
                call.end()
            }
        }, 1000)

    call.on('status', (status) => { console.log(status); })

    call.on('data', (response) => { console.log('Client: Response: ', response.getAverageResult()); })

    call.on('error', (error) => { console.error(error); })

    call.on('end', () => { console.log('Servering Streaming Ended!'); })
}

async function callFindMaximum() {
    var client = new calcService.CalculatorServiceClient(address, credentials)

    var call = client.findMaximum(request, (error, response) => {
        if (!error) {
            console.log("Client: Compute Average Resonse: ", response.getMaximum());
        } else {
            console.error(error)
        }
    })

    call.on('status', (status) => { console.log(status); })

    call.on('data', (response) => { console.log('Client: Response: ', response.getMaximum()); })

    call.on('error', (error) => { console.error(error); })

    call.on('end', () => { console.log('Servering Streaming Ended!'); })

    let data = [3, 4, 5, 13, 14, 15, 2, 3, 4, 23, 24, 25]

    for (var i = 0; i < data.length; i++) {
        var request = new calc.FindMaximumRequest()
        request.setNumber(data[i])

        console.log("Sending Number to Server", data[i])

        call.write(request)

        await sleep(2000)
    }

    call.end()
}

function main() {
    console.log('Hello from Client')

    //callGreetings()
    //callDynamicGreetings()
    //callGreatManyTimes()
    //callLongGreet()
    //callSum();
    //callPrimeNumberDecomposition()
    //callComputeAverage();
    callFindMaximum();
    //callGreetEveryone();


}

main()