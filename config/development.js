module.exports.port = 3000;

module.exports.mongo = {
    host: "odin-api-db",
    port: 27017,
    database: "odin-api"
};

module.exports.ldap = {
    host: "odin-api-ldap",
    port: 389,
    organisation: "AlbertPrime",
    domain: "albertprime.co.za",
    password: "deadjosh",
    root: "cn=admin,dc=albertprime,dc=co,dc=za"
};