pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }

    triggers {
        githubPush()
    }

    environment {
        DOCKER_HUB_USER = credentials('DockerHubCred')[0]
        DOCKER_HUB_PASS = credentials('DockerHubCred')[1]
        KUBECONFIG_CRED = credentials('kubeconfig')
        NAMESPACE = 'ecomsense'
    }

    stages {
        // STAGE 1: Clone Repository
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                     url: 'https://github.com/nitish757/SPE-EcomSense.git '
            }
        }

        // STAGE 2: Docker Login Once
        stage('Docker Login') {
            steps {
                sh 'echo "$DOCKER_HUB_PASS" | docker login -u "$DOCKER_HUB_USER" --password-stdin'
            }
        }

        // STAGE 3: Build Inventory Service
        stage('Build Inventory Service') {
            steps {
                dir('inventoryservice') {
                    sh 'docker build -t nitish757/inventory-service:${env.BUILD_NUMBER} .'
                    sh 'docker push nitish757/inventory-service:${env.BUILD_NUMBER}'
                }
            }
        }

        // STAGE 4: Build Product Service
        stage('Build Product Service') {
            steps {
                dir('productservice') {
                    sh 'docker build -t nitish757/product-service:${env.BUILD_NUMBER} .'
                    sh 'docker push nitish757/product-service:${env.BUILD_NUMBER}'
                }
            }
        }

        // STAGE 5: Build Frontend
        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                    sh 'docker build -t nitish757/frontend:${env.BUILD_NUMBER} .'
                    sh 'docker push nitish757/frontend:${env.BUILD_NUMBER}'
                }
            }
        }

        // STAGE 6: Deploy to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    def KUBECONFIG_PATH = "${env.WORKSPACE}/kubeconfig"
                    writeFile file: KUBECONFIG_PATH, text: credentials('kubeconfig')

                    dir('k8s') {
                        echo "Applying namespace..."
                        sh "kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f namespace.yml"

                        echo "Applying ConfigMap..."
                        sh "kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f config/"

                        echo "Applying Postgres..."
                        sh "kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f postgres/"

                        echo "Applying Inventory Service..."
                        sh "kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f inventory-service/"

                        echo "Applying Product Service..."
                        sh "kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f product-service/"

                        echo "Applying Frontend..."
                        sh "kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f frontend/"

                        echo "Applying Ingress..."
                        sh "kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f ingress/"

                        echo "Applying HPA..."
                        sh "kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f hpa/"
                    }
                }
            }
        }

        // STAGE 7: Run Integration Tests (Optional)
        stage('Run Integration Tests') {
            when {
                expression { env.DEPLOY_TO_K8S == "true" }
            }
            steps {
                dir('test/e2e') {
                    sh 'npm install'
                    sh 'npm test' // Or Newman collection
                }
            }
        }

        // STAGE 8: Clean Up
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
