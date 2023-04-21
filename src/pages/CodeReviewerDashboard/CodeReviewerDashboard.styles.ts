import { css } from '@emotion/css';
import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  goBack: { fontSize: 16, display: 'block', cursor: 'pointer', margin: '2rem 0' },
  wrapperTitle: { marginTop: '-.8rem', width: 'max-content' },
  assignmentsGrid: { gridTemplateColumns: 'repeat(auto-fill, 18rem)', minHeight: '8rem' },
  btnCreateAssignment: { fontSize: 16, margin: '2rem 0', display: 'block' },
};
export const styled = {
  copy: css`
    width: 1rem;
    height: 1rem;
    aspect-ratio: 1 / 1;
    cursor: pointer;
    margin-left: 0.7rem;
    fill: var(--bs-secondary);
    &:hover:not(:active) {
      fill: var(--bs-dark);
    }
    &:active {
      fill: var(--bs-warning);
    }
  `,
  textArea: css`
    width: 100%;
    padding: 0.5rem 0.7rem;
    outline: none;
    height: 4rem;
  `,
};
