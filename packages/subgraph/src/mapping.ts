import { Address } from '@graphprotocol/graph-ts';
import {
  CommitmentCreated,
  CommitterAdded,
  CommitterRemoved,
  Paused,
  PriceChanged,
  TokenChallengeCompleted,
  TokenChallenged,
  Transfer,
  Unpaused
} from '../generated/ProofOfResidency/ProofOfResidency';
import {
  getOrAddCommitment,
  getOrAddCommitter,
  getOrAddContribution,
  getOrAddProtocol,
  getOrAddRequester,
  getOrAddToken,
  getOrAddTokenChallenge
} from './util';

export function handleCommitmentCreated(event: CommitmentCreated): void {
  getOrAddProtocol(event.address);

  let committer = getOrAddCommitter(event.params.committer.toHex());
  let requester = getOrAddRequester(event.params.to.toHex());
  let contribution = getOrAddContribution(event.transaction.hash.toHex());
  const commitment = getOrAddCommitment(event.params.commitment.toHex());

  contribution.value = event.transaction.value;

  commitment.requester = requester.id;
  commitment.committer = committer.id;
  commitment.contribution = contribution.id;

  requester.save();
  committer.save();
  contribution.save();
  commitment.save();
}

export function handleCommitterAdded(event: CommitterAdded): void {
  let committer = getOrAddCommitter(event.params.committer.toHex());

  committer.save();
}

export function handleCommitterRemoved(event: CommitterRemoved): void {
  let committer = getOrAddCommitter(event.params.committer.toHex());

  committer.isActive = false;
  committer.removedAt = event.block.timestamp;

  committer.save();
}

export function handleTokenChallengeCompleted(event: TokenChallengeCompleted): void {
  let requester = getOrAddRequester(event.params.owner.toHex());
  let tokenChallenge = getOrAddTokenChallenge(event.params.tokenId.toString());

  tokenChallenge.completed = true;

  requester.save();
  tokenChallenge.save();
}

export function handleTokenChallenged(event: TokenChallenged): void {
  let requester = getOrAddRequester(event.params.owner.toHex());
  let token = getOrAddToken(event.params.tokenId.toString());
  let tokenChallenge = getOrAddTokenChallenge(event.params.tokenId.toString());

  tokenChallenge.owner = requester.id;
  tokenChallenge.token = token.id;

  requester.save();
  token.save();
  tokenChallenge.save();
}

export function handleTransfer(event: Transfer): void {
  // burned
  if (event.params.to.equals(Address.zero())) {
    const requester = getOrAddRequester(event.params.from.toHex());
    const token = getOrAddToken(event.params.tokenId.toString());

    token.burned = true;

    requester.save();
    token.save();
  }
  // minted
  else if (event.params.from.equals(Address.zero())) {
    const requester = getOrAddRequester(event.params.to.toHex());
    const token = getOrAddToken(event.params.tokenId.toString());

    token.mintTime = event.block.timestamp;
    token.owner = requester.id;

    token.save();
    requester.save();
  }
}

export function handlePaused(event: Paused): void {
  const protocol = getOrAddProtocol(event.address);

  protocol.paused = true;

  protocol.save();
}

export function handlePriceChanged(event: PriceChanged): void {
  const protocol = getOrAddProtocol(event.address);

  protocol.price = event.params.newPrice;

  protocol.save();
}

export function handleUnpaused(event: Unpaused): void {
  const protocol = getOrAddProtocol(event.address);

  protocol.paused = false;

  protocol.save();
}
