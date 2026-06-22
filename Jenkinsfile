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
        // Jenkins talks to the host's Docker daemon, so containers it starts are
        // siblings, not children: "localhost" inside the Jenkins container won't
        // reach their published ports. A helper curl container sharing the
        // target's network namespace (--network container:NAME) does.
        sh '''
          docker rm -f ${IMAGE_NAME}-smoke || true
          docker run -d --name ${IMAGE_NAME}-smoke ${IMAGE_NAME}:${BUILD_NUMBER}
          sleep 2
          docker run --rm --network container:${IMAGE_NAME}-smoke curlimages/curl:8.10.1 -sf http://localhost:3000/
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
          docker run --rm --network container:${DEPLOY_CONTAINER} curlimages/curl:8.10.1 -sf http://localhost:3000/
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
