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
                name 'themes'
                values 'uhc', 'advantage'
              }
              axis
              {
                name 'suite'
                values 'orderstatus', 'home', 'drug', 'pharmacy'
              }
            }
            stages {
              stage('Build') 
              {
                steps {
                  sh 'echo $Android_Home'
                }
              }
              stage('Test') 
              {
                steps {  
                 sh 'echo $Android_Home'
                }
              }
            }
          }
              
        }
      }
    }
  }
}
