// export async function getResolver() {
//     const { Resolver } = await import('did-resolver');
//     const keyResolver = await import('key-did-resolver');
//     const webResolver = await import('web-did-resolver');
  
//     const keyDidResolver = keyResolver.getResolver();
//     const webDidResolver = webResolver.getResolver();
//     const iotaDidResolver = iotaResolver.getResolver();
  
//     return new Resolver({
//       ...keyDidResolver,
//       ...webDidResolver,
//       ...iotaDidResolver
//     });
//   }