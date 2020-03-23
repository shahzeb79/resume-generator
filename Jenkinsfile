node {
  def project = 'umapp-cluster'
  def appName = 'expressapp'
  def feSvcName = "expressapp"
  def imageTag = "shahzeb799/${appName}:latest"

  checkout scm

  stage 'Docker Login'
  sh("docker login --username=shahzeb799 --password=***")
  
  stage 'Build image'
  sh("docker build -t ${imageTag} .")

  stage 'Push image to registry'
  sh("docker push ${imageTag}")
  
  stage "Clean Deployments"
  sh("kubectl delete deployment ${appName} --namespace=production")
  sh("kubectl delete service ${appName} --namespace=production")

  stage "Deploy Application"
  switch (env.BRANCH_NAME) {
    case "master":
        // Change deployed image in canary to the one we just built
        sh("kubectl --namespace=production apply -f k8s/services/")
        sh("kubectl --namespace=production apply -f k8s/production/")
        sh("echo http://`kubectl --namespace=production get service/expressapp --output=json | jq -r '.status.loadBalancer.ingress[0].ip'` > ${feSvcName}")
        break
    case "develop":
        // Change deployed image in canary to the one we just built
        sh("kubectl --namespace=production apply -f k8s/services/")
        sh("kubectl --namespace=production apply -f k8s/production/")
        sh("echo http://`kubectl --namespace=production get service/${feSvcName} --output=json | jq -r '.status.loadBalancer.ingress[0].ip'` > ${feSvcName}")
        break

    // Roll out a dev environment
    default:
        sh("kubectl --namespace=production apply -f k8s/services/")
        sh("kubectl --namespace=production apply -f k8s/production/")
        sh("echo http://`kubectl --namespace=production get service/expressapp --output=json | jq -r '.status.loadBalancer.ingress[0].ip'` > ${feSvcName}")
        break
  }
}
