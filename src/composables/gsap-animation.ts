import gsap from 'gsap';

const onCardEnter = (el: any, done: any) => {
  gsap.from(el, {
    opacity: 0,
    y: -50,
    duration: 0.3,
    delay: el?.dataset.index * 0.1,
    onComplete: done,
  });
};

const onCardLeave = (el: any, done: any) => {
  gsap.to(el, {
    opacity: 0,
    y: -50,
    duration: 0.3,
    onComplete: done,
  });
};
export interface IA {
  // b - Тип
  b: number,
  // @param - sadasdas
  casdas: string,
  d?: string,
  e?: string
}

const a: IA = {
  b: 1,
  casdas: 'asda'
};

a.

export const useCardAnimations = () => {
  return {
    onEnter: onCardEnter,
    onLeave: onCardLeave,
  };
};
