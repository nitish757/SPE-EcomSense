pipeline {
    agent any

    tools {
        nodejs "nodejs" // Tool name must match the one defined in Jenkins > Tools > NodeJS
    }
    
    triggers {
        githubPush()
    }
    
    environment {
        DOCKER_HUB_CRED = credentials('DockerHubCred') // Jenkins credential ID
        KUBECONFIG_CRED = credentials('kubeconfig') // kubeconfig file
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

        // STAGE 2: Build Inventory Service
        stage('Build Inventory Service') {
            steps {
                dir('inventoryservice') {
                    // sh 'mvn clean package -DskipTests'
                    sh 'docker build -t nitish757/inventory-service:4.0.0 .'
                    sh 'docker login -u $DOCKER_HUB_CRED_USR -p $DOCKER_HUB_CRED_PSW'
                    sh 'docker push nitish757/inventory-service:4.0.0'
                }
            }
        }

        // STAGE 3: Build Product Service
        stage('Build Product Service') {
            steps {
                dir('productservice') {
                    // sh 'mvn clean package -DskipTests'
                    sh 'docker build -t nitish757/product-service:3.0.0 .'
                    sh 'docker login -u $DOCKER_HUB_CRED_USR -p $DOCKER_HUB_CRED_PSW'
                    sh 'docker push nitish757/product-service:3.0.0'
                }
            }
        }

        // STAGE 4: Build Frontend
        stage('Build Frontend') {
            steps {
                dir('Frontend') {
                    sh 'ls'
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }
        stage('Build Frontend Docker Image') {
            steps {
                dir('Frontend') {
                    sh 'docker build -t nitish757/frontend:5.0.0 .'
                    sh 'docker login -u $DOCKER_HUB_CRED_USR -p $DOCKER_HUB_CRED_PSW'
                    sh 'docker push nitish757/frontend:5.0.0'
                }
            }
        }

        // STAGE 5: Deploy to Kubernetes
        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // Load kubeconfig from Jenkins credentials
                    def KUBECONFIG_PATH = "${env.HOME}/config"
            
                    // Write kubeconfig to disk
                    writeFile file: KUBECONFIG_PATH, text: credentials('kubeconfig')

                    // Load kubeconfig from Jenkins credentials
                    // writeFile file: "${env.HOME}/config", text: env.KUBECONFIG_USR

                    // Apply Kubernetes manifests
                    dir('k8s') {
                        echo "Applying namespace..."
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f namespace.yml'

                        echo "Applying CongigMap..."
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f config/'
                        
                        echo "Applying Postgres..."
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f postgres/'

                        echo "Applying Inventory Service..."
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f inventory-service/'

                        echo "Applying Product Service..."
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f product-service/'

                        echo "Applying Frontend..."
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f frontend/'

                        echo "Applying Ingress..."
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f ingress/'

                        echo "Applying HPA..."
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f hpa/hpa-inventory.yml'
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f hpa/hpa-product.yml'
                        sh 'kubectl --kubeconfig=${KUBECONFIG_PATH} apply -f hpa/hpa-frontend.yml'
                        
                    }
                }
            }
        }

        // STAGE 6: Run Integration Tests (Optional)
        stage('Run Integration Tests') {
            when {
                expression { env.DEPLOY_TO_K8S == "true" }
            }
            steps {
                dir('test/e2e') {
                    sh 'npm install'
                    sh 'npm test' // Or use Newman if testing via Postman collection
                }
            }
        }

        // STAGE 7: Clean Up Old Images
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
