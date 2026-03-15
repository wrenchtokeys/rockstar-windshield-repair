import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      <h1 className="font-heading text-6xl font-bold uppercase tracking-wider text-blue-600">
        404
      </h1>
      <p className="mt-4 text-xl text-zinc-400">
        This page doesn&apos;t exist — but your windshield fix does.
      </p>
      <div className="mt-8">
        <Button href="/">Back to Home</Button>
      </div>
    </div>
  );
}
