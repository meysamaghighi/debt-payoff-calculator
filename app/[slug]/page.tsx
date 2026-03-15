import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { debtTypes, getDebtTypeBySlug, formatCurrency } from "../lib/debt-engine";
import DebtCalculator from "../components/DebtCalculator";

export function generateStaticParams() {
  return debtTypes.map((dt) => ({ slug: dt.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dt = getDebtTypeBySlug(slug);
  if (!dt) return {};
  return {
    title: dt.seoTitle,
    description: dt.seoDescription,
  };
}

export default async function DebtTypePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dt = getDebtTypeBySlug(slug);
  if (!dt) notFound();

  const otherTypes = debtTypes.filter((d) => d.slug !== dt.slug);

  const prefilledDebts = [
    {
      id: "1",
      name: dt.name,
      balance: dt.avgBalance,
      interestRate: dt.avgInterestRate,
      minimumPayment: dt.avgMinPayment,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          {" > "}
          <span className="text-gray-900">{dt.name}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            {dt.name} Payoff Calculator
          </h1>
          <p className="text-lg text-gray-600 mb-4">{dt.description}</p>

          <div className="flex flex-wrap gap-3">
            <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
              Avg Balance: {formatCurrency(dt.avgBalance)}
            </span>
            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
              Typical Rates: {dt.commonRates}
            </span>
            <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              Avg Min Payment: {formatCurrency(dt.avgMinPayment)}/mo
            </span>
          </div>
        </div>

        {/* Calculator pre-filled */}
        <DebtCalculator prefilledDebts={prefilledDebts} />

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tips for Paying Off {dt.name}
          </h2>
          <ol className="space-y-3">
            {dt.tips.map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <p className="text-gray-700 pt-1">{tip}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Other Debt Types */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Other Debt Payoff Calculators
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {otherTypes.map((d) => (
              <Link
                key={d.slug}
                href={`/${d.slug}`}
                className="bg-gray-50 hover:bg-blue-50 rounded-xl p-4 transition-colors"
              >
                <p className="font-bold text-gray-900 text-sm">{d.name}</p>
                <p className="text-xs text-gray-500">{d.commonRates}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Debt Payoff Calculator
          </Link>
        </div>
      </div>
    </main>
  );
}
