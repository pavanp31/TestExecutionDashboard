@Library(["global-pipeline-libraries", "rx-pipeline-libraries"]) _

def app = "rx-ui"

pipeline {
  agent any

  options {
    disableConcurrentBuilds()
    skipDefaultCheckout false // if true, master won't be merged into PR branch builds
    timeout(time: 30, unit: 'MINUTES')
    timestamps()
    ansiColor('xterm')
    parallelsAlwaysFailFast()
  }

  parameters {
    booleanParam(name: 'clean', description: 'Clean the node_modules directory', defaultValue: false)
    booleanParam(name: 'force_build', defaultValue: false, description: 'Force a new build even if HEAD is already tagged.')
    booleanParam(name: 'e2e', description: 'Run the e2e test as part of the build', defaultValue: true)
  }

  environment {
    ARTIFACTORY_CREDENTIALS = credentials('artifactory')
    CI = "true"
    SMARTLING_USER_IDENTIFIER = credentials('smartling-user-identifier')
    SMARTLING_USER_SECRET = credentials('smartling-user-secret')
  }

  triggers {
    issueCommentTrigger('.*test this please.*')
  }

  stages {

    stage('validate') {
      steps {
        script {
          rxValidateBuild(forceBuild: params.force_build)
        }
      }
    }

    stage('decide version') {
      stages {

        stage('minor version') {
          when { branch "master" }
          steps {
            script {
              env.newTag = rally_git_nextTag('minor')
              env.newVersion = env.newTag.replaceAll('v', '')
            }
          }
        }

        stage('snapshot version') {
          when { not { branch "master" } }
          steps {
            script {
              env.newTag = rally_git_nextTag('rally-versioning')
              env.newVersion = env.newTag.replaceAll('v', '')
            }
          }
        }

      }
    }

    stage('build') {
      parallel {
        stage('e2e docker image') {
          agent {
            label 'ec2'
          }
          steps {
            script {
              sh '''
                # Create executable E2E test docker image.
                echo $ARTIFACTORY_CREDENTIALS > artifactory_credentials  # This is removed in post.
                DOCKER_BUILDKIT=1 docker build . \
                  --secret id=artifactory_credentials,src=artifactory_credentials \
                  -f Dockerfile.wdio \
                  -t rx/rx-ui-e2e-test:$newVersion
                docker tag rx/rx-ui-e2e-test:$newVersion docker.werally.in/rx/rx-ui-e2e-test:$newVersion
                docker push docker.werally.in/rx/rx-ui-e2e-test:$newVersion
              '''
            }
          }
        }

        stage('yarn') {
          agent {
            dockerfile {
              filename 'Dockerfile.build'
              args '-u root:root'
              reuseNode true
            }
          }

          stages {
            stage('install') {
              steps {
                script {
                  if (params.clean) {
                    sh 'rm -rf node_modules'
                  }

                  sh '''
                    # Configure NPM and install dependencies.
                    ./scripts/yarn_install_ci.sh
                  '''
                }
              }
            }

            stage('translate') {
              stages {
                stage('when master') {
                  when { branch "master" }

                  steps {
                    sh '''
                      yarn smartling:translate
                    '''
                  }
                }

                stage('when not master') {
                  when { not { branch "master" } }

                  steps {
                    sh '''
                      yarn smartling:download
                    '''
                  }
                }
              }
            }

            stage('outdated') {
              when { expression { env.CHANGE_ID != null } }

              steps {
                script {
                  rxUpdatePullRequestComment('Yarn Outdated results\n', sh(
                    script: './scripts/outdated.sh',
                    returnStdout: true
                  ))
                }
              }
            }

            stage('build') {
              steps {
                script {
                  sh '''
                    # Concurrently:
                    # - [lint]  run the code linter
                    # - [test]  run tests with coverage
                    # - [build] create production code bundles
                    concurrently -n lint,test,build \
                      "yarn lint" \
                      "yarn test --coverage" \
                      "yarn build-all $newVersion"

                    # Fail build if source code has changed.
                    git diff-index --quiet HEAD || (echo "Failing build because it is dirty, meaning something changed in the code when running the build tasks which caused a mismatch with what is in the git repository. Example: try running yarn install and re-committing." && echo "Changed files:" && git status --porcelain && false)
                  '''

                  // Check dependencies.
                  rally_dependencyCheck_yarnAudit(env.CHANGE_ID)

                  // Upload test results.
                  rally_codeCov_upload()
                }
              }
            }
          }
        }
      }
    }

    stage('push git tag') {
      when { branch "master" }
      steps {
        script {
          rally_git_pushTag(env.newTag, "Releasing ${app} as ${env.newVersion}")
        }
      }
    }

    stage('docker push') {
      steps {
        sh '''
          # Create production docker image.
          docker build . -t rx/rx-ui:$newVersion
          docker tag rx/rx-ui:$newVersion docker.werally.in/rx/rx-ui:$newVersion
          docker push docker.werally.in/rx/rx-ui:$newVersion
        '''
      }
    }

    stage('docker push latest') {
      when { branch "master" }
      steps {
        // Tag and push.
        // The extra 'pull' is present before tagging just in case this runs on a different agent than the image was built on.
        sh '''
          docker pull docker.werally.in/rx/rx-ui:$newVersion
          docker tag docker.werally.in/rx/rx-ui:$newVersion docker.werally.in/rx/rx-ui:latest
          docker push docker.werally.in/rx/rx-ui:latest

          docker pull docker.werally.in/rx/rx-ui-e2e-test:$newVersion
          docker tag docker.werally.in/rx/rx-ui-e2e-test:$newVersion docker.werally.in/rx/rx-ui-e2e-test:latest
          docker push docker.werally.in/rx/rx-ui-e2e-test:latest
        '''
      }
    }

    stage('Deploy lean subtenant & run E2E tests') {
      when {
        allOf {
          not { branch "master" }
          expression { env.MULTI_DEPLOY_TENANT != null }
          expression { env.MULTI_DEPLOY_TENANT != "" }
          expression { params.e2e }
        }
      }

      steps {
        script {
          rxE2EPipeline.runPR(app, env.newVersion, env.CHANGE_ID, getTicket(env.CHANGE_TITLE), env.MULTI_DEPLOY_TENANT)
        }
      }
    }

    stage('Deploy full subtenant & run E2E tests') {
      when { branch "master" }

      steps {
        script {
          rxE2EPipeline.runMaster(app, env.newVersion, env.BUILD_NUMBER, env.MULTI_DEPLOY_TENANT)
        }
      }
    }

    stage('Trigger CD') {
      when { branch "master" }

      steps { rxCd(app, env.newVersion) }

    }
  }

  post {
    success {
      script {
        currentBuild.description = env.newVersion
      }
    }
    always {
      sh 'rm -f artifactory_credentials' // Delete the docker secret file in case it's still present.
      cobertura coberturaReportFile: '**/coverage/cobertura-coverage.xml', onlyStable: false
    }
    failure {
      script {
        if (env.BRANCH_NAME == 'master') {
          def buildUrl = env.BUILD_URL
          rxSlackSend {
            message = ":blob_sad_with_raincloud: `master` build of `$app` failed :blob_sad_with_raincloud:\n$buildUrl"
          }
        }
      }
    }
  }
}
