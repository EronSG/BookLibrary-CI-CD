pipeline {
    agent any
    triggers { githubPush() }
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
            steps { checkout scm }
        }
        stage('Test') {
            steps {
                withCredentials([string(credentialsId: 'booklibrary-db-password', variable: 'DB_PASSWORD')]) {
                    sh 'docker compose up -d --wait database'
                    sh 'docker compose run --rm --build book-api sh -c "npm ci --include=dev && npm test"'
                }
            }
        }
        stage('Build Images') {
            steps {
                script { env.IMAGE_TAG = "build-${env.BUILD_NUMBER}" }
                withCredentials([string(credentialsId: 'booklibrary-db-password', variable: 'DB_PASSWORD')]) {
                    sh 'IMAGE_TAG="$IMAGE_TAG" docker compose build'
                }
            }
        }
        stage('Deploy') {
            steps {
                withCredentials([string(credentialsId: 'booklibrary-db-password', variable: 'DB_PASSWORD')]) {
                    sh 'IMAGE_TAG="$IMAGE_TAG" docker compose up -d --no-build --wait'
                }
            }
        }
        stage('Smoke Test') {
            steps {
                sh 'curl --fail --retry 10 --retry-delay 3 --retry-connrefused "http://host.docker.internal:${APP_PORT}/health"'
                sh 'curl --fail "http://host.docker.internal:${APP_PORT}/api/reports/summary"'
                sh 'docker compose ps'
            }
        }
    }
    post {
        success {
            echo "Deployment succeeded with image tag build-${BUILD_NUMBER}."
        }
        failure {
            echo 'Pipeline failed. Deployment is blocked when the Test stage fails; the currently running app is not taken down by the test stage.'
        }
        always {
            sh 'docker compose ps || true'
            archiveArtifacts artifacts: 'test-results/**/*, coverage/**/*', allowEmptyArchive: true
        }
    }
}
