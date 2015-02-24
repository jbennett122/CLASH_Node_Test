watch -n 15 '/usr/local/bin/forever list | perl -ne "if ( m#No forever processes running# ) {system \"cd /srv/www/esl-clash && ./restart.sh\"; }"'


