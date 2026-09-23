import { Loader2 } from "lucide-react";

// Used by Suspense while a route-level page is being downloaded.
const Loading = ({ message = "Loading your fragrance experience..." }) => {
  return (
  <div className="flex min-h-[300px] bg-black flex-col items-center justify-center gap-4 px-4">
    <div className="relative flex h-16 w-16 items-center justify-center">
      <div className="absolute inset-0 rounded-full border-4 border-white/10" />

      <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-lime-400" />

      <Loader2
        size={24}
        className="animate-spin text-lime-400"
      />
    </div>

    <div className="text-center">
      <p className="font-medium text-white">
        Please wait
      </p>

      <p className="mt-1 text-sm text-gray-500">
        {message}
      </p>
    </div>

    <div className="flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400 [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-lime-400 [animation-delay:300ms]" />
    </div>
  </div>
  )
}

export default Loading
