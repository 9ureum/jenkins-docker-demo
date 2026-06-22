pipeline {
  agent any

  environment {
    IMAGE_NAME = 'jenkins-docker-demo'
    DEPLOY_CONTAINER = 'jenkins-docker-demo-deploy'
    DEPLOY_PORT = '8081'
  }

  stages {
    stage('Build Docker Image') {
      steps {
        sh '''
          docker build --build-arg APP_VERSION=${BUILD_NUMBER} \
            -t ${IMAGE_NAME}:${BUILD_NUMBER} -t ${IMAGE_NAME}:latest .
        '''
      }
    }

    stage('Smoke Test') {
      steps {
        sh '''
          docker rm -f ${IMAGE_NAME}-smoke || true
          docker run -d --rm --name ${IMAGE_NAME}-smoke -p 0:3000 ${IMAGE_NAME}:${BUILD_NUMBER}
          sleep 2
          PORT=$(docker port ${IMAGE_NAME}-smoke 3000/tcp | cut -d: -f2)
          curl -sf http://localhost:${PORT}/
          docker rm -f ${IMAGE_NAME}-smoke
        '''
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          docker rm -f ${DEPLOY_CONTAINER} || true
          docker run -d --name ${DEPLOY_CONTAINER} -p ${DEPLOY_PORT}:3000 ${IMAGE_NAME}:${BUILD_NUMBER}
        '''
      }
    }

    stage('Verify Deploy') {
      steps {
        sh '''
          sleep 2
          curl -sf http://localhost:${DEPLOY_PORT}/
        '''
      }
    }
  }

  post {
    success {
      echo "Deployed ${IMAGE_NAME}:${BUILD_NUMBER} -> http://localhost:${DEPLOY_PORT}/"
    }
  }
}
