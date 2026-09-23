// Lesson content. Each block has a heading, paragraphs, and an optional memory tip
// (shown in a clickable tooltip). Examples are worked out automatically from the math library.

const F = (n, d = 1) => ({ n, d })

export const LESSONS = {
  basics: {
    id: 'basics',
    op: null,
    intro: 'A fraction is a way to talk about part of something. Start here before you do math with them.',
    blocks: [
      {
        heading: 'What a fraction means',
        paragraphs: [
          'A fraction has two numbers. The bottom number, the denominator, says how many equal pieces the whole is cut into. The top number, the numerator, says how many of those pieces you have.',
          'In 3/4 of a pizza, the pizza was cut into 4 equal slices and you have 3 of them.',
          'The pieces must be equal. Half of a sandwich only counts as 1/2 if both halves are the same size.',
        ],
        tip: {
          title: 'Denominator = Down',
          body: 'Both words start with D: the Denominator lives Down below. The Numerator is the Number of pieces you have.',
        },
      },
      {
        heading: 'Equivalent fractions',
        paragraphs: [
          'Different fractions can name the same amount. 1/2, 2/4 and 4/8 all fill exactly half of a bar.',
          'To make an equivalent fraction, multiply (or divide) the top and bottom by the same number. 1/2 × 3/3 = 3/6. You are cutting each piece into 3 smaller ones, so you have 3 times as many pieces, each 3 times smaller.',
        ],
        tip: {
          title: 'Fair is fair',
          body: 'Whatever you do to the top, do to the bottom. Multiplying both by the same number is really multiplying by 1, so the amount never changes.',
        },
      },
      {
        heading: 'Simplest form',
        paragraphs: [
          'A fraction is in simplest form when the top and bottom share no factor other than 1.',
          'To simplify, find the greatest common factor (the biggest number that divides both), then divide the top and bottom by it. For 6/8 that number is 2, so 6/8 = 3/4.',
          'You can also simplify in small steps: keep dividing by 2, 3 or 5 until nothing else divides evenly.',
        ],
        tip: {
          title: 'Even-even means halve it',
          body: 'If the top and bottom are both even, you can always divide both by 2. Repeat until one of them is odd, then try 3.',
        },
      },
      {
        heading: 'Improper fractions and mixed numbers',
        paragraphs: [
          'When the top is bigger than the bottom, like 7/4, the fraction is more than one whole. This is called an improper fraction.',
          'You can write it as a mixed number: 7 ÷ 4 = 1 remainder 3, so 7/4 = 1 3/4.',
        ],
        tip: {
          title: 'Divide, then leftovers',
          body: 'Divide the top by the bottom. The answer is the whole number, and the remainder sits on top of the same denominator.',
        },
      },
    ],
    remember: [
      'Denominator: how many equal pieces in one whole.',
      'Numerator: how many pieces you have.',
      'Multiply or divide top and bottom by the same number to get an equivalent fraction.',
      'Simplify by dividing by the greatest common factor.',
    ],
    examples: [F(6, 8), F(4, 12), F(10, 15), F(9, 4)],
  },

  add: {
    id: 'add',
    op: 'add',
    intro: 'Adding fractions means combining pieces. The trick is making sure the pieces are the same size first.',
    blocks: [
      {
        heading: 'When the denominators match',
        paragraphs: [
          'If both fractions have the same denominator, the pieces are already the same size. Add the numerators and keep the denominator.',
          '1/5 + 2/5: one fifth plus two fifths is three fifths, so the answer is 3/5.',
        ],
        tip: {
          title: 'Same bottom, add the tops',
          body: 'The denominator names the size of the pieces. Adding more pieces does not change their size, so the bottom stays the same.',
        },
      },
      {
        heading: 'Never add the denominators',
        paragraphs: [
          'It is tempting to write 1/2 + 1/2 = 2/4, but 2/4 is only one half. Two halves make one whole, so the answer is 2/2 = 1.',
          'Only the numerators get added. The denominator describes the pieces, it is not something you count.',
        ],
      },
      {
        heading: 'When the denominators are different',
        paragraphs: [
          'You cannot add thirds and quarters directly, just like you cannot add 3 apples and 2 oranges into 5 of one thing. First, rewrite both fractions so they use the same denominator.',
          'The easiest common denominator is the least common multiple of the two denominators, called the least common denominator (LCD). For 1/3 + 1/4 the LCD is 12.',
          'Rewrite each fraction: 1/3 = 4/12 and 1/4 = 3/12. Now add the tops: 4/12 + 3/12 = 7/12.',
        ],
        tip: {
          title: 'The butterfly method',
          body: 'For a/b + c/d: multiply diagonally up the wings (a × d and c × b) and add them for the new top. Multiply the bodies (b × d) for the new bottom. Then simplify. 1/3 + 1/4 = (4 + 3)/12 = 7/12.',
        },
      },
      {
        heading: 'Finish by simplifying',
        paragraphs: [
          'Always check whether your answer can be simplified. 1/6 + 1/3 = 1/6 + 2/6 = 3/6, which simplifies to 1/2.',
          'If the answer is bigger than 1, you can also write it as a mixed number: 5/6 + 3/4 = 19/12 = 1 7/12.',
        ],
      },
    ],
    remember: [
      'Make the denominators match first.',
      'Add the numerators only.',
      'Keep the common denominator.',
      'Simplify the answer.',
    ],
    examples: [
      [F(1, 5), F(2, 5)],
      [F(1, 3), F(1, 4)],
      [F(1, 6), F(1, 3)],
      [F(5, 6), F(3, 4)],
    ],
  },

  subtract: {
    id: 'subtract',
    op: 'subtract',
    intro: 'Subtracting fractions works just like adding: get matching denominators, then work with the tops.',
    blocks: [
      {
        heading: 'When the denominators match',
        paragraphs: [
          'Subtract the numerators and keep the denominator. 5/7 − 2/7 = 3/7.',
          'Picture a bar cut into 7 pieces with 5 shaded. Take 2 shaded pieces away and 3 are left.',
        ],
        tip: {
          title: 'Same bottom, subtract the tops',
          body: 'Exactly like adding: the denominator is the piece size and stays put. Only the count on top changes.',
        },
      },
      {
        heading: 'When the denominators are different',
        paragraphs: [
          'Find the least common denominator, rewrite both fractions, then subtract the numerators.',
          '3/4 − 1/3: the LCD is 12, so 3/4 = 9/12 and 1/3 = 4/12. Then 9/12 − 4/12 = 5/12.',
          'Order matters in subtraction. Keep the fractions in the order they were written.',
        ],
        tip: {
          title: 'The butterfly works here too',
          body: 'For a/b − c/d, the new top is (a × d) − (c × b) and the new bottom is b × d. Always take the left wing minus the right wing.',
        },
      },
      {
        heading: 'Check your answer',
        paragraphs: [
          'Subtraction and addition undo each other. If 3/4 − 1/3 = 5/12, then 5/12 + 1/3 should give back 3/4. It does: 5/12 + 4/12 = 9/12 = 3/4.',
        ],
        tip: {
          title: 'Add it back',
          body: 'Your answer plus the number you took away should equal the number you started with. If it does not, look for a slip in the common denominator.',
        },
      },
      {
        heading: 'Simplify at the end',
        paragraphs: ['7/8 − 5/12 = 21/24 − 10/24 = 11/24, which is already in simplest form. 5/6 − 1/3 = 5/6 − 2/6 = 3/6 = 1/2.'],
      },
    ],
    remember: [
      'Make the denominators match first.',
      'Subtract the numerators in the order written.',
      'Keep the common denominator.',
      'Check by adding back, then simplify.',
    ],
    examples: [
      [F(5, 7), F(2, 7)],
      [F(3, 4), F(1, 3)],
      [F(5, 6), F(1, 3)],
      [F(7, 8), F(5, 12)],
    ],
  },

  multiply: {
    id: 'multiply',
    op: 'multiply',
    intro: 'Multiplying is the friendliest fraction operation. You do not need a common denominator at all.',
    blocks: [
      {
        heading: 'Straight across',
        paragraphs: [
          'Multiply the numerators to get the new numerator. Multiply the denominators to get the new denominator.',
          '2/3 × 4/5 = (2 × 4)/(3 × 5) = 8/15.',
        ],
        tip: {
          title: 'Top times top, bottom times bottom',
          body: 'No common denominators needed. Multiplication goes straight across, like reading a line of text.',
        },
      },
      {
        heading: '"Of" means multiply',
        paragraphs: [
          'Half of three quarters is 1/2 × 3/4 = 3/8. Picture a bar with 3/4 shaded, then take half of the shaded part.',
          'When you multiply two fractions that are both less than 1, the answer is smaller than either one. Taking part of a part leaves you with less.',
        ],
      },
      {
        heading: 'Whole numbers',
        paragraphs: [
          'Write the whole number as a fraction over 1, then multiply straight across. 3 × 2/9 = 3/1 × 2/9 = 6/9 = 2/3.',
        ],
        tip: {
          title: 'Every whole number hides a 1',
          body: '5 is the same as 5/1. Writing it that way turns a confusing problem into an ordinary fraction problem.',
        },
      },
      {
        heading: 'Simplify before you multiply',
        paragraphs: [
          'If a numerator and the denominator of the other fraction share a factor, you can divide both by it first. This is called cross-cancelling and keeps the numbers small.',
          '3/4 × 2/9: 3 and 9 share a 3, and 2 and 4 share a 2. That leaves 1/2 × 1/3 = 1/6.',
        ],
        tip: {
          title: 'Cross-cancel on the diagonal',
          body: 'Look along the diagonals (top-left with bottom-right, bottom-left with top-right). If both numbers share a factor, divide them both by it before multiplying.',
        },
      },
    ],
    remember: [
      'Multiply the numerators.',
      'Multiply the denominators.',
      'Whole numbers become fractions over 1.',
      'Cross-cancel first or simplify at the end.',
    ],
    examples: [
      [F(2, 3), F(4, 5)],
      [F(1, 2), F(3, 4)],
      [F(3), F(2, 9)],
      [F(3, 4), F(2, 9)],
    ],
  },

  divide: {
    id: 'divide',
    op: 'divide',
    intro: 'Dividing asks "how many of these fit into that?" A three-step rule turns it into multiplication.',
    blocks: [
      {
        heading: 'What dividing means',
        paragraphs: [
          '1/2 ÷ 1/4 asks how many quarters fit into a half. Two quarters make a half, so the answer is 2.',
          'That is why dividing by a fraction smaller than 1 gives a bigger answer: small pieces fit in many times.',
        ],
        tip: {
          title: 'Small divisor, big answer',
          body: 'Dividing by a number less than 1 makes the result larger. Dividing by 1/2 is the same as doubling.',
        },
      },
      {
        heading: 'Keep, Change, Flip',
        paragraphs: [
          'Keep the first fraction as it is. Change the ÷ sign into ×. Flip the second fraction upside down. Then multiply as usual.',
          '2/3 ÷ 4/5 becomes 2/3 × 5/4 = 10/12 = 5/6.',
        ],
        tip: {
          title: 'Keep, Change, Flip',
          body: 'Say it out loud: Keep the first, Change the sign, Flip the second. Only the second fraction gets flipped, never the first.',
        },
      },
      {
        heading: 'The flipped fraction is the reciprocal',
        paragraphs: [
          'Flipping a fraction gives its reciprocal: 4/5 becomes 5/4. A fraction times its reciprocal always equals 1.',
          'Dividing by a number and multiplying by its reciprocal always give the same answer, which is why the rule works.',
        ],
      },
      {
        heading: 'Whole numbers and zero',
        paragraphs: [
          'Turn whole numbers into fractions over 1 first. 3/4 ÷ 2 = 3/4 ÷ 2/1 = 3/4 × 1/2 = 3/8.',
          'You can never divide by zero, so the second fraction cannot have 0 on top.',
        ],
        tip: {
          title: 'Zero can’t flip',
          body: 'Flipping 0/5 would put 0 on the bottom, and a denominator of 0 has no meaning. That is the reason you cannot divide by zero.',
        },
      },
    ],
    remember: [
      'Keep the first fraction.',
      'Change ÷ to ×.',
      'Flip the second fraction.',
      'Multiply, then simplify.',
    ],
    examples: [
      [F(1, 2), F(1, 4)],
      [F(2, 3), F(4, 5)],
      [F(3, 4), F(2)],
      [F(5, 6), F(5, 12)],
    ],
  },
}
