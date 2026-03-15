export interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number; // annual %
  minimumPayment: number;
}

export interface PayoffMonth {
  month: number;
  debts: {
    id: string;
    name: string;
    startBalance: number;
    payment: number;
    interest: number;
    principal: number;
    endBalance: number;
  }[];
  totalPayment: number;
  totalBalance: number;
}

export interface PayoffResult {
  method: "avalanche" | "snowball";
  methodLabel: string;
  months: number;
  totalPaid: number;
  totalInterest: number;
  schedule: PayoffMonth[];
  debtPayoffOrder: { id: string; name: string; month: number }[];
}

export function calculatePayoff(
  debts: Debt[],
  extraPayment: number,
  method: "avalanche" | "snowball"
): PayoffResult {
  if (debts.length === 0) {
    return {
      method,
      methodLabel: method === "avalanche" ? "Avalanche (highest interest first)" : "Snowball (lowest balance first)",
      months: 0,
      totalPaid: 0,
      totalInterest: 0,
      schedule: [],
      debtPayoffOrder: [],
    };
  }

  // Deep copy debts
  let remaining = debts.map((d) => ({
    ...d,
    currentBalance: d.balance,
  }));

  const schedule: PayoffMonth[] = [];
  const debtPayoffOrder: { id: string; name: string; month: number }[] = [];
  let totalPaid = 0;
  let totalInterest = 0;
  let month = 0;
  const maxMonths = 600; // 50 years cap

  while (remaining.some((d) => d.currentBalance > 0.01) && month < maxMonths) {
    month++;

    // Sort remaining debts by method
    const active = remaining.filter((d) => d.currentBalance > 0.01);
    if (method === "avalanche") {
      active.sort((a, b) => b.interestRate - a.interestRate);
    } else {
      active.sort((a, b) => a.currentBalance - b.currentBalance);
    }

    // Calculate minimum payments and interest first
    let availableExtra = extraPayment;
    const monthDebts: PayoffMonth["debts"] = [];

    // First pass: apply minimums and calculate interest
    for (const debt of remaining) {
      if (debt.currentBalance <= 0.01) continue;

      const monthlyRate = debt.interestRate / 100 / 12;
      const interest = debt.currentBalance * monthlyRate;
      const minPay = Math.min(debt.minimumPayment, debt.currentBalance + interest);
      const principal = minPay - interest;

      monthDebts.push({
        id: debt.id,
        name: debt.name,
        startBalance: debt.currentBalance,
        payment: minPay,
        interest,
        principal,
        endBalance: Math.max(0, debt.currentBalance - principal),
      });

      debt.currentBalance = Math.max(0, debt.currentBalance - principal);
      totalPaid += minPay;
      totalInterest += interest;
    }

    // Second pass: apply extra payment to target debt (by method order)
    for (const target of active) {
      if (availableExtra <= 0) break;
      if (target.currentBalance <= 0.01) continue;

      const extraApplied = Math.min(availableExtra, target.currentBalance);
      target.currentBalance -= extraApplied;
      availableExtra -= extraApplied;
      totalPaid += extraApplied;

      // Update the month record
      const record = monthDebts.find((d) => d.id === target.id);
      if (record) {
        record.payment += extraApplied;
        record.principal += extraApplied;
        record.endBalance = Math.max(0, target.currentBalance);
      }
    }

    const totalBalance = remaining.reduce((s, d) => s + d.currentBalance, 0);

    schedule.push({
      month,
      debts: monthDebts,
      totalPayment: monthDebts.reduce((s, d) => s + d.payment, 0),
      totalBalance,
    });

    // Check for newly paid off debts
    for (const debt of remaining) {
      if (
        debt.currentBalance <= 0.01 &&
        !debtPayoffOrder.some((d) => d.id === debt.id)
      ) {
        debtPayoffOrder.push({ id: debt.id, name: debt.name, month });
      }
    }
  }

  return {
    method,
    methodLabel:
      method === "avalanche"
        ? "Avalanche (highest interest first)"
        : "Snowball (lowest balance first)",
    months: month,
    totalPaid: Math.round(totalPaid),
    totalInterest: Math.round(totalInterest),
    schedule,
    debtPayoffOrder,
  };
}

export function formatCurrency(amount: number): string {
  return "$" + amount.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function formatMonths(months: number): string {
  const years = Math.floor(months / 12);
  const remaining = months % 12;
  if (years === 0) return `${remaining} month${remaining !== 1 ? "s" : ""}`;
  if (remaining === 0) return `${years} year${years !== 1 ? "s" : ""}`;
  return `${years} year${years !== 1 ? "s" : ""} ${remaining} month${remaining !== 1 ? "s" : ""}`;
}

// Common debt types for SEO pages
export interface DebtType {
  slug: string;
  name: string;
  description: string;
  avgBalance: number;
  avgInterestRate: number;
  avgMinPayment: number;
  tips: string[];
  commonRates: string;
  seoTitle: string;
  seoDescription: string;
}

export const debtTypes: DebtType[] = [
  {
    slug: "credit-card-debt",
    name: "Credit Card Debt",
    description:
      "Credit card debt is one of the most expensive forms of consumer debt, with average interest rates of 20-25%. The minimum payment trap keeps millions of people in debt for decades. Using the avalanche method to target your highest-rate card first can save thousands in interest.",
    avgBalance: 6500,
    avgInterestRate: 22.8,
    avgMinPayment: 130,
    tips: [
      "Stop using the card while paying it off - switch to cash or debit",
      "Call your issuer and ask for a lower interest rate - it works more often than you think",
      "Consider a 0% balance transfer card if you have good credit",
      "Pay more than the minimum every month - even $50 extra makes a huge difference",
      "If you have multiple cards, use the avalanche method (highest rate first) to minimize interest",
    ],
    commonRates: "15-28% APR",
    seoTitle: "Credit Card Debt Payoff Calculator - How Fast Can You Be Debt Free?",
    seoDescription:
      "Free credit card debt payoff calculator. See how fast you can pay off your credit cards using avalanche or snowball method. Compare strategies and save thousands in interest.",
  },
  {
    slug: "student-loan-debt",
    name: "Student Loan Debt",
    description:
      "Student loan debt averages $37,000 per borrower in the US. Federal student loans typically have lower interest rates than private loans. Understanding your repayment options and making extra payments can save tens of thousands over the life of the loan.",
    avgBalance: 37000,
    avgInterestRate: 5.5,
    avgMinPayment: 400,
    tips: [
      "Check if you qualify for income-driven repayment (IDR) plans for federal loans",
      "Look into Public Service Loan Forgiveness (PSLF) if you work for government or nonprofits",
      "Refinancing private loans can lower your rate if your credit has improved",
      "Make biweekly payments instead of monthly - you will make 13 months of payments per year",
      "Target any extra payments to the highest-interest loan first",
    ],
    commonRates: "4-8% (federal), 3-15% (private)",
    seoTitle: "Student Loan Payoff Calculator - Plan Your Debt-Free Date",
    seoDescription:
      "Free student loan payoff calculator. Enter your loans, see your payoff timeline, and compare avalanche vs snowball strategies. Find out how extra payments accelerate your freedom.",
  },
  {
    slug: "car-loan",
    name: "Car Loan",
    description:
      "The average car loan in the US is around $23,000 with terms of 60-72 months. While car loan rates are lower than credit cards, the long terms mean you pay significant interest over the life of the loan. Paying extra each month can save you thousands.",
    avgBalance: 23000,
    avgInterestRate: 6.8,
    avgMinPayment: 450,
    tips: [
      "Round up your payment - if your minimum is $432, pay $500",
      "Make one extra payment per year to shave months off your loan",
      "Refinance if rates have dropped since you took the loan",
      "Avoid extending the loan term when refinancing - keep it shorter",
      "Consider whether paying off the car early makes sense vs investing the difference",
    ],
    commonRates: "4-10% APR",
    seoTitle: "Car Loan Payoff Calculator - Pay Off Your Auto Loan Faster",
    seoDescription:
      "Free car loan payoff calculator. See how extra payments can help you pay off your car loan faster and save on interest. Compare payoff strategies.",
  },
  {
    slug: "medical-debt",
    name: "Medical Debt",
    description:
      "Medical debt is the leading cause of bankruptcy in the US. Unlike other debts, medical bills are often negotiable. Many hospitals offer financial assistance programs, payment plans, and discounts for prompt payment. Always negotiate before setting up a payment plan.",
    avgBalance: 5000,
    avgInterestRate: 0,
    avgMinPayment: 200,
    tips: [
      "Always request an itemized bill and check for errors",
      "Ask about financial assistance programs - most hospitals have them",
      "Negotiate a lower amount - hospitals often accept 40-60% of the original bill",
      "Set up an interest-free payment plan directly with the provider",
      "Check if the debt is past the statute of limitations before paying old bills",
    ],
    commonRates: "0% (payment plans) to 10%+ (if sent to collections)",
    seoTitle: "Medical Debt Payoff Calculator - Plan Your Medical Bill Payments",
    seoDescription:
      "Free medical debt payoff calculator. Plan your medical bill payments, see your payoff timeline, and learn strategies to reduce and negotiate medical debt.",
  },
  {
    slug: "personal-loan",
    name: "Personal Loan",
    description:
      "Personal loans are unsecured loans used for debt consolidation, home improvements, or large purchases. Rates vary widely based on credit score. If you used a personal loan to consolidate credit card debt, focus on paying it off before taking on new debt.",
    avgBalance: 12000,
    avgInterestRate: 11.5,
    avgMinPayment: 250,
    tips: [
      "Never miss a payment - personal loans impact your credit score heavily",
      "If your credit score has improved, look into refinancing for a lower rate",
      "Make extra payments toward principal whenever possible",
      "Avoid taking out new debt while paying off a consolidation loan",
      "Set up autopay for a potential interest rate discount (many lenders offer 0.25% off)",
    ],
    commonRates: "6-36% APR",
    seoTitle: "Personal Loan Payoff Calculator - Accelerate Your Loan Payoff",
    seoDescription:
      "Free personal loan payoff calculator. See how extra payments reduce your payoff time and total interest. Compare avalanche and snowball payoff strategies.",
  },
  {
    slug: "mortgage",
    name: "Mortgage",
    description:
      "A mortgage is typically the largest debt most people carry. Even small extra payments can save tens of thousands in interest over a 30-year term. Making one extra payment per year on a 30-year mortgage can shave 4-5 years off your term.",
    avgBalance: 250000,
    avgInterestRate: 6.5,
    avgMinPayment: 1580,
    tips: [
      "Make biweekly payments to effectively make 13 monthly payments per year",
      "Even $100 extra per month can save years and tens of thousands in interest",
      "Consider refinancing if rates drop 1% or more below your current rate",
      "Do not extend your term when refinancing - keep the same payoff date or shorter",
      "Put any windfalls (tax refunds, bonuses) toward your mortgage principal",
    ],
    commonRates: "5.5-7.5% (2025-2026 rates)",
    seoTitle: "Mortgage Payoff Calculator - How Fast Can You Pay Off Your Home?",
    seoDescription:
      "Free mortgage payoff calculator. See how extra payments can help you pay off your mortgage years early and save tens of thousands in interest.",
  },
  {
    slug: "payday-loan",
    name: "Payday Loan",
    description:
      "Payday loans are the most expensive form of borrowing, with effective APRs of 300-500%. Getting out of the payday loan cycle should be your top financial priority. Consider alternatives like credit union loans, payment plans with creditors, or borrowing from family.",
    avgBalance: 500,
    avgInterestRate: 400,
    avgMinPayment: 575,
    tips: [
      "Break the cycle - borrow from literally any other source if possible",
      "Many states have payday loan assistance programs",
      "Credit unions offer payday alternative loans (PALs) at much lower rates",
      "Contact a nonprofit credit counselor for free help",
      "Some employers offer paycheck advances at no cost",
    ],
    commonRates: "300-500% effective APR",
    seoTitle: "Payday Loan Payoff Calculator - Escape the Payday Loan Trap",
    seoDescription:
      "Free payday loan payoff calculator. Plan your escape from payday loan debt. See alternatives and strategies to break the payday loan cycle.",
  },
  {
    slug: "buy-now-pay-later",
    name: "Buy Now Pay Later (BNPL)",
    description:
      "Buy Now Pay Later services like Afterpay, Klarna, and Affirm have exploded in popularity. While many offer 0% interest if paid on time, missed payments can trigger high fees and interest. The danger is accumulating multiple BNPL obligations that strain your budget.",
    avgBalance: 1500,
    avgInterestRate: 0,
    avgMinPayment: 125,
    tips: [
      "List all your BNPL obligations in one place - most people underestimate how many they have",
      "Stop taking on new BNPL purchases until existing ones are paid off",
      "Pay these off before they start charging interest or late fees",
      "Set calendar reminders for each payment due date",
      "Switch to saving up for purchases instead of using BNPL",
    ],
    commonRates: "0% (on-time) to 25-30% (late/deferred)",
    seoTitle: "BNPL Payoff Calculator - Pay Off Afterpay, Klarna and Affirm",
    seoDescription:
      "Free Buy Now Pay Later payoff calculator. Organize and plan payoff of your Afterpay, Klarna, and Affirm balances. Avoid late fees and interest charges.",
  },
];

export function getDebtTypeBySlug(slug: string): DebtType | undefined {
  return debtTypes.find((d) => d.slug === slug);
}
