import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-white/[0.06] flex items-center justify-center mb-6">
        <span className="text-2xl">404</span>
      </div>
      <h1 className="text-[22px] font-bold tracking-tight">Not found</h1>
      <p className="mt-2 text-[14px] text-white/50">The page you’re looking for doesn’t exist or was moved.</p>
      <Link href="/" className="mt-6 inline-flex h-10 px-6 rounded-full bg-white text-black text-[14px] font-medium items-center hover:bg-white/90 transition-colors">
        Back to home
      </Link>
    </div>
  );
}
