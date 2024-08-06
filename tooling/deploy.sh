mv ./.env ../.env
mv ./stronghold.hodl ../data/
mv ./stronghold_secret.txt ../data/
mv ./government-did-configuration.json ../data/
mv ./bank-did-configuration.json ../data/
mv ./insurance-did-configuration.json ../data/

scp ../.env root@selv.iota.org:/opt/selv/ 
scp ../data/stronghold.hodl root@selv.iota.org:/opt/selv/data/
scp ../data/stronghold_secret.txt root@selv.iota.org:/opt/selv/data/ 
scp ../data/government-did-configuration.json root@selv.iota.org:/opt/selv/data/static/government/did-configuration.json
scp ../data/bank-did-configuration.json root@selv.iota.org:/opt/selv/data/static/bank/did-configuration.json
scp ../data/insurance-did-configuration.json root@selv.iota.org:/opt/selv/data/static/insurance/did-configuration.json

sed -i -e 's/.selv.iota.org\//.selv.local:${HTTP_PORT}/g' ../.env