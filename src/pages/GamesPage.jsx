import { OPS } from '../lib/fraction.js'
import { GAME_OPS } from '../lib/router.js'
import { MAX_QUESTIONS } from '../lib/questionGenerator.js'
import { useProgress } from '../context/ProgressContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import SectionFooter from '../components/SectionFooter.jsx'

export default function GamesPage() {
  const { getStatus, state } = useProgress()

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <PageHeader
        crumbs={[{ label: 'Home', href: '#/' }, { label: 'Practice Games' }]}
        title="Practice Games"
        subtitle="Pick a skill to practise. Each game has ten questions."
        complete={getStatus('games') === 'complete'}
      />

      <div className="mx-auto w-full max-w-7xl flex-1 px-4 sm:px-6">
        <div className="panel max-w-3xl p-5">
          <h2 className="text-xl font-semibold">How the games work</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>You start at level 1 of 5.</li>
            <li>Get one right and the next question is a little harder.</li>
            <li>Miss one and the next question is a little easier.</li>
            <li>Answer with the keyboard: type the top, Tab to the bottom, press Enter to check, and Enter again for the next question.</li>
          </ul>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAME_OPS.map((op) => {
            const best = state.bestScores[op]
            return (
              <li key={op} className="panel flex flex-col p-5">
                <p aria-hidden="true" className="font-serif text-4xl text-slice">{OPS[op].symbol}</p>
                <h2 className="mt-2 text-xl font-semibold">{OPS[op].name}</h2>
                <p className="mt-1 flex-1 text-muted">
                  {best === undefined ? 'Not played yet' : `Best score: ${best} out of ${MAX_QUESTIONS}`}
                </p>
                <a href={`#/games/${op}`} className="btn-primary mt-4">
                  Play {OPS[op].name.toLowerCase()}
                </a>
              </li>
            )
          })}
        </ul>
      </div>

      <SectionFooter sectionId="games" />
    </div>
  )
}
