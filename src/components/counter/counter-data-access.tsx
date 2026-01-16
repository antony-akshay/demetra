import { getCounterProgram, getCounterProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '@/components/cluster/cluster-data-access'
import { useAnchorProvider } from '@/components/solana/use-anchor-provider'
import { useTransactionToast } from '@/components/use-transaction-toast'
import { toast } from 'sonner'
import * as anchor from "@coral-xyz/anchor"


interface initializeElectionArgs {
  name: string,
  startTime: anchor.BN;
  endTime: anchor.BN;
}

interface addCandidateArgs {
  name: string,
  candidateAccount: PublicKey,
  electionAccount: PublicKey
}

interface VoteArgs{
  candidateAccount:PublicKey,
  electionAccount: PublicKey
}

export function useCounterProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCounterProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCounterProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['counter', 'all', { cluster }],
    queryFn: () => program.account.electionAccount.all(),
  })

  const candidateAccounts = useQuery({
    queryKey: ['candidate', 'all', { cluster }],
    queryFn: () => program.account.candidateAccount.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initializeElection = useMutation<string, Error, initializeElectionArgs>({
    mutationKey: ['create', 'election', { cluster }],
    mutationFn: ({ name, startTime, endTime }) =>
      program.methods.initializeElection(name, startTime, endTime).accounts({}).rpc(),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await accounts.refetch()
    },
    onError: () => {
      toast.error('Failed to initialize account')
    },
  })

  const addCandidate = useMutation<string, Error, addCandidateArgs>({
    mutationKey: ['add', 'candidate', { cluster }],
    mutationFn: ({ name, candidateAccount, electionAccount }) =>
      (program.methods.addCandidate(name) as any).accounts({
        candidateAccount: candidateAccount,
        electionAccount: electionAccount
      }).rpc(),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await accounts.refetch()
    },
    onError: () => {
      toast.error('Failed to initialize account')
    },
  })

  const voteCandidate = useMutation<string,Error,VoteArgs>({
    mutationKey:['vote','candidate',{cluster}],
    mutationFn:({candidateAccount,electionAccount})=>(
      (program.methods.vote() as any).accounts({
        candidateAccount: candidateAccount,
        electionAccount:electionAccount
      }).rpc()
    ),
    onSuccess: async (signature) => {
      transactionToast(signature)
      await candidateAccounts.refetch()
    },
    onError: () => {
      toast.error('Failed to vote')
    },
  })

  

  return {
    program,
    programId,
    accounts,
    candidateAccounts,
    getProgramAccount,
    initializeElection,
    addCandidate,
    voteCandidate
  }
}

export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCounterProgram()

  const accountQuery = useQuery({
    queryKey: ['counter', 'fetch', { cluster, account }],
    queryFn: () => program.account.electionAccount.fetch(account),
  })

  return {
    accountQuery,
  }
}
