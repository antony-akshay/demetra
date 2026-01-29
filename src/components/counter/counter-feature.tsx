import { useWallet } from '@solana/wallet-adapter-react'
import { WalletButton } from '@/components/solana/solana-provider'
import { AppHero } from '@/components/app-hero'
import { CounterCreate, CounterList } from './counter-ui'

export default function CounterFeature() {
  const { publicKey } = useWallet()

  return publicKey ? (
    <div>
      <div className="flex justify-center">
        <img
          src="https://files.catbox.moe/6x2r14.png"
          width={100}
          height={15}
          alt="Demetra logo"
        />
      </div>
      <AppHero
        title="Demetra"
        subtitle={
          'Every vote recorded. Every voice respected.'
        }
      >
        {/* <p className="mb-6">
          <ExplorerLink path={`account/${programId}`} label={ellipsify(programId.toString())} />
        </p> */}
        <CounterCreate />
      </AppHero>
      <CounterList />
    </div>
  ) : (
    <div className="max-w-4xl mx-auto">
      <div className="hero py-64px">
        <div className="hero-content text-center">
          <WalletButton />
        </div>
      </div>
    </div>
  )
}
