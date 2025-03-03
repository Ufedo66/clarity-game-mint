;; GameMint NFT Contract
(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-token-not-found (err u101))
(define-constant err-not-token-owner (err u102))

;; Data Variables
(define-non-fungible-token game-nft uint)
(define-data-var last-token-id uint u0)

;; NFT Metadata Map
(define-map token-metadata uint {
  game: (string-ascii 64),
  rarity: (string-ascii 32),
  stats: {
    strength: uint,
    speed: uint,
    magic: uint
  }
})

;; Core Functions
(define-public (mint (metadata {
  game: (string-ascii 64),
  rarity: (string-ascii 32),
  stats: {
    strength: uint,
    speed: uint,
    magic: uint
  }
}))
  (let ((token-id (+ (var-get last-token-id) u1)))
    (try! (nft-mint? game-nft token-id tx-sender))
    (map-set token-metadata token-id metadata)
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

(define-public (transfer (token-id uint) (recipient principal))
  (begin
    (assure-token-owner token-id)
    (try! (nft-transfer? game-nft token-id tx-sender recipient))
    (ok true)
  )
)

;; Read Functions
(define-read-only (get-token-details (token-id uint))
  (ok (map-get? token-metadata token-id))
)

(define-read-only (get-token-owner (token-id uint))
  (ok (nft-get-owner? game-nft token-id))
)

;; Helper Functions
(define-private (assure-token-owner (token-id uint))
  (let ((owner (unwrap! (nft-get-owner? game-nft token-id) err-token-not-found)))
    (if (is-eq tx-sender owner)
      (ok true)
      err-not-token-owner
    )
  )
)
