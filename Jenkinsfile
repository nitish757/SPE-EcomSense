pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/fakeuser/EcomSense.git '
            }
        }

        stage('Build Backend') {
            steps {
                sh 'cd backend && mvn clean package'
            }
        }

        stage('Build Frontend') {
            steps {
                sh 'cd frontend && npm install && npm run build'
            }
        }

        stage('Build Docker Images') {
            steps {
                script {
                    docker.build("ecom-backend:${env.BUILD_NUMBER}", "./backend")
                    docker.build("ecom-frontend:${env.BUILD_NUMBER}", "./frontend")

                    docker.withRegistry('https://registry.hub.docker.com ', 'dockerhub-credentials') {
                        docker.image("ecom-backend:${env.BUILD_NUMBER}").push()
                        docker.image("ecom-frontend:${env.BUILD_NUMBER}").push()
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/backend-deployment.yaml'
                sh 'kubectl apply -f k8s/frontend-deployment.yaml'
            }
        }

        stage('Notify Success') {
            steps {
                slackSend channel: '#jenkins', color: '#00FF00', message: "✅ EcomSense Pipeline SUCCESS: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
            }
        }
    }
}
