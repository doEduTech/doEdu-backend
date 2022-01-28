## Installation

```Create .env file in main directory and set PostgreSQL database connection variables like:
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432 or 5433 (most probably)
POSTGRES_USER=user_name
POSTGRES_PASSWORD=user_password
POSTGRES_DATABASE=database_name
JWT_SECRET=this_should_stay_secret
BLOCKCHAIN_CONFIG_PATH=~/.lisk/doedu-blockchain
DEDU_FAUCET_PASSPHRASE="romance runway there must accident feature use march remember drip divert hazard"
UPLOADED_FILES_DESTINATION=./uploaded-files

```

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

IPFS
Install: https://docs.ipfs.io/install/command-line/#official-distributions
Init: `ipfs init`
Run: `ipfs daemon`
