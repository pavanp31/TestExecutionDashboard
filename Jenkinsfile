pipeline {
  agent any
  stages {
    stage('Run1') {
      parallel {
        stage('Run1') {
          steps {
            sh 'ECHO $PATH'
          }
        }

        stage('Run2') {
          steps {
            sh 'ECHO $ANDROID_HOME'
          }
        }

      }
    }

  }
}