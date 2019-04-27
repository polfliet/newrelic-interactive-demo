# newrelic-interactive-demo

# build docker image
docker image build -t polfliet/newrelic-kubernetes-demo .

# deploy frontend
kubectl create -f frontend.yaml

# check IP
kubectl cluster-info

# check port
kubectl describe service frontend

# deploy new relic



# configure autoscaling
kubectl autoscale deployment frontend --cpu-percent=50 --min=1 --max=10

# check horizontal pod autoscaler
kubectl get hpa --watch

kubectl describe hpa frontend




# delete autoscaler
kubectl delete hpa frontend



# Instructions for minikube

minikube start --extra-config=kubelet.authentication-token-webhook=true

# install metrics server !!
https://github.com/kubernetes-incubator/metrics-server
Add to metrics-server-deployment.yaml:
        command:
        - /metrics-server
        - --kubelet-preferred-address-types=InternalIP
        - --kubelet-insecure-tls