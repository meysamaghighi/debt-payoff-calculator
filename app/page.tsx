import type { Metadata } from "next";
import Link from "next/link";
import DebtCalculator from "./components/DebtCalculator";
import { debtTypes } from "./lib/debt-engine";

export const metadata: Metadata = {
  title: "Debt Payoff Calculator - Free Avalanche vs Snowball Comparison | 2026",
  description:
    "Free debt payoff calculator. Enter your debts, compare avalanche and snowball methods, and see your debt-free date. Find out how extra payments save you thousands in interest.",
  keywords: [
    "debt payoff calculator",
    "debt free calculator",
    "avalanche vs snowball",
    "debt snowball calculator",
    "debt avalanche calculator",
    "pay off debt faster",
    "credit card payoff calculator",
    "student loan payoff calculator",
    "how to pay off debt",
    "debt free date",
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          Debt Payoff{" "}
          <span className="text-blue-600">Calculator</span>
        </h1>
        <p className="text-xl text-gray-600 mb-2 max-w-2xl mx-auto">
          Enter your debts, compare avalanche vs snowball strategies, and find
          your debt-free date. See how extra payments save you thousands.
        </p>
        <p className="text-sm text-gray-400">
          Free, no sign-up required. Your data stays in your browser.
        </p>
      </div>

      {/* Calculator */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <DebtCalculator />
      </div>

      {/* Debt Type Pages */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Payoff Calculators by Debt Type
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {debtTypes.map((dt) => (
            <Link
              key={dt.slug}
              href={`/${dt.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 text-center"
            >
              <p className="font-bold text-gray-900 text-sm">{dt.name}</p>
              <p className="text-xs text-gray-500">{dt.commonRates}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Avalanche vs Snowball Explainer */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Avalanche vs Snowball: Which Method Is Best?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-blue-600 mb-3">
              Avalanche Method
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Pay minimums on everything, then put all extra money toward the
              debt with the <strong>highest interest rate</strong>.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>+ Saves the most money in total interest</li>
              <li>+ Mathematically optimal</li>
              <li>- Can feel slow if highest-rate debt is large</li>
            </ul>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-blue-600 mb-3">
              Snowball Method
            </h3>
            <p className="text-gray-700 text-sm mb-3">
              Pay minimums on everything, then put all extra money toward the
              debt with the <strong>smallest balance</strong>.
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>+ Quick wins boost motivation</li>
              <li>+ Fewer debts to track sooner</li>
              <li>- Costs more in total interest</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          How the Debt Payoff Calculator Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
            <h3 className="font-bold text-gray-900 mb-2">Enter Your Debts</h3>
            <p className="text-gray-600 text-sm">
              Add each debt with its balance, interest rate, and minimum payment.
              Add as many debts as you have.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
            <h3 className="font-bold text-gray-900 mb-2">Set Extra Payment</h3>
            <p className="text-gray-600 text-sm">
              Tell us how much extra you can pay each month beyond your minimums.
              Even $50 extra makes a huge difference.
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
            <h3 className="font-bold text-gray-900 mb-2">Compare Strategies</h3>
            <p className="text-gray-600 text-sm">
              See your debt-free date, total interest, and payoff order for both
              avalanche and snowball methods side by side.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="max-w-4xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          How to Pay Off Debt Faster in 2026
        </h2>
        <div className="max-w-none text-gray-700 leading-relaxed space-y-4">
          <p>
            The average American household carries $104,000 in debt including
            mortgages, $6,500 in credit card debt, and $37,000 in student loans.
            Paying off debt faster starts with a plan and the right strategy.
          </p>
          <p>
            The two most popular debt payoff strategies are the avalanche method
            and the snowball method. The avalanche method targets your
            highest-interest debt first, saving you the most money. The snowball
            method targets your smallest balance first, giving you quick
            psychological wins that keep you motivated.
          </p>
          <p>
            Research shows that the snowball method leads to higher completion
            rates because of the motivational effect of eliminating debts
            quickly. However, the avalanche method saves more money in total
            interest. The best method is the one you will actually stick with.
          </p>
          <h3 className="text-xl font-bold text-gray-900 mt-6">
            The Power of Extra Payments
          </h3>
          <p>
            Even a small amount of extra money toward debt each month has a
            massive compounding effect. On $20,000 of credit card debt at 22%
            APR, paying $100 extra per month saves over $14,000 in interest and
            gets you debt-free 8 years sooner. Use the calculator above to see
            the exact impact for your situation.
          </p>
        </div>
      </section>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the avalanche method for paying off debt?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The avalanche method means paying minimum payments on all debts, then directing all extra money to the debt with the highest interest rate. Once that debt is paid off, you move to the next highest rate. This method saves the most money in total interest paid.",
                },
              },
              {
                "@type": "Question",
                name: "What is the snowball method for paying off debt?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The snowball method means paying minimum payments on all debts, then directing all extra money to the debt with the smallest balance. Once that debt is paid off, you move to the next smallest. This method provides quick wins that keep you motivated.",
                },
              },
              {
                "@type": "Question",
                name: "Which is better, avalanche or snowball?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "The avalanche method saves more money in total interest. The snowball method provides faster psychological wins. Research shows the snowball method has higher completion rates due to motivation, but the avalanche method is mathematically optimal. The best method is the one you will stick with.",
                },
              },
              {
                "@type": "Question",
                name: "How much should I put toward debt each month?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Financial experts recommend the 50/30/20 rule: 50% of income for needs, 30% for wants, and 20% for savings and debt repayment. If you have high-interest debt, consider temporarily allocating more toward debt. Even $50-100 extra per month can save thousands in interest over time.",
                },
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "Debt Payoff Calculator",
            description:
              "Free debt payoff calculator. Compare avalanche and snowball methods. See your debt-free date and total interest savings.",
            url: "https://debt-payoff-calculator.vercel.app",
            applicationCategory: "FinanceApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
    </main>
  );
}
