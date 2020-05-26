@Library(["global-pipeline-libraries", "rx-pipeline-libraries"]) _

pipeline {
  agent any

  options {
    skipDefaultCheckout false
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
    ansiColor('xterm')
    buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '30'))
  }

  parameters {
    string(name: 'ticket', description: '(optional) Jira ticket to post screenshots to.', defaultValue: '')
    string(name: 'baseUrl', description: 'Target base Url for running e2e tests.', defaultValue: '')
    string(name: 'theme', description: 'Target theme for running e2e tests.', defaultValue: '')
  }

  environment {
    ARTIFACTORY_CREDENTIALS = credentials('artifactory')
  }

  stages {

 parallel {
    // Install the Rx application.
    stage('install') {
      agent {
        dockerfile {
          filename 'Dockerfile.wdio'
          reuseNode true
        }
      }

      environment {
        HOME = "${env.WORKSPACE}"
      }

      steps {
        sh '''
          set +x # prevent logging of echoed secrets
          npm config set registry 'https://artifacts.werally.in/artifactory/api/npm/npm'
          npm config set always-auth true
          npm config set email "cloudops@rallyhealth.com"
          npm config set _auth $(echo -n "$ARTIFACTORY_CREDENTIALS" | base64)
          set -x

          yarn install
        '''
      }
    }
   
      // Execute End to End tests.
      stage('e2e Drug') {
      
        agent {
          dockerfile {
            filename 'Dockerfile.wdio'
            reuseNode true
          }
        }

        environment {
          HOME = "${env.WORKSPACE}"
        }
        steps {
          script {
            sh """
              echo "Executing tests. Output captured in test_output.log."
              yarn wdio --suite drug --baseUrl ${params.baseUrl} > test_output.log
              cat test_output.log # Log the output for Jenkins visibility.
            """
          }
        }
      }
      
      stage('e2e pharmacy') {
        
        agent {
          dockerfile {
            filename 'Dockerfile.wdio'
            reuseNode true
          }
        }

        environment {
          HOME = "${env.WORKSPACE}"
        }

        steps {
          script {
            sh """
              echo "Executing tests. Output captured in test_output.log."
              yarn wdio --suite pharmacy --baseUrl ${params.baseUrl} > test_output.log
              cat test_output.log # Log the output for Jenkins visibility.
            """
          }
        }
      }

      stage('e2e home') {
        
        agent {
          dockerfile {
            filename 'Dockerfile.wdio'
            reuseNode true
          }
        }

        environment {
          HOME = "${env.WORKSPACE}"
        }
        steps {
          script {
            sh """
              echo "Executing tests. Output captured in test_output.log."
              yarn wdio --suite home --baseUrl ${params.baseUrl} > test_output.log
              cat test_output.log # Log the output for Jenkins visibility.
            """
          }
        }
      }
        
      stage('e2e change') {
        
        agent {
          dockerfile {
            filename 'Dockerfile.wdio'
            reuseNode true
          }
        }

        environment {
          HOME = "${env.WORKSPACE}"
        }

        steps {
            script {
              sh """
                echo "Executing tests. Output captured in test_output.log."
                yarn wdio --suite change --baseUrl ${params.baseUrl} > test_output.log
                cat test_output.log # Log the output for Jenkins visibility.
              """
            }
          }
      }

      stage('e2e orderstatus') {
        
        agent {
          dockerfile {
            filename 'Dockerfile.wdio'
            reuseNode true
          }
        }

        environment {
          HOME = "${env.WORKSPACE}"
        }
          
        steps {
            script {
              sh """
                echo "Executing tests. Output captured in test_output.log."
                yarn wdio --suite orderstatus --baseUrl ${params.baseUrl} > test_output.log
                cat test_output.log # Log the output for Jenkins visibility.
              """
            }
          }
      }

      stage('e2e medCab') {
        
        agent {
          dockerfile {
            filename 'Dockerfile.wdio'
            reuseNode true
          }
        }

        environment {
          HOME = "${env.WORKSPACE}"
        }
        
        steps {
            script {
              sh """
                echo "Executing tests. Output captured in test_output.log."
                yarn wdio --suite medCab --baseUrl ${params.baseUrl} > test_output.log
                cat test_output.log # Log the output for Jenkins visibility.
              """
            }
          }
      }

      stage('e2e session') {
        
        agent {
          dockerfile {
            filename 'Dockerfile.wdio'
            reuseNode true
          }
        }

        environment {
          HOME = "${env.WORKSPACE}"
        }
        
        steps {
            script {
              sh """
                echo "Executing tests. Output captured in test_output.log."
                yarn wdio --suite session --baseUrl ${params.baseUrl} > test_output.log
                cat test_output.log # Log the output for Jenkins visibility.
              """
            }
          }
      }
    }
  }

  post {
    always {
      script {
        def zipFileName = "wdio-artifacts-${currentBuild.startTimeInMillis}-${params.theme}.zip"

        // Generate Allure end to end test report.
        // docs.qameta.io/allure
        allure([
          includeProperties: false,
          jdk: '',
          properties: [],
          reportBuildPolicy: 'ALWAYS',
          results: [[path: 'wdio/output/allure-results']]
        ])

        zip zipFile: zipFileName, archive: false, glob: 'wdio/output/e2e-accessibility-results/*,wdio/output/junit-results/*,wdio/output/screenshots/*,wdio/output/allure-results/*'

        archiveArtifacts "wdio/output/allure-results/*"
        archiveArtifacts "wdio/output/e2e-accessibility-results/*"
        archiveArtifacts "wdio/output/junit-results/*"
        archiveArtifacts "wdio/output/screenshots/*"
        archiveArtifacts zipFileName
        junit 'wdio/output/junit-results/wdio-*-junit-reporter.log'

        archiveArtifacts "test_output.log"

        echo "WDIO OUTPUT AVAILABLE HERE: $BUILD_URL/artifact/"

        def failedTestName = sh(
          returnStdout: true,
          script: "grep -A30 '\\✖' test_output.log | grep .test.js | head -n1 | sed 's/.*\\///' | cut -d: -f1"
        ).trim()

        // Sets the build description to the failing test name if found,
        // or else "" (no description) if the job succeeded,
        // or else "unknown failure" if something went wrong and we couldn't identify what.
        currentBuild.description = failedTestName ?: (currentBuild.result == 'SUCCESS') ? '' : 'unknown failure'
      }
    }

  }

}
