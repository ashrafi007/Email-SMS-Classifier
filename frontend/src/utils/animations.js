import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

let registered = false
export const registerGsap = () => {
  if (registered) return
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
  registered = true
}

export const fadeSlideUp = (el, delay = 0) =>
  gsap.fromTo(
    el,
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay }
  )

export const fadeIn = (el, delay = 0) =>
  gsap.fromTo(
    el,
    { opacity: 0 },
    { opacity: 1, duration: 0.8, ease: 'power3.out', delay }
  )

export const glowLoop = (el) =>
  gsap.to(el, {
    boxShadow:
      '0 0 24px rgba(59, 130, 246, 0.55), 0 0 48px rgba(14, 165, 233, 0.35)',
    scale: 1.03,
    duration: 1.4,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  })

export const buttonHoverIn = (el) =>
  gsap.to(el, { scale: 1.05, duration: 0.3, ease: 'power2.out' })

export const buttonHoverOut = (el) =>
  gsap.to(el, { scale: 1, duration: 0.3, ease: 'power2.out' })

export const sectionFadeScaleIn = (el) =>
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.95 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  )

export const bounceInCard = (el) =>
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.6, y: 30 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.1,
      ease: 'elastic.out(1, 0.55)',
    }
  )

export const shakeFlash = (el) => {
  const tl = gsap.timeline()
  tl.fromTo(
    el,
    { opacity: 0, scale: 0.9 },
    { opacity: 1, scale: 1, duration: 0.4, ease: 'power3.out' }
  )
    .to(el, {
      x: -14,
      duration: 0.06,
      repeat: 7,
      yoyo: true,
      ease: 'power1.inOut',
    })
    .to(el, { x: 0, duration: 0.1, ease: 'power2.out' })
  return tl
}

export const scrollToSection = (target) =>
  gsap.to(window, {
    duration: 1,
    scrollTo: { y: target, offsetY: 0 },
    ease: 'power3.out',
  })
