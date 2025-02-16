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


## System

- GET : `https://flowchatbackend.azurewebsites.net/api/System/getAllInfo`  

Description: get all system information, including version, feature and description  
Query Params:  None  
Path Params: None  
Response Body:  

>[  
>&nbsp;&nbsp;&nbsp;&nbsp;{  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"version": "0.1",  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"feature": "Project Initilization",  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"description": "Setup a database table for storing system info"  
>&nbsp;&nbsp;&nbsp;&nbsp;}  
>]

---

- GET : `https://flowchatbackend.azurewebsites.net/api/System/getInfoByVersion?version={version}`

Description: get the system information, including version, feature and description, by a specified version  
Query Params: version={version}  
Path Params: None  
Response Body:  

>[  
>&nbsp;&nbsp;&nbsp;&nbsp;{  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"version": "0.1",  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"feature": "Project Initilization",  
>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"description": "Setup a database table for storing system info"  
>&nbsp;&nbsp;&nbsp;&nbsp;}  
>]  
