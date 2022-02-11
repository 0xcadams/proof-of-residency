import { store, Address, BigInt } from '@graphprotocol/graph-ts';
import {
  CommitmentCreated,
  CommitterAdded,
  CommitterRemoved,
  ProofOfResidency,
  TokenChallengeCompleted,
  TokenChallenged,
  Transfer
} from '../generated/ProofOfResidency/ProofOfResidency';
import {
  Commitment,
  Committer,
  Contribution,
  Requester,
  Token,
  TokenChallenge
} from '../generated/schema';

const ONE = BigInt.fromU32(1);
const ZERO = BigInt.zero();

// export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleCommitmentCreated(event: CommitmentCreated): void {
  let committer = Committer.load(event.params.committer.toHex());

  if (!committer) {
    committer = addCommitter(event.params.committer.toHex());
  }

  let requester = Requester.load(event.params.to.toHex());

  if (!requester) {
    requester = addRequester(event.params.to.toHex());
  }

  requester.numCommitments = requester.numCommitments.plus(BigInt.fromU64(1));

  let contribution = Contribution.load(event.transaction.hash.toHex());

  if (!contribution) {
    contribution = new Contribution(event.transaction.hash.toHex());
    contribution.value = event.transaction.value;
  }

  committer.numCommitments = committer.numCommitments.plus(BigInt.fromU64(1));

  let commitment = Commitment.load(event.params.commitment.toHex());

  if (!commitment) {
    commitment = new Commitment(event.params.commitment.toHex());
  }

  requester.save();
  committer.save();
  contribution.save();

  commitment.requester = requester.id;
  commitment.committer = committer.id;
  commitment.contribution = contribution.id;

  commitment.save();
}

export function handleCommitterAdded(event: CommitterAdded): void {
  let committer = Committer.load(event.params.committer.toHex());

  if (!committer) {
    committer = addCommitter(event.params.committer.toHex());
  }

  committer.save();
}

export function handleCommitterRemoved(event: CommitterRemoved): void {
  let committer = Committer.load(event.params.committer.toHex());

  if (!committer) {
    committer = addCommitter(event.params.committer.toHex());
  }

  committer.isActive = false;
  committer.removedAt = event.block.timestamp;

  committer.save();
}

// export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

// export function handlePaused(event: Paused): void {}

// export function handlePriceChanged(event: PriceChanged): void {}

export function handleTokenChallengeCompleted(event: TokenChallengeCompleted): void {
  let requester = Requester.load(event.params.owner.toHex());

  if (!requester) {
    requester = addRequester(event.params.owner.toHex());
  }

  requester.numTokenChallenges = requester.numTokenChallenges.minus(ONE);

  store.remove('TokenChallenge', event.params.tokenId.toHex());

  requester.save();
}

export function handleTokenChallenged(event: TokenChallenged): void {
  let requester = Requester.load(event.params.owner.toHex());

  if (!requester) {
    requester = addRequester(event.params.owner.toHex());
  }

  requester.numTokenChallenges = requester.numTokenChallenges.plus(ONE);

  let token = Token.load(event.params.tokenId.toHex());

  if (!token) {
    token = addToken(event.params.tokenId.toHex());
  }

  let tokenChallenge = TokenChallenge.load(event.params.tokenId.toHex());

  if (!tokenChallenge) {
    tokenChallenge = addTokenChallenge(event.params.tokenId.toHex());
    tokenChallenge.owner = requester.id;
    tokenChallenge.token = token.id;
  }

  requester.save();
  token.save();

  tokenChallenge.save();
}

export function handleTransfer(event: Transfer): void {
  // burned
  if (event.params.to.equals(Address.zero())) {
    let requester = Requester.load(event.params.from.toHex());

    if (!requester) {
      requester = addRequester(event.params.from.toHex());
    }

    requester.numTokens.minus(ONE);

    if (TokenChallenge.load(event.params.tokenId.toHex())) {
      store.remove('TokenChallenge', event.params.tokenId.toHex());
    }

    store.remove('Token', event.params.tokenId.toHex());

    requester.save();
  }
  // minted
  else if (event.params.from.equals(Address.zero())) {
    let requester = Requester.load(event.params.to.toHex());

    if (!requester) {
      requester = addRequester(event.params.to.toHex());
    }

    let token = Token.load(event.params.tokenId.toHex());

    let contract = ProofOfResidency.bind(event.address);

    if (!token) {
      token = addToken(event.params.tokenId.toHex());
      token.mintTime = event.block.timestamp;
      let metadataURI = contract.try_tokenURI(event.params.tokenId);
      if (!metadataURI.reverted) {
        token.tokenURI = normalize(metadataURI.value);
      } else {
        token.tokenURI = '';
      }
    }

    requester.numTokens.plus(ONE);
    requester.save();

    token.owner = requester.id;
    token.save();
  }
}

// export function handleUnpaused(event: Unpaused): void {}

function addCommitter(id: string): Committer {
  const committer = new Committer(id);
  committer.numCommitments = ZERO;
  committer.isActive = true;
  committer.removedAt = ZERO;

  return committer;
}

function addRequester(id: string): Requester {
  const requester = new Requester(id);
  requester.numCommitments = ZERO;
  requester.numTokens = ZERO;
  requester.numTokenChallenges = ZERO;

  return requester;
}

function addToken(id: string): Token {
  const token = new Token(id);

  return token;
}

function addTokenChallenge(id: string): TokenChallenge {
  const tokenChallenge = new TokenChallenge(id);

  return tokenChallenge;
}

// from https://github.com/wighawag/eip721-subgraph/blob/master/src/mapping.ts
function normalize(strValue: string): string {
  if (strValue.length === 1 && strValue.charCodeAt(0) === 0) {
    return '';
  }
  for (let i = 0; i < strValue.length; i++) {
    if (strValue.charCodeAt(i) === 0) {
      strValue = setCharAt(strValue, i, '\ufffd'); // graph-node db does not support string with '\u0000'
    }
  }
  return strValue;
}

// from https://github.com/wighawag/eip721-subgraph/blob/master/src/mapping.ts
function setCharAt(str: string, index: i32, char: string): string {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + char + str.substr(index + 1);
}