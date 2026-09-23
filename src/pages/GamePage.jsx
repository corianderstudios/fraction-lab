import { OPS } from '../lib/fraction.js'
import { useProgress } from '../context/ProgressContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Game from '../components/Game.jsx'

export default function GamePage({ op }) {
  const { setBestScore } = useProgress()
  const name = OPS[op].name

  return (
    <div className="pb-16">
      <PageHeader
        crumbs={[{ label: 'Home', href: '#/' }, { label: 'Practice Games', href: '#/games' }, { label: `${name} game` }]}
        title={`${name} fractions game`}
        subtitle="Ten questions. The difficulty follows you: right answers step up, misses step down."
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Game op={op} onFinish={(score) => setBestScore(op, score)} />
      </div>
    </div>
  )
}
