export const WRITING_TASKS = {
  1: {
    title: 'Summarize a study in four sentences',
    prompt:
      "Pick a real study you know (or invent a simple one) and summarize it in exactly four sentences \u2014 one for each IMRAD section. Each sentence should answer that section's guiding question: why the study was done, what was done, what was found, and what it means.",
    placeholder:
      'Introduction: ...\nMethods: ...\nResults: ...\nDiscussion: ...',
    selfCheck: [
      "Does each sentence stay in its own section \u2014 no interpretation in the Results sentence, no findings in the Methods sentence?",
      'Could a reader tell the four sentences apart even without labels?',
    ],
  },
  2: {
    title: 'Untangle an overloaded sentence',
    prompt:
      'Here is an overloaded sentence: "A total of 60 participants were recruited for the study and blood samples were collected at three time points and the results were subsequently analyzed using a mixed-effects model, which is important to note given the repeated-measures design." Rewrite it as two or three clear, active-voice sentences with no redundant phrases.',
    placeholder: 'Your revised sentences...',
    selfCheck: [
      'Did you split the separate claims into their own sentences?',
      "Is every verb doing real work \u2014 no \u201cwere subsequently analyzed\u201d where \u201canalyzed\u201d would do?",
      'Did you cut throat-clearing phrases like "it is important to note that"?',
    ],
  },
  3: {
    title: 'Write a testable aim and hypothesis',
    prompt:
      'Write a testable research aim (one sentence) and a precise hypothesis (one sentence) for a topic of your choice. Name the population, the variables, and \u2014 for the hypothesis \u2014 the expected direction of the effect.',
    placeholder: 'Aim: ...\nHypothesis: ...',
    selfCheck: [
      'Could someone else design a study from your aim alone?',
      "Does your hypothesis name a direction (higher/lower, more/less), not just \u201ca relationship\u201d?",
    ],
  },
  4: {
    title: 'Report a result, then state a limitation',
    prompt:
      'Write one Results-appropriate sentence reporting a finding (numbers, no interpretation), then one honest, specific limitation statement for the same hypothetical study. Avoid vague phrases like "some limitations exist."',
    placeholder: 'Result: ...\nLimitation: ...',
    selfCheck: [
      "Does your Results sentence avoid interpretation words like \u201csuggests\u201d or \u201cshows that\u201d?",
      'Does your limitation name a specific weakness and its likely effect on the findings?',
    ],
  },
  5: {
    title: "Does your opening sentence predict the paragraph?",
    prompt:
      "Paste the opening sentence of something you've written recently (for this course or elsewhere). Then answer: does it predict what the rest of the paragraph says? If not, rewrite it so it does.",
    placeholder: 'Original opening sentence: ...\nDoes it predict the paragraph? ...\nRevised version (if needed): ...',
    selfCheck: [
      'Structure \u2014 does each section do its IMRAD job, in order?',
      'Paragraph \u2014 does this paragraph have one clear topic sentence?',
      'Sentence \u2014 is it active, precise, and non-redundant?',
    ],
  },
};
