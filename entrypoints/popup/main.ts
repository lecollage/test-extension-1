import './style.css';
import { browser } from 'wxt/browser';

const COUNTER_KEY = 'popupOpenCount';

const currentTimeElement = document.querySelector<HTMLParagraphElement>('#current-time');
const openedAtElement = document.querySelector<HTMLParagraphElement>('#opened-at');
const openCountSummaryElement = document.querySelector<HTMLParagraphElement>('#open-count-summary');
const openCountModalElement = document.querySelector<HTMLParagraphElement>('#open-count-modal');
const modalElement = document.querySelector<HTMLDivElement>('#details-modal');
const openModalButtonElement = document.querySelector<HTMLButtonElement>('#open-modal-button');
const closeModalButtonElement = document.querySelector<HTMLButtonElement>('#close-modal-button');
const closeModalBackdropElement = document.querySelector<HTMLDivElement>('#close-modal-backdrop');

function ensureElement<T extends Element>(element: T | null, id: string): T {
  if (!element) {
    throw new Error(`Missing required element: ${id}`);
  }

  return element;
}

const currentTimeNode = ensureElement(currentTimeElement, 'current-time');
const openedAtNode = ensureElement(openedAtElement, 'opened-at');
const openCountSummaryNode = ensureElement(openCountSummaryElement, 'open-count-summary');
const openCountModalNode = ensureElement(openCountModalElement, 'open-count-modal');
const modalNode = ensureElement(modalElement, 'details-modal');
const openModalButtonNode = ensureElement(openModalButtonElement, 'open-modal-button');
const closeModalButtonNode = ensureElement(closeModalButtonElement, 'close-modal-button');
const closeModalBackdropNode = ensureElement(closeModalBackdropElement, 'close-modal-backdrop');

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).format(date);
}

function renderCurrentTime(): void {
  currentTimeNode.textContent = formatTime(new Date());
}

function setOpenCount(count: number): void {
  const value = String(count);
  openCountSummaryNode.textContent = value;
  openCountModalNode.textContent = value;
}

function openModal(): void {
  modalNode.classList.remove('is-hidden');
}

function closeModal(): void {
  modalNode.classList.add('is-hidden');
}

async function incrementOpenCount(): Promise<void> {
  const result = await browser.storage.local.get(COUNTER_KEY);
  const currentCount = typeof result[COUNTER_KEY] === 'number' ? result[COUNTER_KEY] : 0;
  const nextCount = currentCount + 1;

  await browser.storage.local.set({ [COUNTER_KEY]: nextCount });
  setOpenCount(nextCount);
}

async function initPopup(): Promise<void> {
  const openedAt = new Date();
  openedAtNode.textContent = formatTime(openedAt);

  renderCurrentTime();
  window.setInterval(renderCurrentTime, 1000);

  openModalButtonNode.addEventListener('click', openModal);
  closeModalButtonNode.addEventListener('click', closeModal);
  closeModalBackdropNode.addEventListener('click', closeModal);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  });

  await incrementOpenCount();
}

void initPopup();
