pipeline {
  agent any
  stages {
    stage('Stage1') {
      parallel {
        stage('Stage1') {
          steps {
            sh 'echo $Android_Home'
          }
        }

        stage('Matrix') {
          

                stages
                {
                  stage ('test1')
                  {
                    matrix
                    {
                      agent none
                      axes
                      {
                        axis
                        {
                          echo "Axis1"
                        }
                        axis
                        {
                          echo "Axis2"
                        }

                      }
                      stages {
                        stage('Build') {
                          steps {
                            echo "Do Build1 "
                          }
                        }
                        stage('Test') {
                          steps {
                            echo "Do Test f1"
                          }
                        }
                      }
                    }
                 
            }

          }
        }

      }
    }

  }
}
