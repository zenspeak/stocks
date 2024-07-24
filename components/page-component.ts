import { ThemeToggle } from "@/components/theme-toggle";
import { OptionsChart } from "@/components/OptionsChart";
import { StockSelector } from "@/components/StockSelector";
import { ErrorBoundary } from "react-error-boundary";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import GithubIcon from "@/components/icons/GithubIcon";
import { cn } from "@/lib/utils";

export default function Home({
  searchParams,
}: {
  searchParams: { symbol?: string };
}) {
  const symbol = searchParams.symbol || "NVDA";

  return (
    <div className='min-h-screen pt-6 pb-12 lg:px-12 px-3'>
      <nav className='w-full flex flex-row gap-2 justify-end'>
        <Link
          href={"https://github.com/yourusername/your-repo"}
          target='_blank'
          rel='noreferrer'>
          <div
            className={cn(
              buttonVariants({
                variant: "ghost",
              }),
              "h-[40px] w-[40px] px-0"
            )}>
            <GithubIcon className='h-[1.2rem] w-[1.2rem]' />
            <span className='sr-only'>GitHub</span>
          </div>
        </Link>
        <ThemeToggle />
      </nav>
      <main className='w-full pt-20 flex flex-col gap-4 mx-auto max-w-screen-lg flex-col items-center'>
        <StockSelector />
        <ErrorBoundary
          fallback={
            <span className='text-sm text-red-600'>
              Error with Polygon.io API 😅 - Please try again later.
            </span>
          }>
          <OptionsChart symbol={symbol} />
        </ErrorBoundary>
      </main>
    </div>
  );
}
