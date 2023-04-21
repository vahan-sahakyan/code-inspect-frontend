import { css } from '@emotion/css';

export const styled: Record<string, string> = {
  textArea: css`
    width: 100%;
    padding: 0.5rem 0.7rem;
    outline: none;
    height: 4rem;
  `,
  dropdownItem: css`
    &.active,
    &:active {
      background-color: black;
    }
  `,
};
