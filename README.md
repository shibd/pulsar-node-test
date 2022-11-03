# pulsar-node-test


## 1. Install C++ Client

### Install on Linux

1. Require g++ and make commands to install pulsar-client
```
# rpm
$ yum install gcc-c++ make

# debian
$ apt-get install g++ make
```

2. Download rpm or debian packages.
```
# Set the version of Pulsar C++ client to install
$ PULSAR_CPP_CLIENT_VERSION=2.9.1

# rpm
$ wget https://archive.apache.org/dist/pulsar/pulsar-${PULSAR_CPP_CLIENT_VERSION}/RPMS/apache-pulsar-client-${PULSAR_CPP_CLIENT_VERSION}-1.x86_64.rpm
$ wget https://archive.apache.org/dist/pulsar/pulsar-${PULSAR_CPP_CLIENT_VERSION}/RPMS/apache-pulsar-client-devel-${PULSAR_CPP_CLIENT_VERSION}-1.x86_64.rpm

# debian
$ wget https://archive.apache.org/dist/pulsar/pulsar-${PULSAR_CPP_CLIENT_VERSION}/DEB/apache-pulsar-client.deb
$ wget https://archive.apache.org/dist/pulsar/pulsar-${PULSAR_CPP_CLIENT_VERSION}/DEB/apache-pulsar-client-dev.deb
```

3. Install the Pulsar C++ client.
```shell
# rpm
$ rpm -ivh apache-pulsar-client*.rpm

# debian
$ apt install ./apache-pulsar-client*.deb
```


## 2. Install Pulsar Node NAPI

```shell
npm install
```


## 3. Start Pulsar Standalone
```shell
./run-pulsar/pulsar-test-service-start.sh
```

## 4. Test producer and consumer
```shell
node producer.js
```