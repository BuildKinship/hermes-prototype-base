export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Kinship Prototype Base</h1>
        <p className="text-slate-400 text-lg">Ready for your next prototype.</p>
        <div className="text-slate-500 text-sm font-mono">
          {process.env.NEXT_PUBLIC_PROTOTYPE_NAME || "base"}
        </div>
      </div>
    </main>
  );
}
