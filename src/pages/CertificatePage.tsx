import React from 'react';
import { Certificate } from '@/components/Certificate';
import { Navigation } from '@/components/Navigation';

export default function CertificatePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Navigation />
      <Certificate />
    </div>
  );
}
