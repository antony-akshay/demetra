import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import { Counter } from '../target/types/counter'

describe('counter', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet
  const payer2 = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Counter as Program<Counter>

  const name = "leader";

  const [electionAccountPda, electionBump] =
    PublicKey.findProgramAddressSync(
      [
        Buffer.from(name, "utf8"),
        payer.publicKey.toBuffer(),
      ],
      program.programId
    );

  it('Initialize election account', async () => {

    console.log("this is the public key of the user:", payer.publicKey)
    await (program.methods
      .initializeElection('leader', 0, 0) as any)
      .accounts({
        electionAccount: electionAccountPda,
      })
      .rpc()

    const electionAcc = await program.account.electionAccount.fetch(electionAccountPda)

    expect(electionAcc.totalCandidates).toEqual(0)

    console.log("this is the election acc:", electionAcc)

    // await (program.methods.addCandidate('') as any).
    //   accounts({
    //     electionAccount: electionAccountPda,
    //     candidateAccount: candidateAccountPda
    //   }).rpc();

    // console.log(electionAcc)
    // const candidateAcc = await program.account.candidateAccount.fetch(candidateAccountPda)
    // console.log(candidateAcc)
  })


  it("initilaiseCandidate", async () => {

    const electionacc = await program.account.electionAccount.fetch(electionAccountPda);

    const [candidateAccountPda, candidatebump] =
      PublicKey.findProgramAddressSync([
        electionAccountPda.toBuffer(),
        payer.publicKey.toBuffer(),
      ], program.programId);

    const [candidate2AccountPda, candidate2bump] =
      PublicKey.findProgramAddressSync([
        electionAccountPda.toBuffer(),
        payer2.publicKey.toBuffer(),
      ], program.programId);


    await (program.methods.addCandidate('akshay') as any).
      accounts({
        electionAccount: electionAccountPda,
        candidateAccount: candidateAccountPda
      }).rpc();

    await (program.methods.addCandidate('antony') as any).
      accounts({
        electionAccount: electionAccountPda,
        candidateAccount: candidate2AccountPda
      }).rpc();

    const candidate = await program.account.candidateAccount.fetch(candidateAccountPda);
    const electionacc2 = await program.account.electionAccount.fetch(electionAccountPda);
    console.log(candidate)
    console.log(electionacc2)
  })
})
