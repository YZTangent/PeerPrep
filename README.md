# PeerPrep
### ay2324s1-course-assessment-g40

[**PeerPrep**](https://peerprep.yuanzheng.pro) is a platform on which users are able to prepare for technical interviews by matching with peers and practicing interview questions in a collaborative space.

The cloud deployment of [**PeerPrep**](https://peerprep.yuanzheng.pro) is available at https://peerprep.yuanzheng.pro. 

_PeerPrep was developed as part of **AY23/24S1 CS3219 Software Engineering Principles and Patterns** by Group 40 ([Chia Yu Hong](https://github.com/chia-yh), [Chinthakayala Jyothika Siva Sai](https://github.com/cjyothika), [Justin Widodo](https://github.com/GenFusion122), [Tan Yuan Zheng](https://github.com/YZTangent), [Xu Richard Chengji](https://github.com/itsrx))_

## Repository Structure
The structure of the repository consists of three sub-directories, `/frontend`, `/api-gateway`, and `/backend`

#### `/frontend`
The `/frontend` sub-directory contains files relevant to the [Angular](https://angular.io/) frontend. This sub-directory has most of its config files under `/frontend/src`, while the rest of the files are under the `/frontend/src/app` directory. These files are organised as follows:
- `/_guards`: authentication and role guards on routes
- `/_helpers`: HTTP request interceptor helper
- `/_services`: `___.service.ts` files for handling different services
- `/<component>`: containing the `___.component.css`, `___.component.html`, `___.component.spec.ts`, `___.component.ts` files for each component
- `app` files that define the "root" of the Angular frontend

#### `/api-gateway`
The `/api-gateway` sub-directory contains files relevant to the API gateway, implemented with [NGINX](https://www.nginx.com/). It contains the `.conf` files necessary for configuring the API gateway, as well as the `Dockerfile` for building the image of the API gateway.

#### `/backend`
The `/backend` sub-directory contains files relevant to the microservices that make up the backend of PeerPrep. Each `/backend/___-service` directory is generally structured as follows:
- `/config`: the relevant config files, such as `db.config.js`
- `/controllers`: the `___.controller.js` files defining the methods used by the microservice
- `/models`: relevant files defining the models used by the microservice
- `/routes`: `___.routes.js` files defining the routes exposed by the microservice
- `Dockerfile`: defines how the image of the microservice is built
- `index.js`: handles startup and configuration of the microservice with the relevant files

The structure of each microservice may differ from this general structure in the case that some parts are not relevant to the function of the microservice.

## Deployment
**PeerPrep** supports both local deployment with [Docker Compose](https://docs.docker.com/compose/), for development and testing purposes, and cloud deployment with [Vercel](https://vercel.com/) (Frontend) and [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine?hl=en) (API Gateway + Microservices)

### Local Deployment


### Cloud Deployment


### Serverless Function


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
