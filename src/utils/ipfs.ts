// IPFS utilities for uploading token metadata and logos

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export class IPFSService {
  private pinataApiKey: string;
  private pinataSecretKey: string;

  constructor(apiKey: string, secretKey: string) {
    this.pinataApiKey = apiKey;
    this.pinataSecretKey = secretKey;
  }

  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append('pinataMetadata', metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append('pinataOptions', options);

    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.pinataApiKey}`,
        },
        body: formData,
      });

      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw error;
    }
  }

  async uploadJSON(data: any): Promise<string> {
    try {
      const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.pinataApiKey}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      return `ipfs://${result.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw error;
    }
  }

  async createTokenMetadata(
    name: string,
    symbol: string,
    description: string,
    logoFile: File,
    website?: string,
    twitter?: string,
    telegram?: string,
    discord?: string
  ): Promise<string> {
    // First upload the logo
    const logoIPFS = await this.uploadFile(logoFile);

    // Create metadata object
    const metadata: TokenMetadata = {
      name,
      symbol,
      description,
      image: logoIPFS,
      external_url: website,
      attributes: [
        { trait_type: 'Symbol', value: symbol },
        { trait_type: 'Type', value: 'Meme Token' },
        { trait_type: 'Network', value: 'Ronin' }
      ]
    };

    // Add social links as attributes if provided
    if (twitter) {
      metadata.attributes.push({ trait_type: 'Twitter', value: twitter });
    }
    if (telegram) {
      metadata.attributes.push({ trait_type: 'Telegram', value: telegram });
    }
    if (discord) {
      metadata.attributes.push({ trait_type: 'Discord', value: discord });
    }

    // Upload metadata JSON
    return await this.uploadJSON(metadata);
  }

  static getIPFSUrl(hash: string): string {
    // Remove ipfs:// prefix if present
    const cleanHash = hash.replace('ipfs://', '');
    return `https://gateway.pinata.cloud/ipfs/${cleanHash}`;
  }
}

// Default IPFS service instance (you'll need to set up Pinata API keys)
export const ipfsService = new IPFSService(
  process.env.VITE_PINATA_API_KEY || '',
  process.env.VITE_PINATA_SECRET_KEY || ''
);