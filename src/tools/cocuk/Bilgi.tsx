import { useMemo, useState } from 'preact/hooks';
import { finalMessage, PRAISE, QUIZ, TRY_AGAIN } from './quiz';
import { IcCheck, IcStar } from './icons';
import { shuffle } from './logic';

export function Bilgi() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const q = QUIZ[i];
  const praise = useMemo(() => PRAISE[i % PRAISE.length], [i]);
  const retry = useMemo(() => TRY_AGAIN[i % TRY_AGAIN.length], [i]);
  // seçenekler her soruda karışık sırada gösterilir (doğru cevap hep ilk sırada olmasın)
  const order = useMemo(() => shuffle(q.options.map((_, k) => k)), [i, done]);

  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const stars = score >= QUIZ.length * 0.9 ? 3 : score >= QUIZ.length * 0.6 ? 2 : 1;
    return (
      <div class="ck-win" data-testid="quiz-done">
        <div class="ck-win-stars" aria-label={stars + ' yıldız'}>
          {[0, 1, 2].map((k) => (
            <IcStar key={k} on={k < stars} />
          ))}
        </div>
        <b data-testid="quiz-score">
          {score} / {QUIZ.length}
        </b>
        <span>{finalMessage(score, QUIZ.length)}</span>
        <button class="ck-big-btn" data-testid="quiz-restart" onClick={restart}>
          Yeniden oyna
        </button>
      </div>
    );
  }

  const answered = picked !== null;
  const right = picked === q.answer;
  return (
    <div class="ck-quiz" data-testid="quiz">
      <div class="ck-progress" aria-label={`Soru ${i + 1} / ${QUIZ.length}`} data-testid="quiz-progress">
        {QUIZ.map((_, k) => (
          <i key={k} class={k < i ? 'past' : k === i ? 'now' : ''} />
        ))}
      </div>
      <h2 class="ck-q" data-testid="quiz-q">
        {q.q}
      </h2>
      <div class="ck-opts">
        {order.map((k, pos) => {
          const o = q.options[k];
          const cls = answered ? (k === q.answer ? ' ok' : k === picked ? ' no' : ' dim') : '';
          return (
            <button
              key={k}
              class={'ck-opt' + cls}
              data-testid={'quiz-opt-' + pos}
              disabled={answered}
              onClick={() => {
                setPicked(k);
                if (k === q.answer) setScore((s) => s + 1);
              }}
            >
              {answered && k === q.answer && <IcCheck />} {o}
            </button>
          );
        })}
      </div>
      {answered && (
        <div class={'ck-feedback' + (right ? ' ok' : '')} data-testid="quiz-feedback" role="status">
          <b>{right ? praise : retry}</b>
          <span>{q.why}</span>
          <button
            class="ck-big-btn"
            data-testid="quiz-next"
            onClick={() => {
              if (i + 1 >= QUIZ.length) setDone(true);
              else {
                setI(i + 1);
                setPicked(null);
              }
            }}
          >
            {i + 1 >= QUIZ.length ? 'Sonucu gör' : 'Sonraki soru →'}
          </button>
        </div>
      )}
    </div>
  );
}
