// components/LoaderCentered.tsx
'use client'
import { Loader } from '../components/Loader'

export const LoaderCentered = ({
  text = 'Loading…',
  ...loaderProps
}: React.ComponentProps<typeof Loader> & { text?: string }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/30 backdrop-blur-sm">
    <Loader {...loaderProps} />
    {text && <p className="mt-4 text-gray-600">{text}</p>}
  </div>
);

