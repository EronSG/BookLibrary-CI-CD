


pipeline {
    agent any

    environment {
        DOCKER = 'C:\\Users\\Arceo\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
        DB_NAME = 'library'
        DB_USER = 'libraryuser'
        APP_PORT = '8083'
        COMPOSE_PROJECT_NAME = 'booklibrary'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker') {
            steps {
                sh '"%DOCKER%" --version'
                sh '"%DOCKER%" compose version'
            }
        }


stage('Test') {
    steps {
        withCredentials([
            string(
                credentialsId: 'booklibrary-db-password',
                variable: 'DB_PASSWORD'
            )
        ]) {
            sh '"%DOCKER%" compose up -d --wait --remove-orphans database'

            sh '"%DOCKER%" compose run --rm --build --user root book-api sh -c "npm ci --include=dev && npm test"'
        }
    }
}


        stage('Build') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'booklibrary-db-password',
                        variable: 'DB_PASSWORD'
                    )
                ]) {
                    sh '"%DOCKER%" compose build'
                }
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'booklibrary-db-password',
                        variable: 'DB_PASSWORD'
                    )
                ]) {
                    sh '"%DOCKER%" compose up -d --no-build --wait'
                }
            }
        }

        stage('Smoke Test') {
            steps {
                sh 'curl.exe --fail http://localhost:8083/health'
            }
        }
    }

    post {
        always {
            script {
                sh(
                    script: '"%DOCKER%" compose ps',
                    returnStatus: true
                )
            }
        }

        success {
            echo 'Pipeline completed successfully!'
        }

        failure {
            echo 'Pipeline failed. Check the Console Output for the error.'
        }
    }
}

