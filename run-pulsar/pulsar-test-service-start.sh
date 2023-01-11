#!/usr/bin/env bash
#
# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
#

set -e

SRC_DIR=$(git rev-parse --show-toplevel)
cd $SRC_DIR

./run-pulsar/pulsar-test-service-stop.sh

#CONTAINER_ID=$(docker run -i -p 8080:8080 -p 6650:6650 -p 8443:8443 -p 6651:6651 --rm --detach apachepulsar/pulsar:latest sleep 3600)
CONTAINER_ID=$(docker run -i -p 8080:8080 -p 6650:6650 -p 8443:8443 -p 6651:6651 --rm --detach apachepulsar/java-test-image:2.12.0-SNAPSHOT sleep 3600)


echo $CONTAINER_ID >.tests-container-id.txt

docker cp $SRC_DIR/run-pulsar $CONTAINER_ID:/pulsar/test-conf
docker cp $SRC_DIR/run-pulsar/pulsar-test-container-start.sh $CONTAINER_ID:pulsar-test-container-start.sh

docker exec -i $CONTAINER_ID /pulsar-test-container-start.sh

echo "-- Ready to start tests"
