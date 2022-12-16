import styles from './style.module.css';

import { deletePost, reportPost } from '@api';
import { replaceToPrevPage } from '@utils';

export default class ConfirmDialog {
  #confirmDialog;
  #dialogAnimation;

  constructor({ action, postId }) {
    this.#confirmDialog = this.template(action);
    this.addEvent({ postId });
  }

  template(action) {
    const BUTTONS = [action, 'cancel'];
    const ACTION = { report: '신고', delete: '삭제', cancel: '취소' };

    const wrapper = document.createElement('div');
    wrapper.classList.add(styles['wrapper']);

    const dialog = document.createElement('div');
    dialog.classList.add(styles['dialog']);
    dialog.textContent = `${ACTION[action]} 하시겠습니까?`;
    this.#dialogAnimation = dialog.animate(
      { transform: ['scale(0)', 'scale(1)'] },
      { duration: 100 },
    );

    BUTTONS.forEach((action) => {
      const button = document.createElement('button');
      button.classList.add(action, styles['button']);
      button.type = 'button';
      button.textContent = ACTION[action];
      dialog.append(button);
    });

    wrapper.append(dialog);

    return wrapper;
  }

  addEvent({ postId }) {
    this.#confirmDialog.addEventListener('click', async ({ target }) => {
      if (target.classList.contains('cancel')) {
        this.close();
        window.bottomSheet.close();
      }

      if (target.classList.contains('report')) {
        const { ok, error } = await reportPost(postId);

        if (ok) {
          alert('신고했습니다.');
          this.close();
          window.bottomSheet.close();
        } else alert(error);
      }

      if (target.classList.contains('delete')) {
        const { ok, error } = await deletePost(postId);

        if (!ok) alert(error);
        else replaceToPrevPage();
      }

      if (target.classList.contains('logout')) {
        sessionStorage.removeItem('my-id');
        sessionStorage.removeItem('my-token');
        sessionStorage.removeItem('my-accountname');
        location.href = 'login';
      }
    });
  }

  open() {
    const container = document.querySelector('#container');
    container.append(this.#confirmDialog);
    window.confirmDialog = this;

    this.#dialogAnimation.playbackRate = 1;
    this.#dialogAnimation.play();
  }

  close() {
    this.#dialogAnimation.playbackRate = -1;
    this.#dialogAnimation.play();

    this.#dialogAnimation.onfinish = () => {
      this.#dialogAnimation.onfinish = null;
      this.#confirmDialog.remove();
      delete window.confirmDialog;
    };
  }
}
