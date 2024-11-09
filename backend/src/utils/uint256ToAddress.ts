export function uint256ToAddress(uint256: bigint): string {
    // Convert the BigInt to a hex string
    let hexString = uint256.toString(16);
  
    // Add leading zeros to ensure the string length is 40
    hexString = hexString.padStart(40, '0');
  
    // Add the '0x' prefix
    return '0x' + hexString;
  }