# Exercise to deploy MonggoDB & Monggo Express

## Namespace

I have created a namespace **ahlay-namespace**, see [namespace.yml](./templates/namespace.yml). It is an idea to group related resources. The namespace was created by run below kubectl command:

> kubectl apply -f templates/namespace.yml

Note: I tried to relate what I did with *openshift-template.yml* before. So that I placed all the yaml files into a templates folder.

## Prerequisite of mongo

I tried to use [mongo image](https://hub.docker.com/_/mongo) and found prerequisite of using it. It is expecting username and password to be passed in by environment variables:

- MONGO_INITDB_ROOT_USERNAME - Root user name
- MONGO_INITDB_ROOT_PASSWORD - Root password

Here is the description:
> These variables, used in conjunction, create a new user and set that user's password. This user is created in the admin [authentication database](https://www.mongodb.com/docs/manual/core/security-users/#user-authentication-database) and given [the role of root](https://docs.mongodb.com/manual/core/security-built-in-roles/#superuser-roles), which is [a "superuser" role](https://docs.mongodb.com/manual/core/security-built-in-roles/#superuser-roles).

## Root credential

I used **ahlay** as the super user name but encrypted base 64 and obtain *YWhsYXk=*:

> echo -n 'ahlay' | base64

Then another round to obtain password *YWhsYXktcGFzc3dvcmQ=*:

> echo -n 'ahlay-password' | base64

I am think of making used for Kubernetes [Secret]. It is a common practise to manage password, key, or other important not suppose to knowed by others.

## Create Secret

Same like creating namespace, I drafted [secret.yml] where introduce new [Secret] named **mongodb-secret** to the namespace by run [secret.yml] as below:

> kubectl apply -f templates/secret.yml

Note: It seem like storing password in the repo, and not accepted in actual practise. I believe there must has a better idea to manage such sensitive data or [secret.yml] should be kept separately. 

## Mongo service

Same as [Openshift], Pod is a smallest unit and run one or more containers. From the best practise I just read, defines [Deployment] where includes [ReplicaSet](https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/) maintain a stable set of Pods. Beside the Pods themself, we want it to be accessable. This is the reason to add [Service]. I have drafted [mongo.yml] where define `image: mongo` in **containers** spec. By the way, **mongodb-secret** is being referred via **secretKeyRef** for environment variables **MONGO_INITDB_ROOT_USERNAME** and **MONGO_INITDB_ROOT_PASSWORD**. Run [mongo.yml] like below command to create [Deployment] and [Service]:

> kubectl apply -f templates/mongo.yml
 

[Openshift]: https://www.redhat.com/en/technologies/cloud-computing/openshift
[Deployment]: https://kubernetes.io/docs/concepts/workloads/controllers/deployment/
[Service]: https://kubernetes.io/docs/concepts/services-networking/service/
[Secret]: https://kubernetes.io/docs/concepts/configuration/secret/
[secret.yml]: ./templates/secret.yml
[mongo.yml]: ./templates/mongo.yml
