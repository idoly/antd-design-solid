let lockCount = 0;
let originalBodyOverflow = '';

export function lockBodyScroll() {
  if (lockCount === 0) {
    originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  lockCount += 1;
}

export function unlockBodyScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) document.body.style.overflow = originalBodyOverflow;
}
