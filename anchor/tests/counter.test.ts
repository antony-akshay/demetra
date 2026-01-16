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
      .initializeElection('leader', new anchor.BN(0), new anchor.BN(0)) as any)
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


    await (program.methods.addCandidate('askhay') as any).
      accounts({
        electionAccount: electionAccountPda,
        candidateAccount: candidateAccountPda
      }).rpc();

    const candidate = await program.account.candidateAccount.fetch(candidateAccountPda);
    const electionacc2 = await program.account.electionAccount.fetch(electionAccountPda);
    console.log(candidate)
    console.log(electionacc2)
  })

  it("vote", async () => {

    const [candidateAccountPda, candidatebump] =
      PublicKey.findProgramAddressSync([
        electionAccountPda.toBuffer(),
        payer.publicKey.toBuffer(),
      ], program.programId);


    await (program.methods.vote() as any).accounts({
      electionAccount: electionAccountPda,
      candidateAccount: candidateAccountPda
    }).rpc()

    const candidate = await program.account.candidateAccount.fetch(candidateAccountPda)
    console.log(candidate)
  })

  it("choose winner", async () => {


    const [electionAccountPda, electionBump] =
      PublicKey.findProgramAddressSync(
        [
          Buffer.from(name, "utf8"),
          payer.publicKey.toBuffer(),
        ],
        program.programId
      );


    const a = await program.account.candidateAccount.all()
    console.log(electionAccountPda);
    console.log("candidate_accounts:", a)

    let candidate_of_this_election = a.filter((a1) =>
      a1.account.electionAccount.equals(electionAccountPda)
    )

    const winner = candidate_of_this_election.reduce((max, curr) =>
      curr.account.totalVotes > max.account.totalVotes ? curr : max
    );

    console.log("Winner:");
    console.log("PDA:", winner.publicKey.toBase58());
    console.log("Name:", winner.account.name);
    console.log("Votes:", winner.account.totalVotes);

    console.log("these are the candidates:", candidate_of_this_election)
  })
})
