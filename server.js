
const ps = require("prompt-sync");
const prompt = ps();
const http = require("https");

//Session to use on later purposes
var sessionId = ""

//Creating a function to pass on URL, Method Type and Session ID
//https://www.famark.com/host/api.svc/api
const  url = (path, sessionId) => {
  var options = {
    host: "www.famark.com",
    path: "/host/api.svc/api" + path,
    method: 'POST',
    headers: {
      "SessionId" : sessionId,
      "Content-Type": "application/json; charset=UTF-8",
      "Accept" : "application/json; charset=UTF-8"
    }
  };
  return options;
};

//Login request and getting reponse
function login() {
  
  //Assigning Credentials
  let DomainName = prompt("Enter Domain Name: ");
  let UserName = prompt("Enter UserName: ");
  let Password = prompt("Enter Password: ");

  //Convert Credentials to JSON
  const Creds = JSON.stringify({
    DomainName,
    UserName,
    Password,
  });

  let data = url("/Credential/Connect", null)

  //Posting Credentials in URL and generating response SessionID
  let httpLoginRequest = http.request(data, (response) => {
    console.log("statusCode:", response.statusCode);
    console.log("headers:", response.headers);
  
    response.on("data", (d) => {
      sessionId = JSON.parse(d)
      console.log('Session ID : ', sessionId)
    });
  });

  httpLoginRequest.on("error", (error) => {
    console.log("An error", error);
  });

  httpLoginRequest.write(Creds);

  httpLoginRequest.end(); //End HTTP Request
}

//Create a New Record
function createRecord() {

  let ans = prompt("Do you want to create new Record? (Y or N) ");

  if(ans == "Y" || ans == "y") {
    let data = url("/Business_Contact/CreateRecord", sessionId);
  
    let FirstName = prompt("Enter First Name: ");
    let LastName = prompt("Enter Last Name: ");
    let Phone = prompt("Enter Phone:  ");
    let Email = prompt("Enter Email: ")

    let Contact =  JSON.stringify({
      FirstName : FirstName,
      LastName : LastName,
      Phone : Phone,
      Email : Email
    });

    let httpPostRequest = http.request(data, (response) => {

      response.on("data", (d) => {
        process.stdout.write(d);
      });

    });

    httpPostRequest.on("error", (error) => {
      console.log("An error: ", error.message);
    });

    httpPostRequest.write(Contact);

    httpPostRequest.end();

    console.log("New Record Created");
  
  }
}

function retreiveRecord() {

  //Listing desired data
  let list = JSON.stringify({
    Columns : 'FullName, Phone, Email, Business_ContactId',
    OrderBy : 'FullName'
  })
  
  let data = url("/Business_Contact/RetrieveMultipleRecords", sessionId)
  
  let httpGetRequest = http.request(data, (response) => {

    response.on("data", (d) => {
      console.log(JSON.parse(d));
    });

  }) 
  .on("error", (error) => {

    console.log("Error in Retreiving: ", error);

  })

  httpGetRequest.write(list);
  httpGetRequest.end();

};

//f0d51aad-7182-4e33-ba54-3a35c782b00a

function deleteRecord() {

  let ans = prompt("Do you want to Delete Record?(Y or N)");

  if(ans == "Y" || ans == "y") {

    var recordId = prompt("Enter Record Id: ");

    //Listing desired data
    let list = JSON.stringify({
      Business_ContactId : recordId
    })
  
    let data = url("/Business_Contact/DeleteRecord", sessionId)
  
    let httpGetRequest = http.request(data, (response) => {

      response.on("data", (d) => {
        console.log(JSON.parse(d));
      });

    }) 
    .on("error", (error) => {

      console.log("Error in Retreiving: ", error);

    })

    httpGetRequest.write(list);
    httpGetRequest.end();

  }

};

login();

setTimeout(createRecord, 1000);
setTimeout(deleteRecord, 1500);
setTimeout(retreiveRecord, 1500);
// setTimeout(deleteRecord, 1000);

// 7d86fc99-6c26-4067-9664-2c64165838d1