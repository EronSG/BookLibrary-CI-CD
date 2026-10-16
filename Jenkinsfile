```groovy
pipeline {
    agent any

    triggers {
        githubPush()
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
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
                    bat 'docker compose up -d --wait database'
                    bat 'docker compose run --rm --build book-api sh -c "npm ci --include=dev && npm test"'
                }
            }
        }

        stage('Build Images') {
            steps {
                script {
                    env.IMAGE_TAG = "build-${env.BUILD_NUMBER}"
                }

                withCredentials([
                    string(
                        credentialsId: 'booklibrary-db-password',
                        variable: 'DB_PASSWORD'
                    )
                ]) {
                    bat 'docker compose build'
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
                    bat 'docker compose up -d --no-build --wait'
                }
            }
        }

        stage('Smoke Test') {
            steps {
                bat 'curl.exe --fail --retry 10 --retry-delay 3 --retry-connrefused "http://localhost:%APP_PORT%/health"'
                bat 'curl.exe --fail "http://localhost:%APP_PORT%/api/reports/summary"'
                bat 'docker compose ps'
            }
        }
    }

    post {
        success {
            echo "Deployment succeeded with image tag build-${BUILD_NUMBER}."
        }

        failure {
            echo 'Pipeline failed. Deployment is blocked when the Test stage fails.'
        }

        always {
            bat 'docker compose ps'
            archiveArtifacts artifacts: 'test-results/**/*, coverage/**/*',
                             allowEmptyArchive: true
        }
    }
}
```