pipeline {
    agent any

    environment {
        AIRFLOW_USER = credentials('airflow-admin-user')
        // AIRFLOW_PASSWORD = credentials('airflow-admin-password')

        MLFLOW_TRACKING_URI = "http://192.168.116.216:5000"
        DOCKER_IMAGE_NAME = "mbashish/forecastservice"
        DOCKER_IMAGE_TAG = "v3"
        DOCKER_HUB_CRED = credentials('DockerHubCred')

        K8S_NAMESPACE = "mlops"
        ANSIBLE_PLAYBOOK = "deploy.yml"

        GIT_REPO = "https://github.com/mbashish007/ML_OPS.git"
        GIT_BRANCH = "main"
        DAG_NAME = "retail_etl"
        DAG_FILE = "./dags/retail_etl.py"
        DAG_TARGET_DIR = "/home/m_b_ashish/forecastService/airflow_v1/dags"
    }

    stages {
        stage('Clone Git Repo') {
            steps {
                git branch: "${GIT_BRANCH}", url: "${GIT_REPO}"
            }
        }

        stage('Check Airflow & MLflow Status') {
            steps {
                script {
                    echo " Checking Airflow is reachable..."
                    sh '''
                        curl -f http://localhost:8090/health || {
                            echo " Airflow is not running."
                            exit 1
                        }
                    '''

                    echo " Checking MLflow is reachable..."
                    sh '''
                        curl -f ${MLFLOW_TRACKING_URI} || {
                            echo " MLflow is not running."
                            exit 1
                        }
                    '''
                }
            }
        }

        stage('Ensure DAG File is Ready') {
            steps {
                script {
                    def dagPath = "${DAG_TARGET_DIR}/${DAG_NAME}.py"

                    echo " Preparing DAG at ${dagPath}..."
                    sh "mkdir -p ${DAG_TARGET_DIR}"
                    sh "cp ${DAG_FILE} ${DAG_TARGET_DIR}/"

                    echo " Waiting for Airflow to parse new DAG..."
                    timeout(time: 2, unit: 'MINUTES') {
                        retry(10) {
                            script {
                                def dagAvailable = sh(
                                    script: """
                                        curl -u ${AIRFLOW_USER_USR}:${AIRFLOW_USER_PSW} \
                                            http://localhost:8090/api/v1/dags/${DAG_NAME} > /dev/null 2>&1
                                        echo \$?
                                    """,
                                    returnStdout: true
                                ).trim()

                                if (dagAvailable != "0") {
                                    sleep 10
                                    error "DAG not yet available, retrying..."
                                } else {
                                    echo " DAG parsed successfully."
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Trigger Retail ETL DAG') {
            steps {
                script {
                    echo " Triggering DAG: ${DAG_NAME}"
                    def response = sh(
                        script: """
                            curl -u ${AIRFLOW_USER}:${AIRFLOW_PASSWORD} -X POST \
                              http://localhost:8090/api/v1/dags/${DAG_NAME}/dagRuns \
                              -H "Content-Type: application/json" -d '{}'
                        """,
                        returnStdout: true
                    ).trim()

                    def dagRunId = readJSON(text: response).dag_run_id
                    env.DAG_RUN_ID = dagRunId
                    echo " DAG Run ID: ${env.DAG_RUN_ID}"
                }
            }
        }

        stage('Wait for DAG Completion') {
            steps {
                script {
                    def maxAttempts = 30
                    def delaySeconds = 10

                    timeout(time: 10, unit: 'MINUTES') {
                        retry(maxAttempts) {
                            script {
                                def status = sh(
                                    script: """
                                        curl -u ${AIRFLOW_USER}:${AIRFLOW_PASSWORD} -s \
                                        http://localhost:8090/api/v1/dags/${DAG_NAME}/dagRuns/${env.DAG_RUN_ID} \
                                        | jq -r '.state'
                                    """,
                                    returnStdout: true
                                ).trim()

                                if (status != "success") {
                                    if (status == "failed") {
                                        error " DAG failed."
                                    } else {
                                        sleep(delaySeconds)
                                        error " DAG still running..."
                                    }
                                } else {
                                    echo " DAG finished successfully."
                                }
                            }
                        }
                    }
                }
            }
        }

        stage('Train Model and Log to MLflow') {
            steps {
                script {
                    echo "Building Docker image for trainer..."
                    sh '''
                        cd train-model
                        docker build -t trainer-image .
                    '''

                    echo "Running training container with volume and MLflow URI..."
                    sh '''
                        docker run --rm \
                            -v /home/m_b_ashish/forecastService/shared:/shared \
                            -e MLFLOW_TRACKING_URI="http://192.168.116.216:5000" \
                            trainer-image
                    '''
                }
            }
        }

        stage('Build Forecast API Image') {
            steps {
                echo " Building Docker image..."
                sh " DOCKER_BUILDKIT=1 docker buildx build --no-cache --progress=plain -f ./build2/Dockerfile -t $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG ."
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                
                script{
                    docker.withRegistry('', 'DockerHubCred') {
                    
                    sh "docker push $DOCKER_IMAGE_NAME:$DOCKER_IMAGE_TAG"
                    }
                 }
            }
        }

        stage('Deploy with Ansible') {
            steps {
                echo " Deploying to Kubernetes..."
                sh "cd ansible && ansible-playbook -i 'inventory' ${ANSIBLE_PLAYBOOK} -e namespace=${K8S_NAMESPACE}"
            }
        }
    }

    post {
        success {
            echo " Pipeline completed successfully!"
        }
        failure {
            echo " Pipeline failed."
        }
    }
}
