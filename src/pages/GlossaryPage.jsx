import { useId, useMemo, useState } from 'react'
import { useProgress } from '../context/ProgressContext.jsx'
import { getSection } from '../data/sections.js'
import PageHeader from '../components/PageHeader.jsx'
import SectionFooter from '../components/SectionFooter.jsx'
import { FractionDisplay } from '../components/FractionDisplay.jsx'

const F = (n, d = 1) => ({ n, d })

/** Terms grouped by topic, in the order a first-time learner meets them. */
export const GLOSSARY = [
  {
    topic: 'Parts of a fraction',
    terms: [
      {
        term: 'Fraction',
        definition: 'A number that describes part of a whole, written as one number over another.',
        example: '3/4 means 3 of 4 equal parts.',
        fraction: F(3, 4),
      },
      {
        term: 'Numerator',
        definition: 'The top number of a fraction. It counts how many parts you have.',
        example: 'In 3/4, the numerator is 3.',
      },
      {
        term: 'Denominator',
        definition: 'The bottom number of a fraction. It tells how many equal parts the whole is split into.',
        example: 'In 3/4, the denominator is 4.',
      },
      {
        term: 'Fraction bar',
        definition: 'The line between the numerator and denominator. It also means "divided by".',
        example: '3/4 is the same as 3 ÷ 4.',
      },
      {
        term: 'Whole',
        definition: 'One complete thing or group before it is split into parts.',
        example: 'A whole pizza cut into 8 slices is 8/8.',
        fraction: F(8, 8),
      },
      {
        term: 'Equal parts',
        definition: 'Pieces that are all exactly the same size. A fraction only works when the parts are equal.',
        example: 'A sandwich cut into two same-size halves shows 1/2.',
      },
    ],
  },
  {
    topic: 'Kinds of fractions',
    terms: [
      {
        term: 'Unit fraction',
        definition: 'A fraction with 1 as the numerator.',
        example: '1/2, 1/3 and 1/8 are unit fractions.',
        fraction: F(1, 3),
      },
      {
        term: 'Proper fraction',
        definition: 'A fraction whose numerator is smaller than its denominator, so it is less than one whole.',
        example: '2/5 is a proper fraction.',
        fraction: F(2, 5),
      },
      {
        term: 'Improper fraction',
        definition: 'A fraction whose numerator is equal to or bigger than its denominator, so it is one whole or more.',
        example: '7/4 is an improper fraction.',
        fraction: F(7, 4),
      },
      {
        term: 'Mixed number',
        definition: 'A whole number and a proper fraction written together.',
        example: '1 3/4 is the mixed number for 7/4.',
      },
      {
        term: 'Whole number',
        definition: 'A counting number with no fraction part, such as 0, 1, 2 or 3. Any whole number can be written over 1.',
        example: '5 is the same as 5/1.',
        fraction: F(5, 1),
      },
      {
        term: 'Like fractions',
        definition: 'Fractions that have the same denominator.',
        example: '2/7 and 5/7 are like fractions.',
      },
      {
        term: 'Unlike fractions',
        definition: 'Fractions that have different denominators.',
        example: '1/3 and 1/4 are unlike fractions.',
      },
    ],
  },
  {
    topic: 'Changing a fraction',
    terms: [
      {
        term: 'Equivalent fractions',
        definition: 'Different fractions that name the same amount.',
        example: '1/2, 2/4 and 4/8 are equivalent.',
        fraction: F(2, 4),
      },
      {
        term: 'Simplify',
        definition: 'To rewrite a fraction with smaller numbers by dividing the top and bottom by the same number.',
        example: '6/8 simplifies to 3/4 by dividing both by 2.',
      },
      {
        term: 'Simplest form',
        definition: 'A fraction whose numerator and denominator share no factor except 1. Also called lowest terms.',
        example: '3/4 is in simplest form. 6/8 is not.',
        fraction: F(3, 4),
      },
      {
        term: 'Reciprocal',
        definition: 'A fraction flipped upside down. A number times its reciprocal always equals 1.',
        example: 'The reciprocal of 4/5 is 5/4.',
        fraction: F(5, 4),
      },
    ],
  },
  {
    topic: 'Factors and multiples',
    terms: [
      {
        term: 'Factor',
        definition: 'A whole number that divides into another number with nothing left over.',
        example: 'The factors of 12 are 1, 2, 3, 4, 6 and 12.',
      },
      {
        term: 'Common factor',
        definition: 'A factor that two or more numbers share.',
        example: '2 is a common factor of 6 and 8.',
      },
      {
        term: 'Greatest common factor (GCF)',
        definition: 'The largest factor two numbers share. Dividing by it simplifies a fraction in one step.',
        example: 'The GCF of 10 and 15 is 5, so 10/15 = 2/3.',
      },
      {
        term: 'Multiple',
        definition: 'The result of multiplying a number by 1, 2, 3 and so on.',
        example: 'Multiples of 4 are 4, 8, 12, 16…',
      },
      {
        term: 'Least common multiple (LCM)',
        definition: 'The smallest number that is a multiple of two numbers.',
        example: 'The LCM of 4 and 6 is 12.',
      },
      {
        term: 'Common denominator',
        definition: 'A denominator that two fractions share, or that both can be rewritten to have.',
        example: '1/3 and 1/4 can both be written in twelfths.',
      },
      {
        term: 'Least common denominator (LCD)',
        definition: 'The smallest common denominator. It is the LCM of the denominators.',
        example: 'The LCD of 1/3 and 1/4 is 12: 4/12 and 3/12.',
      },
    ],
  },
  {
    topic: 'Operation words',
    terms: [
      {
        term: 'Sum',
        definition: 'The answer to an addition problem.',
        example: 'The sum of 1/5 and 2/5 is 3/5.',
      },
      {
        term: 'Difference',
        definition: 'The answer to a subtraction problem.',
        example: 'The difference of 5/7 and 2/7 is 3/7.',
      },
      {
        term: 'Product',
        definition: 'The answer to a multiplication problem.',
        example: 'The product of 2/3 and 4/5 is 8/15.',
      },
      {
        term: 'Quotient',
        definition: 'The answer to a division problem.',
        example: 'The quotient of 1/2 ÷ 1/4 is 2.',
      },
      {
        term: 'Cross-cancelling',
        definition:
          'When multiplying, dividing a numerator and the other fraction’s denominator by a shared factor before you multiply, to keep numbers small.',
        example: 'In 3/4 × 2/9, divide 3 and 9 by 3, and 2 and 4 by 2, to get 1/2 × 1/3.',
      },
      {
        term: 'Keep, Change, Flip',
        definition: 'A memory rule for dividing fractions: keep the first fraction, change ÷ to ×, flip the second fraction.',
        example: '2/3 ÷ 4/5 becomes 2/3 × 5/4.',
      },
      {
        term: 'Bar model',
        definition: 'A drawing of a bar split into equal parts, with some parts shaded to show a fraction.',
        example: 'A bar in 4 parts with 3 shaded shows 3/4.',
      },
    ],
  },
]

const TOTAL_TERMS = GLOSSARY.reduce((sum, group) => sum + group.terms.length, 0)

/**
 * The search box is the only typed input on this page. Allow letters, spaces,
 * hyphens and brackets only, capped at 40 characters. Everything else is dropped.
 */
export function sanitizeSearch(raw) {
  const text = typeof raw === 'string' ? raw : ''
  return text
    .normalize('NFKC')
    .replace(/[^\p{L}\s\-()]/gu, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 40)
}

const slug = (text) => text.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '')

export default function GlossaryPage() {
  const [query, setQuery] = useState('')
  const { getStatus } = useProgress()
  const searchId = useId()
  const hintId = useId()

  // Only show progress controls once "glossary" is registered in data/sections.js.
  const registered = Boolean(getSection('glossary'))

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return GLOSSARY
    return GLOSSARY.map((group) => ({
      ...group,
      terms: group.terms.filter(
        (t) => t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q),
      ),
    })).filter((group) => group.terms.length > 0)
  }, [query])

  const shown = groups.reduce((sum, group) => sum + group.terms.length, 0)

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <PageHeader
        crumbs={[{ label: 'Home', href: '#/' }, { label: 'Glossary' }]}
        title="Glossary"
        subtitle="Words you'll see in the lessons, explained in plain language with a quick example."
        complete={registered && getStatus('glossary') === 'complete'}
      />

      <div className="mx-auto w-full max-w-3xl flex-1 px-4 pb-10 sm:px-6">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="panel p-4">
          <label htmlFor={searchId} className="block font-bold">
            Find a term
          </label>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(sanitizeSearch(e.target.value))}
            maxLength={40}
            autoComplete="off"
            spellCheck={false}
            aria-describedby={hintId}
            className="mt-2 w-full rounded-lg border-2 border-line bg-canvas px-3 py-2 text-ink focus:border-accent focus:outline-none"
          />
          <p id={hintId} role="status" className="mt-2 text-sm text-muted">
            {shown === TOTAL_TERMS ? `${TOTAL_TERMS} terms` : `Showing ${shown} of ${TOTAL_TERMS} terms`}
          </p>
        </form>

        {shown === 0 && (
          <div className="mt-6 panel p-5">
            <p className="font-bold">No terms match “{query}”.</p>
            <p className="mt-1 text-muted">Try a shorter word, or clear the search to see every term.</p>
            <button type="button" className="btn-secondary mt-3" onClick={() => setQuery('')}>
              Clear search
            </button>
          </div>
        )}

        {groups.map((group) => {
          const headingId = `glossary-${slug(group.topic)}`
          return (
            <section key={group.topic} aria-labelledby={headingId} className="mt-8">
              <h2 id={headingId} className="text-2xl font-semibold">
                {group.topic}
              </h2>
              <dl className="mt-3 divide-y divide-line rounded-2xl border border-line bg-surface">
                {group.terms.map((t) => (
                  <div key={t.term} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 p-4 sm:p-5">
                    <dt className="col-start-1 font-serif text-lg font-semibold">{t.term}</dt>
                    <dd className="col-start-1 mt-1">{t.definition}</dd>
                    <dd className="col-start-1 mt-1 text-muted">
                      <span className="font-bold text-ink">Example: </span>
                      {t.example}
                    </dd>
                    {t.fraction && (
                      <dd
                        aria-hidden="true"
                        className="col-start-2 row-span-3 row-start-1 flex h-16 w-16 items-center justify-center self-center rounded-xl bg-progress/40 text-ink"
                      >
                        <FractionDisplay value={t.fraction} />
                      </dd>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          )
        })}
      </div>

      {registered && <SectionFooter sectionId="glossary" />}
    </div>
  )
}
