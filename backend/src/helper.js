const Datastore = require('nedb-async').default

const dbDID = new Datastore({
  filename: './db/did.db',
  autoload: true
})

exports.storeOwnIdentity = async function (identity) {
  await dbDID.asyncInsert(identity)
}

exports.getOwnIdentity = async function () {
  const identities = await dbDID.asyncFind({})
  return identities && identities.length > 0 ? identities[0] : null
}
