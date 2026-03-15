"use client";

import { useState, useMemo } from "react";
import {
  type Debt,
  calculatePayoff,
  formatCurrency,
  formatMonths,
} from "../lib/debt-engine";

let nextId = 1;

function createDebt(
  name = "",
  balance = 0,
  rate = 0,
  minPay = 0
): Debt {
  return {
    id: String(nextId++),
    name,
    balance,
    interestRate: rate,
    minimumPayment: minPay,
  };
}

interface Props {
  prefilledDebts?: Debt[];
}

export default function DebtCalculator({ prefilledDebts }: Props) {
  const [debts, setDebts] = useState<Debt[]>(
    prefilledDebts && prefilledDebts.length > 0
      ? prefilledDebts
      : [createDebt("Credit Card", 5000, 22, 100)]
  );
  const [extraPayment, setExtraPayment] = useState(200);
  const [showResults, setShowResults] = useState(false);
  const [expandedSchedule, setExpandedSchedule] = useState(false);

  function addDebt() {
    setDebts([...debts, createDebt()]);
  }

  function removeDebt(id: string) {
    if (debts.length > 1) {
      setDebts(debts.filter((d) => d.id !== id));
    }
  }

  function updateDebt(id: string, field: keyof Debt, value: string | number) {
    setDebts(
      debts.map((d) => (d.id === id ? { ...d, [field]: value } : d))
    );
  }

  const avalanche = useMemo(
    () => calculatePayoff(debts.filter((d) => d.balance > 0), extraPayment, "avalanche"),
    [debts, extraPayment]
  );

  const snowball = useMemo(
    () => calculatePayoff(debts.filter((d) => d.balance > 0), extraPayment, "snowball"),
    [debts, extraPayment]
  );

  const noExtra = useMemo(
    () => calculatePayoff(debts.filter((d) => d.balance > 0), 0, "avalanche"),
    [debts]
  );

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinPayments = debts.reduce((s, d) => s + d.minimumPayment, 0);
  const interestSaved = noExtra.totalInterest - avalanche.totalInterest;
  const timeSaved = noExtra.months - avalanche.months;

  return (
    <div>
      {/* Debt Input Form */}
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Enter Your Debts
        </h2>

        <div className="space-y-4 mb-6">
          {debts.map((debt, i) => (
            <div
              key={debt.id}
              className="bg-gray-50 rounded-xl p-4 relative"
            >
              {debts.length > 1 && (
                <button
                  onClick={() => removeDebt(debt.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
                >
                  Remove
                </button>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Debt Name
                  </label>
                  <input
                    type="text"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                    placeholder="e.g. Visa Card"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Balance ($)
                  </label>
                  <input
                    type="number"
                    value={debt.balance || ""}
                    onChange={(e) =>
                      updateDebt(debt.id, "balance", Number(e.target.value))
                    }
                    placeholder="5000"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Interest Rate (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={debt.interestRate || ""}
                    onChange={(e) =>
                      updateDebt(debt.id, "interestRate", Number(e.target.value))
                    }
                    placeholder="22.0"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Min. Payment ($)
                  </label>
                  <input
                    type="number"
                    value={debt.minimumPayment || ""}
                    onChange={(e) =>
                      updateDebt(
                        debt.id,
                        "minimumPayment",
                        Number(e.target.value)
                      )
                    }
                    placeholder="100"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addDebt}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-6 block"
        >
          + Add Another Debt
        </button>

        {/* Extra Payment */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Extra monthly payment (on top of minimums): {formatCurrency(extraPayment)}
          </label>
          <input
            type="range"
            min={0}
            max={2000}
            step={25}
            value={extraPayment}
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$0</span>
            <span>$500</span>
            <span>$1,000</span>
            <span>$1,500</span>
            <span>$2,000</span>
          </div>
        </div>

        <button
          onClick={() => setShowResults(true)}
          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl text-lg hover:bg-blue-700 transition-colors"
        >
          Calculate Payoff Plan
        </button>
      </div>

      {/* Results */}
      {showResults && totalDebt > 0 && (
        <div>
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-md p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">Total Debt</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatCurrency(totalDebt)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-5 text-center">
              <p className="text-sm text-gray-500 mb-1">Monthly Payment</p>
              <p className="text-3xl font-bold text-blue-600">
                {formatCurrency(totalMinPayments + extraPayment)}
              </p>
              <p className="text-xs text-gray-400">
                {formatCurrency(totalMinPayments)} min + {formatCurrency(extraPayment)} extra
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl shadow-md p-5 text-center">
              <p className="text-sm text-green-700 mb-1">Interest Saved vs Minimums Only</p>
              <p className="text-3xl font-bold text-green-700">
                {formatCurrency(interestSaved)}
              </p>
              <p className="text-xs text-green-600">
                {timeSaved > 0 ? `${formatMonths(timeSaved)} faster` : ""}
              </p>
            </div>
          </div>

          {/* Method Comparison */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <MethodCard
              result={avalanche}
              isRecommended={avalanche.totalInterest <= snowball.totalInterest}
            />
            <MethodCard
              result={snowball}
              isRecommended={snowball.totalInterest < avalanche.totalInterest}
            />
          </div>

          {/* Savings vs minimum only */}
          {extraPayment > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
              <h3 className="font-bold text-blue-900 mb-2">
                The Power of Extra Payments
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-blue-700">Minimums Only</p>
                  <p className="font-bold text-gray-900">{formatMonths(noExtra.months)}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(noExtra.totalInterest)} interest</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">With {formatCurrency(extraPayment)} Extra</p>
                  <p className="font-bold text-blue-700">{formatMonths(avalanche.months)}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(avalanche.totalInterest)} interest</p>
                </div>
                <div>
                  <p className="text-xs text-blue-700">You Save</p>
                  <p className="font-bold text-green-700">{formatCurrency(interestSaved)}</p>
                  <p className="text-xs text-green-600">{formatMonths(timeSaved)} sooner</p>
                </div>
              </div>
            </div>
          )}

          {/* Payoff Order */}
          <div className="bg-white rounded-xl shadow-md p-5 mb-8">
            <h3 className="font-bold text-gray-900 mb-4">
              Payoff Order (Avalanche Method)
            </h3>
            <div className="space-y-3">
              {avalanche.debtPayoffOrder.map((d, i) => (
                <div key={d.id} className="flex items-center gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm">
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{d.name}</p>
                    <p className="text-sm text-gray-500">
                      Paid off in {formatMonths(d.month)}
                    </p>
                  </div>
                  <div className="w-full max-w-[200px] bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (d.month / avalanche.months) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Schedule (collapsible) */}
          <div className="bg-white rounded-xl shadow-md p-5 mb-8">
            <button
              onClick={() => setExpandedSchedule(!expandedSchedule)}
              className="w-full flex items-center justify-between font-bold text-gray-900"
            >
              <span>Monthly Payment Schedule</span>
              <span className="text-blue-600">
                {expandedSchedule ? "Hide" : "Show"}
              </span>
            </button>
            {expandedSchedule && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">Month</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">Payment</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">Interest</th>
                      <th className="text-left py-2 px-2 font-semibold text-gray-700">Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {avalanche.schedule.map((m) => (
                      <tr key={m.month} className="border-b border-gray-50">
                        <td className="py-2 px-2 text-gray-800">{m.month}</td>
                        <td className="py-2 px-2 text-gray-800">
                          {formatCurrency(Math.round(m.totalPayment))}
                        </td>
                        <td className="py-2 px-2 text-red-600">
                          {formatCurrency(
                            Math.round(m.debts.reduce((s, d) => s + d.interest, 0))
                          )}
                        </td>
                        <td className="py-2 px-2 font-medium text-gray-800">
                          {formatCurrency(Math.round(m.totalBalance))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function MethodCard({
  result,
  isRecommended,
}: {
  result: ReturnType<typeof calculatePayoff>;
  isRecommended: boolean;
}) {
  return (
    <div
      className={`rounded-xl shadow-md p-5 ${
        isRecommended
          ? "bg-blue-50 border-2 border-blue-500"
          : "bg-white border border-gray-200"
      }`}
    >
      {isRecommended && (
        <span className="inline-block bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full mb-3">
          Recommended
        </span>
      )}
      <h3 className="font-bold text-gray-900 mb-3">{result.methodLabel}</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Debt-free in</span>
          <span className="font-bold text-gray-900">
            {formatMonths(result.months)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total paid</span>
          <span className="font-medium text-gray-800">
            {formatCurrency(result.totalPaid)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-600">Total interest</span>
          <span className="font-medium text-red-600">
            {formatCurrency(result.totalInterest)}
          </span>
        </div>
      </div>
    </div>
  );
}
