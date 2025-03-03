import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Test NFT minting",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    
    const metadata = {
      game: "CryptoQuest",
      rarity: "legendary",
      stats: {
        strength: 80,
        speed: 70,
        magic: 90
      }
    };
    
    let block = chain.mineBlock([
      Tx.contractCall('game-mint', 'mint', [
        types.tuple({
          game: types.ascii(metadata.game),
          rarity: types.ascii(metadata.rarity),
          stats: types.tuple({
            strength: types.uint(metadata.stats.strength),
            speed: types.uint(metadata.stats.speed),
            magic: types.uint(metadata.stats.magic)
          })
        })
      ], deployer.address)
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectUint(1);
    
    // Verify token details
    const response = chain.callReadOnlyFn(
      'game-mint',
      'get-token-details',
      [types.uint(1)],
      deployer.address
    );
    
    response.result.expectOk().expectSome();
  }
});

Clarinet.test({
  name: "Test NFT transfer",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const wallet1 = accounts.get('wallet_1')!;
    
    // First mint an NFT
    let block = chain.mineBlock([
      Tx.contractCall('game-mint', 'mint', [
        types.tuple({
          game: types.ascii("CryptoQuest"),
          rarity: types.ascii("legendary"),
          stats: types.tuple({
            strength: types.uint(80),
            speed: types.uint(70),
            magic: types.uint(90)
          })
        })
      ], deployer.address)
    ]);
    
    // Transfer the NFT
    block = chain.mineBlock([
      Tx.contractCall(
        'game-mint',
        'transfer',
        [types.uint(1), types.principal(wallet1.address)],
        deployer.address
      )
    ]);
    
    assertEquals(block.receipts.length, 1);
    block.receipts[0].result.expectOk().expectBool(true);
    
    // Verify new owner
    const response = chain.callReadOnlyFn(
      'game-mint',
      'get-token-owner',
      [types.uint(1)],
      deployer.address
    );
    
    response.result.expectOk().expectSome().expectPrincipal(wallet1.address);
  }
});
