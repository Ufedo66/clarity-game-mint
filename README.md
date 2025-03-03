# GameMint
A blockchain-powered gaming NFT minting platform built on Stacks using Clarity.

## Features
- Mint gaming NFTs with unique attributes
- Transfer NFTs between accounts
- View NFT details and ownership
- Configure minting parameters (admin only)
- Set NFT metadata including game, rarity and stats

## Setup and Installation
1. Clone the repository
2. Install Clarinet
3. Run `clarinet check` to verify contracts
4. Run `clarinet test` to execute test suite

## Usage Examples
```clarity
;; Mint a new gaming NFT
(contract-call? .game-mint mint {
  game: "CryptoQuest",
  rarity: "legendary",
  stats: {strength: u80, speed: u70, magic: u90}
})

;; Transfer an NFT
(contract-call? .game-mint transfer u1 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM)

;; Get NFT details
(contract-call? .game-mint get-token-details u1)
```

## Dependencies
- Clarity language
- Clarinet for testing and deployment
