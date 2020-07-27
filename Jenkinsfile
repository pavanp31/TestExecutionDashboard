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
          steps {
            script {
              pipeline
              {
                agent any
                stages
                {
                  stage ('test1')
                  {
                    matrix
                    {
                      axes
                      {
                        axis
                        {
                          echo "Axis1"
                        }
                        axis
                        {

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

  }
}