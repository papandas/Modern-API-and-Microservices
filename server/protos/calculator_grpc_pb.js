// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var protos_calculator_pb = require('../protos/calculator_pb.js');

function serialize_calculator_SumRequest(arg) {
  if (!(arg instanceof protos_calculator_pb.SumRequest)) {
    throw new Error('Expected argument of type calculator.SumRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_SumRequest(buffer_arg) {
  return protos_calculator_pb.SumRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_calculator_SumResponse(arg) {
  if (!(arg instanceof protos_calculator_pb.SumResponse)) {
    throw new Error('Expected argument of type calculator.SumResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_calculator_SumResponse(buffer_arg) {
  return protos_calculator_pb.SumResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var CalculatorServiceService = exports.CalculatorServiceService = {
  // Unary API
sum: {
    path: '/calculator.CalculatorService/Sum',
    requestStream: false,
    responseStream: false,
    requestType: protos_calculator_pb.SumRequest,
    responseType: protos_calculator_pb.SumResponse,
    requestSerialize: serialize_calculator_SumRequest,
    requestDeserialize: deserialize_calculator_SumRequest,
    responseSerialize: serialize_calculator_SumResponse,
    responseDeserialize: deserialize_calculator_SumResponse,
  },
};

exports.CalculatorServiceClient = grpc.makeGenericClientConstructor(CalculatorServiceService);
