# New Relic Interactive Demo

## Prerequisites
Make sure you have a Kubernetes cluster

Need an AWS EKS cluster?
* Use the AWS Quick Start: https://aws.amazon.com/quickstart/architecture/new-relic-infrastructure/
* Or following this tutorial: https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html

## Deploying the demo
### Deploy the demo game to the Kubernetes cluster
`kubectl create -f game.yaml`

### Check where the service is running
`kubectl describe service game-frontend`
Copy the LoadBalancer Ingress address and paste in your browser to try out the demo game

## Deploying New Relic
### Install kube-state-metrics
See https://docs.newrelic.com/docs/integrations/kubernetes-integration/installation/kubernetes-installation-configuration for details on how to install kube-state-metrics.

### Add your New Relic license key to the cluster
`kubectl create secret generic newrelic-secret --from-literal=new_relic_license_key='<YOUR_LICENSE_KEY>'`

### Install New Relic metadata injection
For more details, check https://docs.newrelic.com/docs/integrations/kubernetes-integration/metadata-injection/kubernetes-apm-metadata-injection
```
kubectl apply -f k8s-metadata-injection-latest.yaml
```

### Install New Relic Kubernetes integration
For more details, check https://docs.newrelic.com/docs/integrations/kubernetes-integration/installation/kubernetes-installation-configuration
```
kubectl create -f newrelic-infrastructure-k8s-latest.yaml
```
Check if the newrelic-infra daemonset and pod is running
```
kubectl get daemonsets
kubectl get pods
```


## Horizontal Pod Autoscaling (HPA)
### Install metrics-server (HPA uses this for determining when to scale the pod)
This requires helm to be installed. For EKS, see instructions here: https://eksworkshop.com/helm_root/helm_intro/
```
helm install stable/metrics-server --name metrics-server --version 2.0.4 --namespace metrics
```

### Configure autoscaling
`kubectl autoscale deployment game-frontend --cpu-percent=50 --min=1 --max=10`

### Check horizontal pod autoscaler
`kubectl get hpa --watch`


## Clean-up
```
kubectl delete -f game.yaml
kubectl delete -f kube-state-metrics-release-1.5/kubernetes/
kubectl delete -f newrelic-infrastructure-k8s-latest.yaml
kubectl delete hpa game-frontend
kubectl delete secret newrelic-secret```

