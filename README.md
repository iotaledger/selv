# Digital Identity Narratives as a Service PoC

# Requirements 
- docker
- Sandbox

# Tooling
- create stronghold
- copy to data
- copy stronghold pw and fragments

# API
- Postman collection in `./tooling`
https://httpyac.github.io/guide/installation_vscode.html

`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build`

Profile
- DID IOTA
- DID Key / DID JWK
- [Self-Issued OpenID Provider v2 - draft 13](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html)
    - Non-Pre-Registered Relying Party/Decentralized Identifiers
- [OpenID for Verifiable Presentations - draft 20](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [OpenID for Verifiable Credential Issuance - draft 13](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
    - Pre-Authorized Code Flow


https://stackoverflow.com/a/73376302