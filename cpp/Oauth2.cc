#include <pulsar/Authentication.h>
#include <pulsar/Client.h>

#include <thread>

int main() {
    pulsar::AuthenticationDataPtr data;
    std::string params = R"({
        "issuer_url": "https://auth.test.cloud.gcp.streamnative.dev/",
        "client_id": "AsHz6Q1ZC9UrrrwCdvVut0nFpWSBnPEh",
        "client_secret": "PUPUa3JL0XAD32SRsQCHl4B7CQ2wSJKTzKONzUMOjwBBMhjPMDc2VIPkQfTup8gx",
        "audience": "urn:sn:pulsar:o-sixlu:baodi-test"})";

    int expectedTokenLength = 3379;
    pulsar::AuthenticationPtr auth = pulsar::AuthOauth2::create(params);

    pulsar::ClientConfiguration clientConfiguration;
    clientConfiguration.setTlsTrustCertsFilePath("/etc/ssl/cert.pem");
    clientConfiguration.setAuth(auth);

    pulsar::Client client("pulsar+ssl://baodi-test-7407d844-b456-49e1-987c-24f1a5c162cb.usce1-whale.test.g.sn2.dev:6651", clientConfiguration);

    pulsar::Producer producer;
    client.createProducer("test-topic", producer);

    producer.send(pulsar::MessageBuilder().setContent("test-msg").build());

    client.close();
}