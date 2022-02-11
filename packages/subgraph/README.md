# Proof of Residency Subgraph

The Proof of Residency subgraph (using The Graph) can be found on their [hosted service](https://thegraph.com/hosted-service/subgraph/proof-of-residency/proof-of-residency).

## Developing Locally

In order to run the graph node locally, you must first install Docker on your machine (this uses `docker-compose`). Then, to start The Graph local stack, run:

```bash
yarn start
# in a separate tab
yarn create:local # only need to run this once
yarn deploy:local
```
