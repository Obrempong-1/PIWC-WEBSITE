import React, { Suspense } from 'react';
import type { ReactQuillProps } from 'react-quill';

const ReactQuill = React.lazy(() => import('react-quill'));

const LazyQuill = (props: ReactQuillProps) => (
  <Suspense fallback={<div>Loading editor...</div>}>
    <ReactQuill {...props} />
  </Suspense>
);

export default LazyQuill;
