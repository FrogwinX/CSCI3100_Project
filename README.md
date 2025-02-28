# Backend

- Recommended IDE: IntelliJ IDEA CE
- Java Version: Java SE 21
- Build Automation Tool: Maven
- API Localhost Testing: http://localhost:8080/swagger-ui/index.html#/
- API Deployment Testing: Postman
- Source Control Visualization: Sourcetree
- Database Local Access:
  - Username: flowchatadmin
  - Password: joccy8-qackyw-riVvaf


## Account Management
For each API requirement, please refer to corresponding issue.

![Account Management Flow](https://github.com/FrogwinX/CSCI3100_Project/blob/backend/Work%20Flow/Account.png)

![Account Management DB](https://github.com/FrogwinX/CSCI3100_Project/blob/backend/Database/ACCOUNT.png)


## General Structure
- Work Flow/ : Work flow diagrams
- Database/ : Database schema and SQL code
- src/main/java/project/flowchat/backend/ : Program Source
  - Model/ stores object types that match with database attributes
  - User ResponseBody instead of a new Model Class to create each API

![Project Structure](https://github.com/FrogwinX/CSCI3100_Project/blob/backend/Work%20Flow/Backend_Structure.png)
