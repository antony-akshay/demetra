import { ExplorerLink } from '@/components/cluster/cluster-ui'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ellipsify } from '@/lib/utils'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useMemo } from 'react'
import { useCounterProgram, useCounterProgramAccount } from './counter-data-access'
import * as anchor from "@coral-xyz/anchor"
import { useWallet } from '@solana/wallet-adapter-react'


export function CounterCreate() {
  const { initializeElection } = useCounterProgram()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const startTimestamp = Math.floor(
      new Date(formData.get("start_time") as string).getTime() / 1000
    );
    const endTimestamp = Math.floor(
      new Date(formData.get("end_time") as string).getTime() / 1000
    );
    const startTime = new anchor.BN(startTimestamp);
    const endTime = new anchor.BN(endTimestamp);

    initializeElection.mutateAsync({ name, startTime, endTime })
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name='name' placeholder='name' className='w-full px-4 py-3 border-2 mb-5 bg-white rounded text-black focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow' />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="datetime-local"
            name="start_time"
            placeholder="start_time"
            className="w-full px-4 py-3 border-2 border-black text-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
          />
          <input
            type="datetime-local"
            name="end_time"
            placeholder="end_time"
            className="w-full px-4 py-3 border-2 border-black text-black rounded bg-white focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow"
          />
        </div>

        <Button type="submit" disabled={initializeElection.isPending}>
          Create {initializeElection.isPending && '...'}
        </Button>
      </form>
    </>
  )
}

export function CounterList() {
  const { accounts, getProgramAccount } = useCounterProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <CounterCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { accountQuery } = useCounterProgramAccount({
    account,
  })

  const publickey = useWallet();

  const { addCandidate, candidateAccounts, programId, voteCandidate, chooseWinner } = useCounterProgram();

  const a = candidateAccounts.data
  let candidates = a?.filter((a1) =>
    a1.account.electionAccount.equals(account))

  const handleChooseWinner = () => {
    console.log("clicked choose winner")
    if (!candidates) return;
    const winner = candidates?.reduce((max, curr) =>
      curr.account.totalVotes > max.account.totalVotes ? curr : max
    );

    console.log(winner)

    chooseWinner.mutateAsync({ winner: winner?.publicKey, electionAccount: account })
  }


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("clicked add candidate")
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    const [candidateAccount, candidatebump] =
      PublicKey.findProgramAddressSync([
        account.toBuffer(),
        publickey.publicKey!.toBuffer(),
      ], programId);

    addCandidate.mutateAsync({ name, candidateAccount, electionAccount: account })
  }

  return accountQuery.isLoading ? (
    <span className="loading loading-spinner loading-lg"></span>
  ) : (
    <Card>
      <CardHeader>
        <CardTitle>{accountQuery.data?.name}</CardTitle>
        <CardDescription>
          {/* Account: <ExplorerLink path={`account/${account}`} label={ellipsify(account.toString())} /> */}
          {accountQuery.data?.startTime.toString()}
          {"--" + accountQuery.data?.endTime.toString()}
        </CardDescription>
      </CardHeader>
      {(accountQuery.data?.owner.equals(publickey.publicKey!)) ?
        <form onSubmit={handleSubmit}>
          <div className='flex'>
            <input type="text" name='name' placeholder='name' className='w-150 ml-5 px-4 py-3 border-2 mb-5 bg-white rounded text-black focus:outline-none focus:shadow-[4px_4px_0_#000] transition-shadow' />
            <Button
              className='ml-5 h-13 mr-4'
              type='submit'
              variant="outline"
              disabled={addCandidate.isPending}
            >
              Add  Candidate
            </Button>
          </div>
        </form> : <></>}
      {/* <CardContent>
        <div className="flex gap-4">
          <Button
            variant="destructive"
            onClick={() => {
              if (!window.confirm('Are you sure you want to close this account?')) {
                return
              }
              // return closeMutation.mutateAsync()
            }}
          // disabled={closeMutation.isPending}
          >
            Close
          </Button>
        </div>
      </CardContent> */}
      <div>
        {!accountQuery.data?.winner ?
          <>
            <div className='ml-5 border p-2 rounded mr-5'>
              {candidates?.map((candidate) => (
                <div>
                  {candidate.publicKey.toString()}
                  <Button
                    className='ml-25'
                    variant="destructive"
                    onClick={() => {
                      voteCandidate.mutateAsync({ candidateAccount: candidate.publicKey, electionAccount: account })
                    }}
                  >
                    vote
                  </Button>
                  {/* <div>{candidate.account.totalVotes}</div> */}
                </div>

              ))}
            </div>
            <Button
              className='ml-25 bg-green-400'
              variant="secondary"
              onClick={handleChooseWinner}
            >
              Choose winner
            </Button>
          </> : <div className='ml-5 bg-green-400 w-120 rounded font-bold p-2'>{accountQuery.data?.winner.toString()}</div>}
      </div>
    </Card>
  )
}
