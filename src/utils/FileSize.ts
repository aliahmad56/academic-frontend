// Function to convert bytes to gigabytes
export function bytesToGB(bytes: any): string {
    const GIGABYTE = 1024 ** 3; // 1 GB = 1024^3 bytes
    const gbValue = bytes / GIGABYTE;
    return gbValue.toFixed(2); // Returns the value rounded to 2 decimal places
  }
  
  // Function to convert bytes to megabytes
  export function bytesToMB(bytes: any): string {
    const MEGABYTE = 1024 ** 2; // 1 MB = 1024^2 bytes
    const mbValue = bytes / MEGABYTE;
    return mbValue.toFixed(2); // Returns the value rounded to 2 decimal places
  }