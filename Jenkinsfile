#!/usr/bin/env groovy
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
        stage ('test1')
        {
          matrix
          {
            agent none
            axes
            {
              axis
              {
                
              }
              axis
              {
                
              }
            }
            stages {
              stage('Build') 
              {
                steps {
                }
              }
              stage('Test') 
              {
                steps {  
                }
              }
            }
          }
              
        }
      }
    }
  }
}
