// Interface strings for the student-facing site (English and Japanese).
// The tutor pages are always English and do not use this file.
// Slide content itself stays in English, matching the lecture deck.

export const LANGS = ['en', 'ja'];

export const STRINGS = {
  en: {
    'header.tagline': 'Principles & Practice · Honours Program',
    'header.logout': 'Log out',
    'header.login': 'Log in',
    'lang.switchTo': '日本語',
    'lang.switchLabel': 'Switch to Japanese',

    'home.kicker': 'Honours Student Program · Nagoya University',
    'home.title1': 'Scientific Writing:',
    'home.title2': 'Principles and Practice',
    'home.intro':
      'Five classes, sixty minutes each — from why scientific writing has its own rules to responding to peer review. Work through each class at your own pace, then check your understanding with the quick checks your instructor built into the material.',
    'home.notStarted': 'You haven’t started a class yet.',
    'home.someDone': '{n} of 5 classes reviewed.',
    'home.allDone': 'All five classes reviewed — nicely done.',
    'home.loginPrompt':
      'Log in to save your progress across devices and use the writing tasks and discussion.',
    'home.slides': '{n} slides',
    'home.quizBest': 'Quiz best {s}/{t}',
    'home.instructor': 'Instructor dashboard',
    'tb.kicker': 'Free companion textbook',
    'tb.title': 'Scientific Writing: Principles and Practice',
    'tb.desc':
      'The full course as an ebook — five chapters with examples, exercises and checklists. Free to download from ASIME.',
    'tb.cta': 'Get the free textbook →',
    'cta.review': 'Review',
    'cta.continue': 'Continue',
    'cta.start': 'Start class',
    'nav.writing': 'Writing task',
    'nav.discussion': 'Discussion',
    'nav.quiz': 'Quiz',

    'common.noClass': 'That class doesn’t exist.',
    'common.backCourse': 'Back to course',
    'common.backSlides': '← Back to slides',
    'common.classN': 'Class {n}',

    'login.kicker': 'Honours Student Program',
    'login.signIn': 'Sign in',
    'login.choosePin': 'Choose a PIN',
    'login.enterPin': 'Enter your PIN',
    'login.nameHelp': 'Use the name you want your instructor to see on the class roster.',
    'login.firstTime': 'First time for "{name}" — pick a 4-digit PIN so it’s yours next time.',
    'login.welcomeBack': 'Welcome back, {name}.',
    'login.namePlaceholder': 'Your name',
    'login.continue': 'Continue',
    'login.pinPlaceholder': '4-digit PIN',
    'login.confirmPlaceholder': 'Confirm PIN',
    'login.create': 'Create account',
    'login.login': 'Log in',
    'login.notYou': 'Not you? Use a different name',
    'login.pinNote':
      'This PIN just keeps your own progress separate from your classmates’ — it isn’t a security password, so don’t reuse one you care about.',
    'login.back': '← Back without signing in',
    'login.errName': 'Enter your name.',
    'login.errPin': 'PIN must be 4 digits.',
    'login.errMismatch': 'PINs don’t match.',
    'login.errGeneric': 'Something went wrong. Try again.',
    'login.errWrongPin': 'That PIN doesn’t match this name.',
    'login.errFailed': 'Could not log in.',

    'viewer.all': '← All classes',
    'viewer.slideOf': 'Slide {a} of {b}',
    'viewer.back': 'Back',
    'viewer.next': 'Next',
    'viewer.takeQuiz': 'Take the quiz →',
    'viewer.enNote': '',

    'quiz.header': 'Class {n} Quiz',
    'quiz.sub': '{n} quick checks drawn straight from this class’s slides.',
    'quiz.none': 'No quiz questions yet for this class.',
    'quiz.complete': 'Quiz complete',
    'quiz.perfect': 'Perfect score.',
    'quiz.solid': 'Solid grasp of this class — worth a quick review of the ones you missed.',
    'quiz.again': 'Worth another pass through the class slides before moving on.',
    'quiz.retake': 'Retake quiz',
    'quiz.questionOf': 'Question {a} of {b}',
    'quiz.scoreSoFar': 'Score so far: {n}',
    'quiz.correct': 'Correct. ',
    'quiz.notQuite': 'Not quite. ',
    'quiz.nextQ': 'Next question',
    'quiz.results': 'See results',

    'chat.header': 'Class {n} Discussion',
    'chat.sub': 'Questions here are visible to your classmates and your instructor.',
    'chat.login': 'Log in to join the discussion.',
    'chat.empty': 'No messages yet — ask the first question about this class.',
    'chat.placeholder': 'Ask a question about this class...',
    'chat.send': 'Send',
    'chat.instructor': 'Instructor',

    'write.header': 'Class {n} Writing Task',
    'write.login': 'Log in to write and save your response.',
    'write.words': '{n} words',
    'write.saving': 'Saving…',
    'write.saved': 'Saved',
    'write.error': 'Couldn’t save — try again',
    'write.save': 'Save response',
    'write.checkHeading': 'Before you move on, check',

    'act.label': 'Your answer',
    'act.saving': 'Saving…',
    'act.saved': 'Saved ✓',
    'act.error': 'Couldn’t save — keep typing to retry',
    'act.placeholder': 'Type a short answer — a sentence or two is enough. Your tutor can see it.',
    'act.note': 'Saves automatically. Only you and your tutor see this.',
    'act.loginLink': 'Log in',
    'act.loginRest': ' to type your answer here.',
  },

  ja: {
    'header.tagline': '原則と実践 · Honours Program',
    'header.logout': 'ログアウト',
    'header.login': 'ログイン',
    'lang.switchTo': 'English',
    'lang.switchLabel': '英語に切り替える',

    'home.kicker': 'Honours Student Program · 名古屋大学',
    'home.title1': '科学論文の書き方:',
    'home.title2': '原則と実践',
    'home.intro':
      '全5回、各60分。科学論文に独自のルールがある理由から、査読への対応までを学びます。各回を自分のペースで進め、教材に組み込まれた確認問題で理解度をチェックしましょう。',
    'home.notStarted': 'まだどの回も始めていません。',
    'home.someDone': '全5回のうち{n}回を学習済み。',
    'home.allDone': '全5回を学習しました。お疲れさまでした。',
    'home.loginPrompt':
      'ログインすると、進捗が端末をまたいで保存され、ライティング課題とディスカッションが使えます。',
    'home.slides': 'スライド{n}枚',
    'home.quizBest': 'クイズ最高点 {s}/{t}',
    'home.instructor': '教員用ダッシュボード',
    'tb.kicker': '無料のコンパニオン・テキスト',
    'tb.title': '科学論文の書き方 ― 原則と実践',
    'tb.desc':
      '講義全体を1冊の電子書籍にまとめました。例文、練習、チェックリスト付きの全5章。ASIME から無料でダウンロードできます。',
    'tb.cta': '無料テキストを入手 →',
    'cta.review': '復習する',
    'cta.continue': '続きから',
    'cta.start': '始める',
    'nav.writing': 'ライティング課題',
    'nav.discussion': 'ディスカッション',
    'nav.quiz': 'クイズ',

    'common.noClass': 'その回は存在しません。',
    'common.backCourse': 'コースに戻る',
    'common.backSlides': '← スライドに戻る',
    'common.classN': '第{n}回',

    'login.kicker': 'Honours Student Program',
    'login.signIn': 'サインイン',
    'login.choosePin': 'PINを決める',
    'login.enterPin': 'PINを入力',
    'login.nameHelp': '教員の受講者一覧に表示したい名前を入力してください。',
    'login.firstTime': '「{name}」さんは初めてですね。次回も使える4桁のPINを決めてください。',
    'login.welcomeBack': '{name}さん、おかえりなさい。',
    'login.namePlaceholder': '名前',
    'login.continue': '次へ',
    'login.pinPlaceholder': '4桁のPIN',
    'login.confirmPlaceholder': 'PINをもう一度',
    'login.create': 'アカウントを作成',
    'login.login': 'ログイン',
    'login.notYou': '別の名前を使う',
    'login.pinNote':
      'このPINは、あなたの進捗をクラスメートのものと区別するためだけのものです。セキュリティ用のパスワードではないので、大切なパスワードを使い回さないでください。',
    'login.back': '← サインインせずに戻る',
    'login.errName': '名前を入力してください。',
    'login.errPin': 'PINは4桁の数字で入力してください。',
    'login.errMismatch': 'PINが一致しません。',
    'login.errGeneric': 'エラーが発生しました。もう一度お試しください。',
    'login.errWrongPin': 'この名前のPINと一致しません。',
    'login.errFailed': 'ログインできませんでした。',

    'viewer.all': '← 全5回の一覧',
    'viewer.slideOf': 'スライド {a} / {b}',
    'viewer.back': '戻る',
    'viewer.next': '次へ',
    'viewer.takeQuiz': 'クイズに進む →',
    'viewer.enNote': '例文など、英語で学ぶべき部分は英語のまま表示しています。',

    'quiz.header': '第{n}回 クイズ',
    'quiz.sub': 'この回のスライドから出題される確認問題 {n} 問。',
    'quiz.none': 'この回のクイズはまだありません。',
    'quiz.complete': 'クイズ終了',
    'quiz.perfect': '全問正解です。',
    'quiz.solid': 'この回の内容をよく理解できています。間違えた問題だけ軽く復習しましょう。',
    'quiz.again': '先に進む前に、この回のスライドをもう一度見直しましょう。',
    'quiz.retake': 'もう一度挑戦する',
    'quiz.questionOf': '問題 {a} / {b}',
    'quiz.scoreSoFar': '現在の得点:{n}',
    'quiz.correct': '正解です。',
    'quiz.notQuite': '惜しい。',
    'quiz.nextQ': '次の問題',
    'quiz.results': '結果を見る',

    'chat.header': '第{n}回 ディスカッション',
    'chat.sub': 'ここでの質問は、クラスメートと教員に表示されます。',
    'chat.login': 'ディスカッションに参加するにはログインしてください。',
    'chat.empty': 'まだメッセージはありません。この回について最初の質問をしてみましょう。',
    'chat.placeholder': 'この回について質問する…',
    'chat.send': '送信',
    'chat.instructor': '教員',

    'write.header': '第{n}回 ライティング課題',
    'write.login': '回答を書いて保存するにはログインしてください。',
    'write.words': '{n} 語',
    'write.saving': '保存中…',
    'write.saved': '保存しました',
    'write.error': '保存できませんでした。もう一度お試しください',
    'write.save': '回答を保存',
    'write.checkHeading': '次に進む前に確認',

    'act.label': 'あなたの回答',
    'act.saving': '保存中…',
    'act.saved': '保存しました ✓',
    'act.error': '保存できませんでした。入力を続けると再試行します',
    'act.placeholder': '短い回答を入力してください。1〜2文で十分です。教員が読むことができます。',
    'act.note': '自動で保存されます。あなたと教員だけに表示されます。',
    'act.loginLink': 'ログイン',
    'act.loginRest': 'すると、ここに回答を入力できます。',
  },
};

// Server error messages (always English) mapped to interface keys.
const SERVER_ERRORS = {
  'Enter your name.': 'login.errName',
  'PIN must be exactly 4 digits.': 'login.errPin',
  'That PIN doesn’t match this name.': 'login.errWrongPin',
  'Could not log in.': 'login.errFailed',
};

export function translate(lang, key, vars) {
  const table = STRINGS[lang] || STRINGS.en;
  let s = table[key];
  if (s === undefined) s = STRINGS.en[key];
  if (s === undefined) return key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(String(v));
  }
  return s;
}

export function translateServerError(lang, message) {
  const key = SERVER_ERRORS[message];
  return key ? translate(lang, key) : message;
}

// True when the text contains Japanese characters (kana or kanji).
export function hasJapanese(text) {
  return /[぀-ヿ㐀-䶿一-鿿]/.test(String(text || ''));
}
