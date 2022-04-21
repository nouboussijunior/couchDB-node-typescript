#!/bin/bash

OS_USER_GROUP="${OS_USER_GROUP:=gitpod:gitpod}"

CDB_USER="${CDB_USER:-Administrator}"
CDB_PSWD="${CDB_PSWD:-password}"
CDB_HOST="${CDB_HOST:-127.0.0.1}"
CDB_PORT="${CDB_PORT:-8091}"
CDB_NAME="${CDB_NAME:-cbgitpod}"

CDB_SERVICES="${CDB_SERVICES:-data,query,index,fts,eventing,analytics}"

CDB_KV_RAMSIZE="${CDB_KV_RAMSIZE:-256}"
CDB_INDEX_RAMSIZE="${CDB_INDEX_RAMSIZE:-256}"
CDB_FTS_RAMSIZE="${CDB_FTS_RAMSIZE:-256}"
CDB_EVENTING_RAMSIZE="${CDB_EVENTING_RAMSIZE:-512}"
CDB_ANALYTICS_RAMSIZE="${CDB_ANALYTICS_RAMSIZE:-1024}"

set -euo pipefail

COUCHBASE_TOP=/opt/couchbase
sudo chown -R ${OS_USER_GROUP} ${COUCHBASE_TOP}/var

echo "Start couchbase..."
couchbase-server --start

echo "Waiting for couchbase-server..."
until curl -s http://${CDB_HOST}:${CDB_PORT}/pools > /dev/null; do
    sleep 5
    echo "Waiting for couchbase-server..."
done

echo "Waiting for couchbase-server... ready"

if ! couchbase-cli server-list -c ${CDB_HOST}:${CDB_PORT} -u ${CDB_USER} -p ${CDB_PSWD} > /dev/null; then
  echo "couchbase cluster-init..."
  couchbase-cli cluster-init \
        --services ${CDB_SERVICES} \
        --cluster-name ${CDB_NAME} \
        --cluster-username ${CDB_USER} \
        --cluster-password ${CDB_PSWD} \
        --cluster-ramsize ${CDB_KV_RAMSIZE} \
        --cluster-index-ramsize ${CDB_INDEX_RAMSIZE} \
        --cluster-fts-ramsize ${CDB_FTS_RAMSIZE} \
        --cluster-eventing-ramsize ${CDB_EVENTING_RAMSIZE} \
        --cluster-analytics-ramsize ${CDB_ANALYTICS_RAMSIZE}
fi

sleep 3
