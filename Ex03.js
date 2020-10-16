//Example for creating JSON Rest server....
const app = require('express')();
const parser = require("body-parser");
const cors = require('cors');
const fs = require("fs");
const dir = __dirname;


//middleware....
app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(cors());//use the Cors so that it enables CORS...

//GET(Reading), POST(Adding), PUT(Updating), DELETE(Deleting) data....
let employees = [];//blank array...

function readData(){
    const filename = "data.json";//new file... 
    const jsonContent = fs.readFileSync(filename, 'utf-8');
    employees = JSON.parse(jsonContent);
}

function saveData(){
    const filename = "data.json";
    const jsonData = JSON.stringify(employees);
    fs.writeFileSync(filename, jsonData, 'utf-8');
}
app.get("/employees", (req, res)=>{
    readData();
    res.send(JSON.stringify(employees));    
})

app.get("/employees/:id", (req, res)=>{
    const empid = req.params.id;
    if(employees.length == 0){
        readData();
    }
    let foundRec = employees.find((e) => e.empId == empid);
    if(foundRec == null)
        throw "Employee not found";
    res.send(JSON.stringify(foundRec))
})

app.put("/employees", (req, res)=>{
    if(employees.length == 0)
        readData();//Fill the array if it is not loaded....
    let body = req.body;
    //iterate thro the collection
    for (let index = 0; index < employees.length; index++) {
        let element = employees[index];
        if (element.empId == body.empId) {//find the matching record
            element.empName = body.empName;
            element.empAddress = body.empAddress;
            element.empSalary = body.empSalary;
            saveData();
            res.send("Employee updated successfully");
        }
    }
    //update the data
    //exit the function....
})

app.post('/employees', (req, res)=>{
    if (employees.length == 0)
        readData();//Fill the array if it is not loaded....
    let body = req.body;//parsed data from the POST...
    employees.push(body);  
    saveData();//updating to the JSON file...
    res.send("Employee added successfully");
})
app.delete("/employees/:id", (req, res)=>{
  throw "Do it UR Self!!!!";  
})

app.listen(1234, ()=>{
    console.log("Server available at 1234");
})