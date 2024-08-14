import { ParsedDIDResult } from "src/context/globalState";

export const getExplorerLinkFromDID = (did: string, parsedDID: ParsedDIDResult): string => {
    
    switch (parsedDID.network) {
        case "smr":
            return `https://explorer.iota.org/shimmer/addr/${parsedDID.aliasAddress}?tab=DID`

        case "rms":
            return `https://explorer.iota.org/shimmer-testnet/addr/${parsedDID.aliasAddress}?tab=DID`

        case "atoi":
            return `https://explorer.iota.org/iota-testnet/addr/${parsedDID.aliasAddress}?tab=DID`

        case "iota":
            return `https://explorer.iota.org/mainnet/addr/${parsedDID.aliasAddress}?tab=DID`
    
        default:
            return "";
    }

}