## Local Deployment on Docker Desktop.
To run the project from the root, have a docker desktop daemon running, then run:

`docker-compose up -d`

To stop the project and tear down the containers

`docker-compose down`

You can access the frontend of the application through a web browser from the URL: `127.0.0.1:8000`.

## Admin Account Elevation
To elevate a user account to an admin status for question creation:

1. Have docker desktop already running the project containers.
2. Create an account through the frontend.
3. Open Docker Desktop > Containers > user-db > "Exec" Tab.
4. Run the following commands line by line and replace CREATED_USERNAME with the username of the created account.

```
mongosh
use user_db
var adminid = db.roles.findOne({name:'admin'}, {_id:1})._id
db.users.updateOne({ username: '<CREATED_USERNAME>' }, { $set: { roles: [adminid] } }) 
```

E.g. If we have created an account with the username "admin123", then the last command will be:
`db.users.updateOne({ username: 'admin123' }, { $set: { roles: [adminid] } })`