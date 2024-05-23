use identity_eddsa_verifier::EdDSAJwsVerifier;
use identity_iota::credential::Jws;
use identity_iota::document::verifiable::JwsVerificationOptions;
use identity_iota::iota::IotaClientExt;
use identity_iota::iota::IotaDocument;
use identity_iota::iota::IotaIdentityClientExt;
use identity_iota::iota::NetworkName;
use identity_iota::resolver::Resolver;
use identity_iota::storage::JwkDocumentExt;
use identity_iota::storage::KeyId;
use identity_iota::storage::MethodDigest;
use identity_stronghold::ED25519_KEY_TYPE;

use rand::distributions::{Alphanumeric, DistString};
use tooling::get_address_with_funds;

use identity_iota::storage::JwsSignatureOptions;
use identity_iota::storage::KeyIdStorage;
use identity_iota::storage::Storage;
use identity_iota::verification::jws::DecodedJws;
use identity_iota::verification::jws::JwsAlgorithm;
use identity_iota::verification::MethodScope;
use identity_stronghold::StrongholdStorage;
use iota_sdk::client::secret::stronghold::StrongholdSecretManager;
use iota_sdk::client::Client;
use iota_sdk::client::Password;
use iota_sdk::types::block::address::Address;
use iota_sdk::types::block::output::AliasOutput;

use std::io::Write;

// The API endpoint of an IOTA node, e.g. Hornet.
// const API_ENDPOINT: &str = "http://localhost";
const API_ENDPOINT: &str = "https://api.testnet.shimmer.network";

// The faucet endpoint allows requesting funds for testing purposes.
// const FAUCET_ENDPOINT: &str = "http://localhost/faucet/api/enqueue";
const FAUCET_ENDPOINT: &str = "https://faucet.testnet.shimmer.network/api/enqueue";

// Stronghold snapshot path.
const PATH: &str = "./stronghold.hodl";

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let mut issuers = std::env::args().skip(1).peekable();

    if issuers.peek().is_none() {
        anyhow::bail!("A list of names for the issuers must be provided.");
    }

    let pw_string = Alphanumeric.sample_string(&mut rand::thread_rng(), 32);

    // Stronghold password.
    let password: Password = Password::from(pw_string.clone());

    // Create a new client to interact with the IOTA ledger.
    let client: Client = Client::builder()
        .with_primary_node(API_ENDPOINT, None)?
        .finish()
        .await?;

    let stronghold = StrongholdSecretManager::builder()
        .password(password.clone())
        .build(PATH)?;

    // Create a `StrongholdStorage`.
    // `StrongholdStorage` creates internally a `SecretManager` that can be
    // referenced to avoid creating multiple instances around the same stronghold snapshot.
    let stronghold_storage = StrongholdStorage::new(stronghold);
    println!("Created stronghold with pwd: {pw_string}");
    // Persist stronghold's password to file.
    let mut stronghold_pwd_file = std::fs::File::create("stronghold_secret.txt")?;
    write!(stronghold_pwd_file, "{pw_string}")?;

    let mut env_file = std::fs::File::create(".env")?;
    writeln!(env_file, "HTTP_PORT=81\nGRPC_PORT=5001")?;
    for name in issuers {
        let (did, key_id, fragment, _address) = create_issuer(&stronghold_storage, &client).await?;
        let name = name.to_uppercase();
        writeln!(env_file, "ISSUERS_{name}_DID={did}")?;
        writeln!(env_file, "ISSUERS_{name}_KEYID={key_id}")?;
        writeln!(env_file, "ISSUERS_{name}_FRAGMENT={fragment}")?;
        writeln!(
            env_file,
            "{name}_PUBLIC_URL=https://{}.selv.local.${{HTTP_PORT}}",
            name.to_lowercase()
        )?;
    }

    Ok(())
}

async fn create_issuer(
    stronghold_storage: &StrongholdStorage,
    client: &Client,
) -> anyhow::Result<(String, KeyId, String, Address)> {
    // Create a DID document.
    let address: Address = get_address_with_funds(
        client,
        stronghold_storage.as_secret_manager(),
        FAUCET_ENDPOINT,
    )
    .await?;
    let network_name: NetworkName = client.network_name().await?;
    let mut document: IotaDocument = IotaDocument::new(&network_name);

    // Create storage for key-ids and JWKs.
    //
    // In this example, the same stronghold file that is used to store
    // key-ids as well as the JWKs.
    let storage = Storage::new(stronghold_storage.clone(), stronghold_storage.clone());

    // Generates a verification method. This will store the key-id as well as the private key
    // in the stronghold file.
    let fragment = document
        .generate_method(
            &storage,
            ED25519_KEY_TYPE.clone(), // TODO change this in stronghold example aswell
            JwsAlgorithm::EdDSA,
            None,
            MethodScope::VerificationMethod,
        )
        .await?;

    let method = document
        .resolve_method(&fragment, Some(MethodScope::VerificationMethod))
        .ok_or(anyhow::anyhow!("no go"))?;
    let key_id = storage
        .key_id_storage()
        .get_key_id(&MethodDigest::new(method)?)
        .await?;

    // Construct an Alias Output containing the DID document, with the wallet address
    // set as both the state controller and governor.
    let alias_output: AliasOutput = client.new_did_output(address, document, None).await?;

    // Publish the Alias Output and get the published DID document.
    let document: IotaDocument = client
        .publish_did_output(stronghold_storage.as_secret_manager(), alias_output)
        .await?;

    // Resolve the published DID Document.
    let mut resolver = Resolver::<IotaDocument>::new();
    resolver.attach_iota_handler(client.clone());
    let resolved_document: IotaDocument = resolver.resolve(document.id()).await.unwrap();

    // Sign data with the created verification method.
    let data = b"test_data";
    let jws: Jws = resolved_document
        .create_jws(&storage, &fragment, data, &JwsSignatureOptions::default())
        .await?;

    // Verify Signature.
    let decoded_jws: DecodedJws = resolved_document.verify_jws(
        &jws,
        None,
        &EdDSAJwsVerifier::default(),
        &JwsVerificationOptions::default(),
    )?;

    assert_eq!(
        String::from_utf8_lossy(decoded_jws.claims.as_ref()),
        "test_data"
    );
    Ok((document.id().to_string(), key_id, fragment, address))
}
