# PeerPrep
## Local Deployment on Docker Desktop
### Instructions
To run the project:
1. Ensure a Docker daemon is running
2. `cd` to the root of the project
3. In a terminal run:
    * `docker-compose up`, or,
    * `docker-compose up -d` to run in detached mode

To tear down the project
1. In a terminal, run:
    * `docker-compose down`

Access the application in a web browser at the URL `127.0.0.1:8080`.

## Admin Account Elevation
### Instructions
To elevate a user to an `admin` role
1. Execute the following commands in the integrated terminal of the running `user-db` container (On Docker Desktop, go to "Containers" > "user-db" > "Exec"):
    * `mongosh`
    * `use user_db`
    * `var adminid = db.roles.findOne({name:'admin'}, {_id:1})._id`
    * `db.users.updateOne({ username: '<CREATED_USERNAME>' }, { $set: { roles: [adminid] } })`

(_where_ `<CREATED_USERNAME>` _is the username of an existing user to be elevated to an `admin` role_)
