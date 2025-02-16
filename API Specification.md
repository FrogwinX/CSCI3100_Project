# RESTful API Specification

Basic API Structure: `https://flowchatbackend.azurewebsites.net/api/`

All APIs that are successfully deployed will be listed in the following.
Currently, there is NO authorization key for calling the APIs.

---

API Development Process: 
- Frontend designs the API requirements in separate comments before a new feature development period
- After API designs, API building tasks (issues) are formed for backend developement in `ready` section
- Frontend can raise any API design requests (issues) with a tag "API" in the `ready` section
- After API developments, the APIs will be tested via Postman in `review` section
- After API testings, the API specification will be listed here
- If frontend cannot successfully call the API, please leave comments in the corresponding API design issues in `done` section


## System

1. `GET` : https://flowchatbackend.azurewebsites.net/api/System/getAllInfo
Description: get all system information, including version, feature and description
Query Params: None
Path Params: None
Response Body:
<code>
[
    {
        "version": "0.1",
        "feature": "Project Initilization",
        "description": "Setup a database table for storing system info"
    }
]
</code>

2. `GET` : https://flowchatbackend.azurewebsites.net/api/System/getInfoByVersion?version={version}
Description: get the system information, including version, feature and description, by a specified version
Query Params: version={version}
Path Params: None
Response Body:
<code>
[
    {
        "version": "0.1",
        "feature": "Project Initilization",
        "description": "Setup a database table for storing system info"
    }
]
</code>