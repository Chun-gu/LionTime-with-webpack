import styles from './style.module.css';

import ConfirmDialog from '../ConfirmDialog';

import { BUTTON, ACTION } from '@constants';
import { useScrollFix } from '@utils';

export default class BottomSheet {
  #bottomSheet;
  #backdropAnimation;
  #bottomSheetAnimation;
  #toggleScrollFix;

  constructor({ type, postId, isMine }) {
    this.#bottomSheet = this.template({ type, isMine });
    this.#toggleScrollFix = useScrollFix(document.querySelector('html'));
    this.addEvent(postId);
  }

  template({ type, isMine }) {
    const wrapper = document.createElement('div');

    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop', styles['backdrop']);
    this.#backdropAnimation = backdrop.animate(
      { opacity: [0, 0.6] },
      { duration: 200 },
    );

    const bottomSheet = document.createElement('div');
    bottomSheet.classList.add(styles['bottom-sheet']);
    this.#bottomSheetAnimation = bottomSheet.animate(
      { transform: ['translateY(100%)', 'translateY(0)'] },
      { duration: 200 },
    );

    BUTTON[type](isMine).forEach((action) => {
      const button = document.createElement('button');
      button.id = action;
      button.classList.add(styles['button']);
      button.type = 'button';
      button.textContent = ACTION[action];
      bottomSheet.append(button);
    });

    wrapper.append(backdrop);
    wrapper.append(bottomSheet);

    return wrapper;
  }

  addEvent(postId) {
    const ACTIONS = [...Object.keys(ACTION)];

    this.#bottomSheet.addEventListener('click', ({ target }) => {
      if (target.classList.contains('backdrop')) this.close();

      const action = target.id;
      if (ACTIONS.includes(action)) {
        if (action === 'update') {
          return (location.href = `postUpload?postId=${postId}`);
        }

        new ConfirmDialog({ action, postId }).open();
      }
    });
  }

  open() {
    this.#toggleScrollFix();
    const container = document.querySelector('#container');
    container.append(this.#bottomSheet);
    window.bottomSheet = this;

    this.#backdropAnimation.playbackRate = 1;
    this.#backdropAnimation.play();
    this.#bottomSheetAnimation.playbackRate = 1;
    this.#bottomSheetAnimation.play();
  }

  close() {
    this.#backdropAnimation.playbackRate = -1;
    this.#backdropAnimation.play();
    this.#bottomSheetAnimation.playbackRate = -1;
    this.#bottomSheetAnimation.play();

    this.#bottomSheetAnimation.onfinish = () => remove();

    const remove = () => {
      this.#toggleScrollFix();
      this.#bottomSheetAnimation.onfinish = null;
      this.#bottomSheet.remove();
      delete window.bottomSheet;
    };
  }
}
