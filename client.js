const grpc = require("grpc");
const protoLoader = require("@grpc/proto-loader");
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const text = process.argv[2];

console.log(text);
const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

client.createTodo({
    "id": -1,
    "text": text
}, (err, response) => {
    console.log("Received from server " + JSON.stringify((response)));
});

// client.readTodos({}, (err, response) => {
//     console.log("read the todos from server " + JSON.stringify((response)));
//     // response.items.forEach((a) => console.log(a.text));
    
// });

const call = client.readTodosStream();
call.on("data", item => {
    console.log("Received item from server " + JSON.stringify(item));
});

call.on("end", e => console.log("server done!"));