pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        // Use credentials from Jenkins
        DOCKER_HUB_CRED_ID = 'DockerHubCred'
        KUBECONFIG_CRED_ID = 'kubeconfig'

        // Dynamic image tags based on git commit
        GIT_COMMIT = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
        IMAGE_TAG = "${GIT_COMMIT}"
        NAMESPACE = 'ecomsense'
    }

    stages {
        // 🌐 STAGE: Clone Repository
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                     url: 'https://github.com/nitish757/SPE-EcomSense.git '
            }
        }

        // ⚙️ STAGE: Build Inventory Service
        stage('Build Inventory Service') {
            steps {
                dir('inventoryservice') {
                    withCredentials([usernamePassword(credentialsId: "$DOCKER_HUB_CRED_ID", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS']) {
                        sh 'mvn clean package -DskipTests'
                        sh "docker build -t nitish757/inventory-service:${IMAGE_TAG} ."
                        sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                        sh 'docker push nitish757/inventory-service:$IMAGE_TAG'
                    }
                }
            }
        }

        // ⚙️ STAGE: Build Product Service
        stage('Build Product Service') {
            steps {
                dir('productservice') {
                    withCredentials([usernamePassword(credentialsId: "$DOCKER_HUB_CRED_ID", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS']) {
                        sh 'mvn clean package -DskipTests'
                        sh "docker build -t nitish757/product-service:${IMAGE_TAG} ."
                        sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                        sh 'docker push nitish757/product-service:$IMAGE_TAG'
                    }
                }
            }
        }

        // 🖥 STAGE: Build Frontend
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    withCredentials([usernamePassword(credentialsId: "$DOCKER_HUB_CRED_ID", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS']) {
                        sh 'npm install && npm run build'
                        sh "docker build -t nitish757/frontend:${IMAGE_TAG} ."
                        sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                        sh 'docker push nitish757/frontend:$IMAGE_TAG'
                    }
                }
            }
        }

        // 🚀 STAGE: Deploy to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Write kubeconfig file
                    writeFile file: "${env.HOME}/config", text: env.KUBECONFIG_USR

                    // Set K8s context
                    dir('k8s') {
                        echo "Applying namespace..."
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f namespace.yml || true'

                        echo "Applying ConfigMap..."
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f config/'

                        echo "Applying Postgres..."
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f postgres/'

                        echo "Applying Inventory Service..."
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f inventory-service/'
                        sh 'kubectl --kubeconfig=${env.HOME}/config set image deployment/inventory-service inventory-service=nitish757/inventory-service:${IMAGE_TAG} -n ecomsense'

                        echo "Applying Product Service..."
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f product-service/'
                        sh 'kubectl --kubeconfig=${env.HOME}/config set image deployment/product-service inventory-service=nitish757/product-service:${IMAGE_TAG} -n ecomsense'

                        echo "Applying Frontend..."
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f frontend/'
                        sh 'kubectl --kubeconfig=${env.HOME}/config set image deployment/frontend frontend=nitish757/frontend:${IMAGE_TAG} -n ecomsense'

                        echo "Applying Ingress..."
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f ingress/'

                        echo "Applying HPA..."
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f hpa/hpa-frontend.yml'
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f hpa/hpa-product.yml'
                        sh 'kubectl --kubeconfig=${env.HOME}/config apply -f hpa/hpa-inventory.yml'
                        

                    }
                }
            }
        }

        // 🧪 Optional: Run Integration Tests
        stage('Run Integration Tests') {
            when {
                expression { env.DEPLOY_TO_K8S == "true" }
            }
            steps {
                dir('test/e2e') {
                    sh 'npm install'
                    sh 'npm test' // or use Newman if using Postman collection
                }
            }
        }

        // 🧹 STAGE: Clean Up Old Images
        stage('Clean Up') {
            steps {
                sh 'docker system prune -af'
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
            slackSend channel: '#deploy', message: "✅ Production deployment succeeded"
        }
        failure {
            echo "❌ Deployment failed"
            slackSend channel: '#deploy', message: "❌ Deployment failed"
        }
    }
}
