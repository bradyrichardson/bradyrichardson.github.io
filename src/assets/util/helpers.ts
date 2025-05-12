export type TextAnimation = {
  text: string;
  setText: (text: string) => void;
  delay?: number;
  onComplete?: () => void;
}

// text animation helper function
export const animateText = async (animations: TextAnimation[]) => {
  for (const animation of animations) {
    await new Promise<void>((resolve) => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= animation.text.length) {
          animation.setText(animation.text.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(interval)
          if (animation.delay) {
            setTimeout(resolve, animation.delay)
          } else {
            resolve()
          }
          if (animation.onComplete) {
            animation.onComplete()
          }
        }
      }, 10)
    })
  }
}