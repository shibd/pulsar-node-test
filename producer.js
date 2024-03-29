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

  // const params = {
  //   issuer_url: "https://dev-kt-aa9ne.us.auth0.com",
  //   client_id: "Xd23RHsUnvUlP7wchjNYOaIfazgeHd9x",
  //   client_secret: "rT7ps7WY8uhdVuBTKWZkttwLdQotmdEliaM5rLfmgNibvqziZ-g07ZH52N_poGAb",
  //   audience: "https://dev-kt-aa9ne.us.auth0.com/api/v2/",
  // }
  // const auth = new Pulsar.AuthenticationOauth2(params);

   // oauth2 + ssl
  const auth = new Pulsar.AuthenticationTls({
    certificatePath: './run-pulsar/client-cert.pem',
    privateKeyPath: './run-pulsar/client-key.pem',
  });

  // Create a client
  const client = new Pulsar.Client({
    serviceUrl: 'pulsar+ssl://localhost:6650',
    authentication: auth,
    operationTimeoutSeconds: 30,
    tlsTrustCertsFilePath: './run-pulsar/cacert.pem',
    useTls: true,
    tlsValidateHostname: false,
    tlsAllowInsecureConnection: false,
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
