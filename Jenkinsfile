#!/usr/bin/env groovy
def dyanmicValue = 2
def p
pipeline 
{
  agent any
  stages {
    stage('Stage1') 
    {
      steps {
        sh 'echo $Android_Home'
      }
    }

      stage('m') {
      stages
      {
        
        stage ('test')
        {
          matrix
          {
            agent none
            axes
            {
              axis
              {
                name 'themes'
                values 'uhc', 'advantage'
              }
              axis
              {
                name 'suite'
                values 'orderstatus', 'home', 'drug', 'pharmacy'
              }
            }
            
            stages{
             stage('build')
              {
                steps {
                  script{
                  def t = runDynamicStage(dyanmicValue)
                  p=t
                  echo "final Value should be >2: Actual: ${p}"
                  }
                }
              }
            }
          } 
        }
      }
    }
  }
  post {
    always {
      script {
        echo "Getting scope of t out side stage : ${p}"
      }
    }
  }
}

def runDynamicStage(dyanmicValue) {
  stage("This will be a dynamic stage name: ${dyanmicValue + 1}") {
    sh 'echo "==> Inside runDynamicStage"'
    return "tested"
  }
}

            
