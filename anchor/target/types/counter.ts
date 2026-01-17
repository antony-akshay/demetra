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
      "name": "chooseWinner",
      "discriminator": [
        121,
        30,
        2,
        9,
        160,
        253,
        121,
        192
      ],
      "accounts": [
        {
          "name": "signer",
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
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "winner",
          "type": "pubkey"
        }
      ]
    },
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
          "type": "i64"
        },
        {
          "name": "endTime",
          "type": "i64"
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
                "kind": "arg",
                "path": "name"
              },
              {
                "kind": "account",
                "path": "electionAccount"
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
          "name": "voteAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  111,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "electionAccount"
              },
              {
                "kind": "account",
                "path": "payer"
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
                "path": "candidate_account.name",
                "account": "candidateAccount"
              },
              {
                "kind": "account",
                "path": "electionAccount"
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
    },
    {
      "name": "voteAccount",
      "discriminator": [
        203,
        238,
        154,
        106,
        200,
        131,
        0,
        41
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
          },
          {
            "name": "electionAccount",
            "type": "pubkey"
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
            "type": "i64"
          },
          {
            "name": "endTime",
            "type": "i64"
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
    },
    {
      "name": "voteAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
