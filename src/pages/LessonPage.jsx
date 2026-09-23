import { LESSONS } from '../data/lessons.js'
import { getSection } from '../data/sections.js'
import { useProgress } from '../context/ProgressContext.jsx'
import PageHeader from '../components/PageHeader.jsx'
import Tip from '../components/Tip.jsx'
import SectionFooter from '../components/SectionFooter.jsx'
import Playground from '../components/Playground.jsx'
import FractionExplorer from '../components/FractionExplorer.jsx'
import { ExampleCard, SimplifyExampleCard } from '../components/ExampleCard.jsx'

/**
 * Split layout: examples + playground on the left, explanation on the right.
 * From 768px up the page is locked to the viewport under the sticky nav, so the
 * page body never scrolls; each column scrolls on its own (overflow-y: auto).
 * On phones the columns stack and the page scrolls normally.
 */
export default function LessonPage({ lessonId }) {
  const lesson = LESSONS[lessonId]
  const section = getSection(lessonId)
  const { getStatus } = useProgress()
  const complete = getStatus(lessonId) === 'complete'

  return (
    <div className="lesson-viewport flex flex-col">
      <PageHeader
        crumbs={[{ label: 'Home', href: '#/' }, { label: section.title }]}
        title={section.title}
        subtitle={lesson.intro}
        complete={complete}
      />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pb-4 sm:px-6 md:min-h-0 md:flex-1 md:flex-row">
        {/* Explanation: right column on desktop */}
        <section
          aria-labelledby="explanation-heading"
          tabIndex={0}
          className="scroll-column panel p-5 sm:p-7 md:order-2"
        >
          <h2 id="explanation-heading" className="text-2xl font-semibold">Explanation</h2>
          {lesson.blocks.map((block) => (
            <div key={block.heading} className="mt-7">
              <h3 className="text-xl font-semibold">{block.heading}</h3>
              <div className="max-w-prose">
                {block.paragraphs.map((p) => (
                  <p key={p} className="mt-3">{p}</p>
                ))}
              </div>
              {block.tip && <Tip title={block.tip.title}>{block.tip.body}</Tip>}
            </div>
          ))}

          <div className="mt-8 rounded-xl border-l-4 border-slice bg-canvas p-4">
            <h3 className="text-lg font-semibold">Remember</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {lesson.remember.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Examples + playground: left column on desktop */}
        <section
          aria-labelledby="examples-heading"
          tabIndex={0}
          className="scroll-column space-y-4 md:order-1 md:pr-2"
        >
          <h2 id="examples-heading" className="pt-1 text-2xl font-semibold">Examples</h2>
          {lesson.op
            ? lesson.examples.map(([a, b], i) => <ExampleCard key={i} number={i + 1} op={lesson.op} a={a} b={b} />)
            : lesson.examples.map((f, i) => <SimplifyExampleCard key={i} number={i + 1} value={f} />)}
          {lesson.op ? <Playground op={lesson.op} /> : <FractionExplorer />}
        </section>
      </div>

      <SectionFooter sectionId={lessonId} sticky />
    </div>
  )
}
