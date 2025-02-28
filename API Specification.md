# RESTful API Specification

Basic API Structure: `https://flowchatbackend.azurewebsites.net/api/`

All APIs that are successfully deployed will be listed in the following.
Currently, there is NO authorization key for calling the APIs.

API Development Process: 
1. Frontend designs the API requirements in separate comments before a new feature development period
2. After API designs, API building tasks (issues) are formed for backend developement in `ready` section
3. Frontend can raise any API design requests (issues) with a tag "API" in the `ready` section
4. After API developments, the APIs will be tested via Postman in `review` section
5. After API testings, the API specification will be listed here
6. If frontend cannot successfully call the API, please leave comments in the corresponding API design issues in `done` section

## Account

- POST : `https://flowchatbackend.azurewebsites.net/api/Account/registerAccount`  

Description: register a new account  
Query Params: None  
Path Params: None  

Request Body :  
>{  
>&emsp;"username": "edwinlamtk",  
>&emsp;"email": "edwinlamtk@gmail.com",  
>&emsp;"password": "edwinlamtk",  
>&emsp;"licenseKey": "N1SM9K4AZF90F1PU"  
>}  

Response Body:  

>{  
>&emsp;"message": "A new account is created",  
>&emsp;"data": {  
>&emsp;&emsp;"user": {  
>&emsp;&emsp;&emsp;"role": "user",  
>&emsp;&emsp;&emsp;"id": 14,  
>&emsp;&emsp;&emsp;"username": "edwinlamtk"  
>&emsp;&emsp;},  
>&emsp;&emsp;"isSuccess": true  
>&emsp;}  
>}  


---

- POST : `https://flowchatbackend.azurewebsites.net/api/Account/requestAuthenticationCode`  

Description: generate, save and send a new 6-digit authentication code to user  
Query Params: None  
Path Params: None  

Request Body :  
{  
&emsp;"email": "edwinlamtk@gmail.com"  
}  

Response Body:  
 
>{  
>&emsp;"message": "Cannot create a new authentication code",  
>&emsp;"data": {  
>&emsp;&emsp;"isSuccess": false  
>&emsp;}  
>}

---

- GET : `https://flowchatbackend.azurewebsites.net/api/Account/isEmailUnique?email={email}`  

Description: check if the input email is unique with all user accounts  
Query Params: email={email}  
Path Params: None  
Response Body:  

>{  
>&emsp;"message":"The email is unique",  
>&emsp;"data": {  
>&emsp;&emsp;"isEmailUnique": true    
>&emsp;}  
>}  

>{  
>&emsp;"message":"The email is not unique",  
>&emsp;"data": {  
>&emsp;&emsp;"isEmailUnique": false  
>&emsp;}  
>}

---

- GET : `https://flowchatbackend.azurewebsites.net/api/Account/isUsernameUnique?username={username}`  

Description: check if the input username is unique with all user accounts  
Query Params: username={username}  
Path Params: None  
Response Body:  

>{  
>&emsp;"message":"The username is unique",  
>&emsp;"data": {  
>&emsp;&emsp;"isUsernameUnique": true    
>&emsp;}  
>}

>{  
>&emsp;"message":"The username is not unique",  
>&emsp;"data": {  
>&emsp;&emsp;"isUsernameUnique": false  
>&emsp;}  
>}

---

## System

- GET : `https://flowchatbackend.azurewebsites.net/api/System/getAllInfo`  

Description: get all system information, including version, feature and description  
Query Params:  None  
Path Params: None  
Response Body:  

>{  
>&emsp;"message":"Success",  
>&emsp;"data": [  
>&emsp;&emsp;{  
>&emsp;&emsp;&emsp;"feature": "Project Initilization",  
>&emsp;&emsp;&emsp;"description": "Setup a database table for storing system info",  
>&emsp;&emsp;&emsp;"version": "0.1"  
>&emsp;&emsp;}  
>&emsp;]  
>}  

---

- GET : `https://flowchatbackend.azurewebsites.net/api/System/getInfoByVersion?version={version}`

Description: get the system information, including version, feature and description, by a specified version  
Query Params: version={version}  
Path Params: None  
Response Body:  

>{  
>&emsp;"message":"Success",  
>&emsp;"data": {  
>&emsp;&emsp;"feature": "Project Initilization",  
>&emsp;&emsp;"description": "Setup a database table for storing system info",  
>&emsp;&emsp;"version": "0.1"  
>&emsp;}  
>}  
