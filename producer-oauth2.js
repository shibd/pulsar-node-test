/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

const Pulsar = require('pulsar-client');
const SegfaultHandler = require('segfault-handler');

SegfaultHandler.registerHandler('crash.log');


(async () => {

  Pulsar.Client.setLogHandler((level, file, line, message) => {
    console.log('[%s][%s:%d] %s', Pulsar.LogLevel.toString(level), file, line, message);
  });

  const params = {
    client_id: "AsHz6Q1ZC9UrrrwCdvVut0nFpWSBnPEh",
    issuer_url: "https://auth.test.cloud.gcp.streamnative.dev/",
    client_secret: "PUPUa3JL0XAD32SRsQCHl4B7CQ2wSJKTzKONzUMOjwBBMhjPMDc2VIPkQfTup8gx",
    audience: "urn:sn:pulsar:o-sixlu:baodi-test",
  }
  const auth = new Pulsar.AuthenticationOauth2(params);

  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar+ssl://baodi-test-7407d844-b456-49e1-987c-24f1a5c162cb.usce1-whale.test.g.sn2.dev:6651',
    authentication: auth,
    tlsTrustCertsFilePath:'/etc/ssl/cert.pem',
    useTls: true,
    tlsValidateHostname: true,
    tlsAllowInsecureConnection: true,
  });

  // Create a producer
  const producer = await client.createProducer({
    topic: 'test-oauth2',
    sendTimeoutMs: 30000,
    batchingEnabled: true,
  });

  // Create a consumer
  const consumer = await client.subscribe({
    topic: 'test-oauth2',
    subscription: 'sub1',
    subscriptionType: 'Shared',
    ackTimeoutMs: 10000,
  });

  // Send messages
  for (let i = 0; i < 10; i += 1) {
    const msg = `my-message-${i}`;
    producer.send({
      data: Buffer.from(msg),
    });
    console.log(`Sent message: ${msg}`);
  }

  // Receive messages
  for (let i = 0; i < 10; i += 1) {
    const msg = await consumer.receive();
    console.log(msg.getData().toString());
    consumer.acknowledge(msg);
  }

  await client.close();
})();
