#!/usr/local/bin/bash
if (-a serverfail.log) then
    mail -a /root/.forever/*.log -s "ESL-CLASH Server Failure!" jward054@odu.edu < /dev/null
    mail -a /root/.forever/*.log -s "ESL-CLASH Server Failure!" eosab001@odu.edu < /dev/null
#    /usr/local/bin/forever start -c nodemon test.js
fi
if (!(-a serverfail.log)) then
    mail -s "Server Failure first reboot attempt" jward054@odu.edu < /dev/null
    mail -s "Server Failure first reboot attempt" eosab001@odu.edu < /dev/null
    echo mail sent $TIME >>serverfail.log
    /usr/local/bin/forever start -c nodemon test.js
fi
