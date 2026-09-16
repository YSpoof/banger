import { createSignal, onSettled } from "solid-js";

type Props = {
  duration: number;
  progressClass: string;
  onComplete: () => void;
};

export default function ToastProgressBar(props: Props) {
  const [progress, setProgress] = createSignal(1);

  onSettled(() => {
    const toastDuration = Math.max(props.duration, 1);

    let animationFrameId: number | null = null;
    let elapsed = 0;
    let lastFrameTime = performance.now();
    let finished = false;

    const tick = (now: number) => {
      const delta = now - lastFrameTime;
      lastFrameTime = now;

      elapsed += delta;

      const next = Math.max(0, 1 - elapsed / toastDuration);
      setProgress(next);

      if (next <= 0 && !finished) {
        finished = true;
        props.onComplete();
        return;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (typeof animationFrameId === "number") {
        cancelAnimationFrame(animationFrameId);
      }
    };
  });

  return (
    <>
      <div
        class="pointer-events-none absolute bottom-0 left-0 h-1 w-full bg-black/15"
        aria-hidden="true">
        <div
          class={["toast-progress-fill h-full", props.progressClass]}
          style={{
            "--toast-progress": `${progress() * 100}%`,
          }}
        />
      </div>

      <div
        class="sr-only"
        role="progressbar"
        aria-label="Tempo restante da notificação"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress() * 100}
      />
    </>
  );
}
