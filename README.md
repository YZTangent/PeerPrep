# PeerPrep
### ay2324s1-course-assessment-g40

[**PeerPrep**](https://peerprep.yuanzheng.pro) is a platform on which users are able to prepare for technical interviews by matching with peers and practicing interview questions in a collaborative space.

The cloud deployment of [**PeerPrep**](https://peerprep.yuanzheng.pro) is available at https://peerprep.yuanzheng.pro. 

_PeerPrep was developed as part of **AY23/24S1 CS3219 Software Engineering Principles and Patterns** by Group 40 ([Chia Yu Hong](https://github.com/chia-yh), [Chinthakayala Jyothika Siva Sai](https://github.com/cjyothika), [Justin Widodo](https://github.com/GenFusion122), [Tan Yuan Zheng](https://github.com/YZTangent), [Xu Richard Chengji](https://github.com/itsrx))_

## Repository Structure
The main structure of the repository consists of three sub-directories, `/frontend`, `/api-gateway`, and `/backend`.

Additionally, [Github Actions](https://docs.github.com/en/actions) workflows for configuring the CI/CD pipeline are located under the `/.github/workflows` directory, the `/gke` directory contains the `.yaml` files for deploying on the [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine?hl=en), the `/question-fetcher` directory contains files for the serverless function, and the `docker-compose.yml` file for local deployment is located in the project root.

#### `/frontend`
The `/frontend` sub-directory contains files relevant to the [Angular](https://angular.io/) frontend. This sub-directory has most of its config files under `/frontend/src`, while the rest of the files are under the `/frontend/src/app` directory. These files are organised as follows:
- `/_guards`: authentication and role guards on routes
- `/_helpers`: HTTP request interceptor helper
- `/_services`: `___.service.ts` files for handling different services
- `/<component>`: containing the `___.component.css`, `___.component.html`, `___.component.spec.ts`, `___.component.ts` files for each component
- `app` files that define the "root" of the Angular frontend

#### `/api-gateway`
The `/api-gateway` sub-directory contains files relevant to the API gateway, implemented with [NGINX](https://www.nginx.com/). It contains the `.conf` files necessary for configuring the API Gateway, as well as the `Dockerfile` for building the image of the API Gateway.

#### `/backend`
The `/backend` sub-directory contains files relevant to the microservices that make up the backend of PeerPrep. Each `/backend/___-service` directory is generally structured as follows:
- `/config`: the relevant config files, such as `db.config.js`
- `/controllers`: the `___.controller.js` files defining the methods used by the microservice
- `/models`: relevant files defining the models used by the microservice
- `/routes`: `___.routes.js` files defining the routes exposed by the microservice
- `Dockerfile`: defines how the image of the microservice is built
- `index.js`: handles startup and configuration of the microservice with the relevant files

The structure of each microservice may differ from this general structure in the case that some parts are not relevant to the function of the microservice.

#### `/gke`
The `/gke` directory contains sub-directories for deploying the API gateway and each of the microservices on the [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine?hl=en). Each sub-directory contains `___-deployment.yaml` and `___.service.yaml` files for deploying a Deployment and Service respectively. The API gateway additionally has an `api-gateway-ingress.yaml` file for configuring an ingress for routing external traffic into the API gateway.

#### `/question-fetcher`
The `/question-fetcher` directory contains the `function.js` file, which defines the serverless function that is deployed on Google Cloud Platform (GCP). 

## Deployment
**PeerPrep** supports both local deployment with [Docker Compose](https://docs.docker.com/compose/), for development and testing purposes, and cloud deployment with [Vercel](https://vercel.com/) (Frontend) and [Google Kubernetes Engine (GKE)](https://cloud.google.com/kubernetes-engine?hl=en) (API Gateway + Microservices).

### Local Deployment
#### Requirements
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
#### Instructions
_To run the project_:
1. Ensure a Docker daemon is running
2. `cd` to the root of the project
3. In a terminal run:
    * `docker-compose up`, or,
    * `docker-compose up -d` to run in detached mode

The locally deployed **PeerPrep** may be accessed in a web browser at the URL [`127.0.0.1:8000`](http://127.0.0.1:8000).

_To tear down the project:_
1. In a terminal, run:
    * `docker-compose down`

_To elevate a user to an_ `admin` _role:_
1. Execute the following commands in the integrated terminal of the running `user-db` container (On Docker Desktop, go to "Containers" > "`user-db`" > "Exec"):
    * `mongosh`
    * `use user_db`
    * `var adminid = db.roles.findOne({name:'admin'}, {_id:1})._id`
    * `db.users.updateOne({ username: '<CREATED_USERNAME>' }, { $set: { roles: [adminid] } })`

(_where_ `<CREATED_USERNAME>` _is the username of an existing user to be elevated to an `admin` role_)

### Cloud Deployment
#### Requirements
- Set up a Google Cloud project
- Set up a cluster in the project
- Set up a repository in the Artifact Registry
- Set up a service account with sufficient permissions
    * _For reference, **PeerPrep** uses a service account with the following roles:_
        - Artifact Registry Reader
        - Artifact Registry Repository Administrator
        - Artifact Registry Service Agent
        - Artifact Registry Writer
        - Editor
        - Kubernetes Engine Service Agent
        - Security Reviewer
        - Service Account Token Creator
        - Service Usage Admin
- Generate a service account key for the service account
- Set up MongoDB Atlas account
#### Instructions
_Frontend Cloud Deployment:_
1. 

_Backend Cloud Deployment:_
1. Configure the following GitHub repository secrets ("Settings" > "Security" > "Secrets and variaboles" > "Actions"):
    * `GKE_PROJECT`: the ID of the Google Cloud Project set up 
    * `GKE_SA_KEY`: the generated service account key for the service account with sufficient permissions
2. In each `deploy-___.yml` file of the `/.github/workflows` directory, configure each of the `GKE_CLUTER`, `GKE_ZONE`, `REPOSITORY_NAME` as per the setup in "Requirements"
3. Under "Secrets & ConfigMaps" on GKE, configure a `db-admin` secret for the created cluster with `db-username` and `db-password` matching the username and password of the MongoDB Atlas account
4. Configure the `image` in each of the `.yaml` files under `./gke` to point to the appropriate image in the repository on the Artifact Registry
5. Manually trigger the deployment workflows for each component under "Actions", or have them trigger on changes to the relevant files

### Serverless Function
#### Requirements
#### Instructions
