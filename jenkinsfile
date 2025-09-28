pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {
        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/paventhan183/apartment-sale-listing.git',
                    credentialsId: 'GITHUB_TOKEN'  // use Jenkins stored credential
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to GitHub Pages') {
            steps {
                withCredentials([string(credentialsId: 'GITHUB_TOKEN', variable: 'TOKEN')]) {
                    sh '''
                    git config user.email "paventhanbtech1990@gmail.com"
                    git config user.name "paventhan"
                    git remote set-url origin https://paventhan:${TOKEN}@github.com/paventhan183/apartment-sale-listing.git
                    npm run deploy
                    '''
                }
            }
        }
    }
}
