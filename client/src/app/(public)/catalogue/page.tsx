'use client';

import { Suspense } from 'react';
import Catalogue from '../../../components/pages/Catalogue';

function CatalogueContent() {
  return <Catalogue />;
}

export default function CataloguePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CatalogueContent />
    </Suspense>
  );
}
