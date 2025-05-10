# Backend

- Recommended IDE: IntelliJ IDEA CE
- Java Version: Java SE 21
- Build Automation Tool: Maven
- API Localhost Testing: http://localhost:8080/swagger-ui/index.html#/
- API Deployment Testing: Postman
- Source Control Visualization: Sourcetree
- Database Local Access: see application.properties
- Email Address: flowchat.noreply@gmail.com
- Email Password: see application.properties
- Email App Password: see application.properties


## General Structure
- Work Flow/ : Work flow diagrams
- Database/ : Database schema and SQL code
- src/main/java/project/flowchat/backend/ : Program Source
  - Model/ stores object types that match with database attributes
  - User ResponseBody instead of a new Model Class to create each API