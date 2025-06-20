pipeline {
    agent any

    tools {
        nodejs 'NodeJS'
    }

    environment {
        EC2_USER = 'ubuntu'
        SSH_KEY = credentials('ssh-key-ec2')

        PORT = '3000'
        DB_HOST = credentials('db-host')
        DB_PASSWORD = credentials('db-password')
        DB_DATABASE = credentials('db-database')
        DB_USER= credentials('db-user')
        SECRET_KEY = credentials('secret-key')
        EMAIL_USER = credentials('email-user')
        EMAIL_PASSWORD = credentials('email-password')

        DEV_IP = '34.196.209.255'
        QA_IP  = '34.230.141.77'
        PROD_IP = '107.21.162.242'
        REMOTE_PATH = '/home/ubuntu/Micro_servicio_users'
    }

    stages {
        stage('Detect Branch') {
            steps {
                script {
                    env.ACTUAL_BRANCH = env.GIT_BRANCH?.replaceFirst(/^origin\//, '') ?: 'master'
                    echo "🔍 Rama activa: ${env.ACTUAL_BRANCH}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    def ip = env.ACTUAL_BRANCH == 'develop' ? DEV_IP :
                             env.ACTUAL_BRANCH == 'qa'      ? QA_IP :
                             env.ACTUAL_BRANCH == 'main'    ? PROD_IP : null

                    def pm2_name = "${env.ACTUAL_BRANCH}-health"

                    if (ip == null) {
                        error "Branch ${env.ACTUAL_BRANCH} no está configurada para despliegue."
                    }

                    sh """
                    ssh -i $SSH_KEY -o StrictHostKeyChecking=no $EC2_USER@$ip '
                        echo "📦 Actualizando sistema..."
                        sudo apt-get update -y &&
                        sudo apt-get upgrade -y

                        echo "📥 Verificando Node.js..."
                        if ! command -v node > /dev/null; then
                            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
                            sudo apt-get install -y nodejs
                        fi

                        echo "📥 Verificando PM2..."
                        if ! command -v pm2 > /dev/null; then
                            sudo npm install -g pm2
                        fi

                        echo "📁 Verificando carpeta de app..."
                        if [ ! -d "$REMOTE_PATH/.git" ]; then
                            git clone https://github.com/AlbertoSMC72/Micro_servicio_users.git $REMOTE_PATH
                        fi

                        echo "Creado credenciales .env..."
                        if [ ! -f "$REMOTE_PATH/.env" ]; then
                            echo "PORT=${PORT}" > $REMOTE_PATH/.env &&
                            echo "DB_HOST=${DB_HOST}" >> $REMOTE_PATH/.env &&
                            echo "DB_PASSWORD=${DB_PASSWORD}" >> $REMOTE_PATH/.env &&
                            echo "DB_DATABASE=${DB_DATABASE}" >> $REMOTE_PATH/.env &&
                            echo "DB_USER=${DB_USER}" >> $REMOTE_PATH/.env &&
                            echo "SECRET_KEY=${SECRET_KEY}" >> $REMOTE_PATH/.env &&
                            echo "EMAIL_USER=${EMAIL_USER}" >> $REMOTE_PATH/.env &&
                            echo "EMAIL_PASSWORD=${EMAIL_PASSWORD}" >> $REMOTE_PATH/.env
                        fi

                        echo "🔁 Pull y deploy..."
                        cd $REMOTE_PATH &&
                        git pull origin ${env.ACTUAL_BRANCH} &&
                        npm ci &&
                        pm2 restart ${pm2_name} || pm2 start app.js --name ${pm2_name}
                    '
                    """
                }
            }
        }
    }
}