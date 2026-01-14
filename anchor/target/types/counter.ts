/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/counter.json`.
 */
export type Counter = {
  "address": "4yGygWL87SGoAREFyAXSetn6LnZnU9nk1gbcJncFfduZ",
  "metadata": {
    "name": "counter",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "initializeElection",
      "discriminator": [
        122,
        239,
        72,
        185,
        101,
        137,
        103,
        222
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "electionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "name"
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        },
        {
          "name": "startTime",
          "type": "u8"
        },
        {
          "name": "endTime",
          "type": "u8"
        }
      ]
    },
    {
      "name": "addCandidate",
      "discriminator": [
        86,
        167,
        52,
        100,
        179,
        155,
        32,
        151
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "electionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "name"
              },
              {
                "kind": "account",
                "path": "election_account.owner",
                "account": "electionAccount"
              }
            ]
          }
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "electionAccount"
              },
              {
                "kind": "account",
                "path": "election_account.total_candidates",
                "account": "electionAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "vote",
      "discriminator": [
        227,
        110,
        155,
        23,
        136,
        126,
        172,
        25
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "electionAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "election_account.name",
                "account": "electionAccount"
              },
              {
                "kind": "account",
                "path": "election_account.owner",
                "account": "electionAccount"
              }
            ]
          }
        },
        {
          "name": "candidateAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "electionAccount"
              },
              {
                "kind": "account",
                "path": "election_account.total_candidates",
                "account": "electionAccount"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "candidateAccount",
      "discriminator": [
        69,
        203,
        73,
        43,
        203,
        170,
        96,
        121
      ]
    },
    {
      "name": "electionAccount",
      "discriminator": [
        111,
        137,
        198,
        158,
        227,
        5,
        86,
        255
      ]
    }
  ],
  "types": [
    {
      "name": "candidateAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "totalVotes",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "electionAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "totalCandidates",
            "type": "u8"
          },
          {
            "name": "startTime",
            "type": "u8"
          },
          {
            "name": "endTime",
            "type": "u8"
          },
          {
            "name": "winner",
            "type": {
              "option": "pubkey"
            }
          },
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "owner",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
