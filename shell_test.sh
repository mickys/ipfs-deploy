# set -o errexit
IPFSHASH=`./bin/ipfs-deploy.js -O -C -p infura build -s burneth.com -d cloudflare`
EXITCODE=$?

echo "Exit Code: $EXITCODE - $IPFSHASH"

if [ $EXITCODE? != 0 ]; then                   
   echo "error: ${?}\n". 1>&2 && exit 1
fi

exit
