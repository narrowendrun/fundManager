# fundManager

An analytics and dashboards tool that allows you to maintain your mortgage/loan purchases and build waterfalls

## Deployment

Once the prerequisites and setup are taken care of, we can start the project

```bash
   cd /path/to/fundManager
   docker-conpose up -d --build
```
you can start using fundManager from localhost:3000

## Accessing the database
After deploying the containers you can access the psql db by running the following commands
```bash
docker exec -it fundmanager-db /bin/bash
```
Once inside the fundmanager-db shell run the following command
```bash
psql -U fundmanager -d fundmanager
```
