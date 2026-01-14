import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Counter } from '../target/types/counter'

describe('counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Counter as Program<Counter>

  it('Initialize election account', async () => {

    const [electionAccountPda, electionBump] =
      PublicKey.findProgramAddressSync(
        [
          Buffer.from("leader"),                 // name.as_bytes()
          payer.publicKey.toBuffer(),         // payer.key().as_ref()
        ],
        program.programId
      );

    console.log("this is the public key of the user:", payer.publicKey)
    await (program.methods
      .initializeElection('leader', 0, 0) as any)
      .accounts({
        electionAccount: electionAccountPda,
      })
      .rpc()

    const electionacc = await program.account.electionAccount.fetch(electionAccountPda);

    const [candidateAccountPda, candidatebump] =
      PublicKey.findProgramAddressSync([
        electionAccountPda.toBuffer(),
        Buffer.from([electionacc.totalCandidates])
      ], program.programId);

    const electionAcc = await program.account.electionAccount.fetch(electionAccountPda)

    expect(electionAcc.totalCandidates).toEqual(0)

    console.log(electionAcc)

    await (program.methods.addCandidate('') as any).
      accounts({
        electionAccount: electionAccountPda,
        candidateAccount: candidateAccountPda
      }).rpc();

    console.log(electionAcc)
    const candidateAcc = await program.account.candidateAccount.fetch(candidateAccountPda)
    console.log(candidateAcc)
  })
})
