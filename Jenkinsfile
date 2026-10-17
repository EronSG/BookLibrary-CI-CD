
pipeline {
    agent any

    triggers {
        githubPush()
        pollSCM('H/2 * * * *')
    }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        DB_NAME = 'library'
        DB_USER = 'libraryuser'
        APP_PORT = '8083'
        COMPOSE_PROJECT_NAME = 'booklibrary-final'
        DOCKER = 'C:\\Users\\Arceo\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker') {
            steps {
                bat '"%DOCKER%" --version'
                bat '"%DOCKER%" compose version'
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
                    bat '"%DOCKER%" compose up -d --wait database'
                    bat '"%DOCKER%" compose run --rm --build --user root book-api sh -c "npm ci --include=dev && npm test"'
                }
            }
        }

        stage('Build Images') {
            steps {
                withCredentials([
                    string(
                        credentialsId: 'booklibrary-db-password',
                        variable: 'DB_PASSWORD'
                    )
                ]) {
                    bat '"%DOCKER%" compose build'
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
                    bat '"%DOCKER%" compose up -d --no-build --wait'
                }
            }
        }

        stage('Smoke Test') {
            steps {
                bat 'curl.exe --fail --retry 10 --retry-delay 3 --retry-connrefused http://localhost:8083/health'
                bat '"%DOCKER%" compose ps'
            }
        }
    }

    post {
        success {
            echo "Deployment succeeded with build ${BUILD_NUMBER}."
        }

        failure {
            echo 'Pipeline failed. Check the Console Output for the error.'
        }

        always {
            bat(
                script: '"%DOCKER%" compose ps',
                returnStatus: true
            )
        }
    }
}


