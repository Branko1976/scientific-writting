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

// Japanese versions of the same tasks. The sentence to rewrite in task 2 stays
// in English, because the course teaches English scientific writing.
export const WRITING_TASKS_JA = {
  1: {
    title: '一つの研究を4文で要約する',
    prompt:
      '知っている実際の研究(または簡単な架空の研究)を一つ選び、IMRAD の各セクションにつき1文、合計ちょうど4文で要約してください。各文は、そのセクションが答える問い、つまりなぜ行ったか、何をしたか、何が分かったか、何を意味するかに答えます。',
    placeholder: 'Introduction: ...\nMethods: ...\nResults: ...\nDiscussion: ...',
    selfCheck: [
      '各文は自分のセクションにとどまっていますか。結果の文に解釈が、方法の文に結果が入っていませんか。',
      'ラベルがなくても、読者は4文を区別できますか。',
    ],
  },
  2: {
    title: '詰め込みすぎの文をほどく',
    prompt:
      '次の文は内容を詰め込みすぎています。"A total of 60 participants were recruited for the study and blood samples were collected at three time points and the results were subsequently analyzed using a mixed-effects model, which is important to note given the repeated-measures design." これを、冗長な表現のない、明快な能動態の2〜3文に書き直してください。',
    placeholder: '書き直した文…',
    selfCheck: [
      '別々の主張をそれぞれの文に分けましたか。',
      'すべての動詞が実質的な役割を果たしていますか。「analyzed」で足りるところに「were subsequently analyzed」を使っていませんか。',
      '"it is important to note that" のような前置きを削りましたか。',
    ],
  },
  3: {
    title: '検証可能な目的と仮説を書く',
    prompt:
      '好きな主題について、検証可能な研究目的(1文)と正確な仮説(1文)を書いてください。対象集団と変数を明示し、仮説では予想される効果の方向も示します。',
    placeholder: 'Aim: ...\nHypothesis: ...',
    selfCheck: [
      '他の人があなたの目的だけを読んで研究を設計できますか。',
      '仮説は「関係がある」だけでなく、方向(高い・低い、多い・少ない)を示していますか。',
    ],
  },
  4: {
    title: '結果を報告し、限界を述べる',
    prompt:
      'ある架空の研究について、結果として適切な一文(数値を含み、解釈を含まない)を書き、続いて同じ研究の率直で具体的な限界を一文で書いてください。"some limitations exist" のような曖昧な表現は避けます。',
    placeholder: 'Result: ...\nLimitation: ...',
    selfCheck: [
      '結果の文は「suggests」や「shows that」といった解釈の語を避けていますか。',
      '限界の文は具体的な弱点を挙げ、それが結果にどう影響しうるかを述べていますか。',
    ],
  },
  5: {
    title: '書き出しの一文は段落を予告しているか',
    prompt:
      'この講義のため、あるいは別の機会に最近書いた文章から、ある段落の書き出しの一文を貼り付けてください。その文は、段落の残りの内容を予告していますか。していなければ、予告するように書き直してください。',
    placeholder: '元の書き出しの文: ...\n段落を予告しているか: ...\n書き直した文(必要な場合): ...',
    selfCheck: [
      '構成:各セクションは IMRAD の役割を正しい順序で果たしていますか。',
      '段落:この段落に明確なトピックセンテンスが一つありますか。',
      '文:能動的で、正確で、冗長でない文になっていますか。',
    ],
  },
};

export function writingTask(classId, lang) {
  return (lang === 'ja' ? WRITING_TASKS_JA[classId] : null) || WRITING_TASKS[classId];
}
