import { Address, BigInt } from '@graphprotocol/graph-ts';
import { ProofOfResidency } from '../generated/ProofOfResidency/ProofOfResidency';

import {
  Commitment,
  Committer,
  Contribution,
  Protocol,
  Requester,
  Token,
  TokenChallenge
} from '../generated/schema';

const ZERO = BigInt.zero();

export function getOrAddProtocol(contractAddress: Address): Protocol {
  let protocol = Protocol.load('0');

  if (!protocol) {
    protocol = new Protocol('0');
    let contract = ProofOfResidency.bind(contractAddress);

    protocol.baseUri = contract.contractURI().replace('/contract', '');
    protocol.price = contract.reservePrice();
    protocol.paused = false;
  }

  return protocol;
}

export function getOrAddCommitment(id: string): Commitment {
  let commitment = Commitment.load(id);

  if (!commitment) {
    commitment = new Commitment(id);
    commitment.completed = false;
  }

  return commitment;
}

export function getOrAddContribution(id: string): Contribution {
  let contribution = Contribution.load(id);

  if (!contribution) {
    contribution = new Contribution(id);
  }

  return contribution;
}

export function getOrAddCommitter(id: string): Committer {
  let committer = Committer.load(id);

  if (!committer) {
    committer = new Committer(id);

    committer.isActive = true;
    committer.removedAt = ZERO;
  }

  return committer;
}

export function getOrAddRequester(id: string): Requester {
  let requester = Requester.load(id);

  if (!requester) {
    requester = new Requester(id);
  }

  return requester;
}

export function getOrAddToken(id: string): Token {
  let token = Token.load(id);

  if (!token) {
    token = new Token(id);
    token.country = BigInt.fromString(id).div(BigInt.fromString('1000000000000000'));
    token.number = BigInt.fromString(id).mod(token.country);
    token.burned = false;
  }

  return token;
}

export function getOrAddTokenChallenge(id: string): TokenChallenge {
  let tokenChallenge = TokenChallenge.load(id);

  if (!tokenChallenge) {
    tokenChallenge = new TokenChallenge(id);
    tokenChallenge.completed = false;
  }

  return tokenChallenge;
}

// from https://github.com/wighawag/eip721-subgraph/blob/master/src/mapping.ts
export function normalize(strValue: string): string {
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
