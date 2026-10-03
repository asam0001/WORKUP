import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-500 mb-4">
        <Terminal className="w-6 h-6" />
      </div>
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">404 — Page Not Found</h1>
      <p className="text-sm text-gray-600 max-w-md mb-8">
        The requested resource, simulation, or career track could not be found.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
}
