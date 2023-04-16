import { CSSProperties } from 'react';

export const styles: Record<string, CSSProperties> = {
  goBack: { fontSize: 16, display: 'block', cursor: 'pointer', margin: '2rem 0' },
  wrapperTitle: { marginTop: '-.8rem', width: 'max-content' },
  assignmentsGrid: { gridTemplateColumns: 'repeat(auto-fill, 18rem)', minHeight: '8rem' },
  btnCreateAssignment: { fontSize: 16, margin: '2rem 0', display: 'block' },
};
