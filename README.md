# K8S Microservice Project
This project is aimed at testing how to establish a connection between a microservice on a Google Kubernetes Engine cluster and a Google Compute Engine VM Instance.<br>

## Setting Up

The following configuration is required for this project
1. Google Cloud Account
2. GCE VM Instance (Referred to as the API)
    1. The image running should be `rbharadwaj9/helloworld_microservice:latest`. More information about this can be found [here](#guide-to-the-repository)
    1. There must be a firewall rule allowing 3000/TCP ingress to the machine
    1. To ensure security, disable the external ip for this instance
3. GKE Cluster (Referred to as the master)
    1. I'm using 2 nodes with all the default settings
    1. Establish a connection through `kubectl`
    1. Copy the internal IP of the VM instance into `kubernetes/hello_world-service/endpoint.yaml`

Run the following commands to configure the cluster:
```bash
# Create a namespace for the project
$ kubectl create -f kubernetes/namespace.yaml # Alternatively run $ kubectl create ns database-connectivity

# Create the service and endpoint for the API into the cluster.
# The service is called test-service
$ kubectl create -f kubernetes/hello_world-service/service.yaml
$ kubectl create -f kubernetes/hello_world-service/endpoint.yaml

# Create the service and deployment for the master that calls the API service
$ kubectl create -f kubernetes/nginx-service/deployment.yaml
```

The master deployment relies on `rbharadwaj9/ms_nginx-service:latest` and creates one pod that sends a request to `test-service`<br>
The service for the master created (`db-nginx-deployment`) exposes an external LoadBalancer. Visit the IP address at port 80.<br>

`http://<ip_address>` must show "Hello world from root"<br>
`http://<ip_address>/home` must show "Hello world from home"<br>

## Debugging
The first thing to make sure nginx is working is to perform `kubectl logs <master pod name> -n database-connectivity` to find out if everything is alright with nginx. If this is not the case, then the most probable case is that the IP address of the compute VM instance has changed and must be updated at `kubernetes/hello_world-service/endpoint.yaml` and applied.<br>
For these changes to be reflected onto the pod, you must run the following:
```bash
# Set pod replicas to 0 (remove all)
kubectl scale deployment db-nginx-deploy --replicas=0 -n database-connectivity

# Set pod replicas to 1 (create new pod so that nginx server is restarted)
kubectl scale deployment db-nginx-deploy --replicas=1 -n database-connectivity
```

Hopefully this works!

## Guide to the repository
Work in progress. Should be pretty straightforward though!
