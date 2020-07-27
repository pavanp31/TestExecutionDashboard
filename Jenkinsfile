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
                  script{
                    def baseUrl = "www.google.com"
                    def t = "${themes}"
                    if(t.contains('uhc'))
                    {
                       echo "if block : theme is : ${t}"
                       baseUrl = "www.uhc.com"
                    }
                    else
                    {
                       echo "else block : theme is ${t}"
                       baseUrl = "www.advantage.com"
                    }
                    step("${themes}"+":"+"${suite}")
                    echo " New Base URL: ${baseUrl}"
                    
                    
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

            
