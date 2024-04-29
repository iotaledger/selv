# Selv - Digital Identity Demonstrator

## Profile
- DID IOTA
- DID Key / DID JWK
- [Self-Issued OpenID Provider v2 - draft 13](https://openid.net/specs/openid-connect-self-issued-v2-1_0.html)
    - Non-Pre-Registered Relying Party/Decentralized Identifiers
- [OpenID for Verifiable Presentations - draft 20](https://openid.net/specs/openid-4-verifiable-presentations-1_0.html)
- [OpenID for Verifiable Credential Issuance - draft 13](https://openid.net/specs/openid-4-verifiable-credential-issuance-1_0.html)
    - Pre-Authorized Code Flow

## Architecture

## Development

### Requirements 
- docker
- IOTA Sandbox

### Setup
Add following domains to your host files:
- `selv.local`
- `backend.selv.local`
- `bank.selv.local`
- `government.selv.local`
- `insurance.selv.local`

### Tooling
1. create stronghold
1. copy to data
1. copy stronghold pw, keyIds and fragments in docker-compose

### API
Find an API description in `tooling/API`, use [httpyac](
https://httpyac.github.io/guide/installation_vscode.html) to explore.

### Run
`docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build`



https://stackoverflow.com/a/73376302