import Insights from "./Insights";
import Payments from "../Tables/Payments";
import {
  BellIcon,
  PlusCircleIcon,
  UserGroupIcon,
  Bars3BottomLeftIcon,
  MagnifyingGlassIcon,
  BoltIcon,
  CreditCardIcon,
  BanknotesIcon,
  ExclamationTriangleIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-semibold tracking-tight">Dashboard</h1>
      <Insights weekly={1} monthly={0} yearly={1} totalPatients={272} />
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Payments />
        </div>
        <div>
          <RightSummary />
        </div>
      </div>
    </div>
  );
}

function RightSummary() {
  const charges = [
    { label: "Registration Charges", amount: 2735, icon: PlusCircleIcon },
    { label: "Consultation Charges", amount: 1480, icon: UserGroupIcon },
    { label: "Medicine Charges", amount: 2980, icon: Bars3BottomLeftIcon },
    { label: "Investigation Charges", amount: 186, icon: MagnifyingGlassIcon },
    { label: "Nursing Charges", amount: 142, icon: BoltIcon },
  ];

  const methods = [
    { label: "Card", count: 1, amount: 720, icon: CreditCardIcon },
    { label: "Cash", count: 13, amount: 6803, icon: BanknotesIcon },
    { label: "Paytm", count: 0, amount: 0, icon: ExclamationTriangleIcon },
    { label: "Others", count: 0, amount: 0, icon: EllipsisHorizontalIcon },
  ];

  const currency = (n: number) => `${n}₹`;
  const totalReceived = methods.reduce((s, m) => s + m.amount, 0);

  return (
    <div className="rounded-lg border border-foreground/10 bg-background shadow-sm">
      <div className="flex items-center gap-2 border-b border-foreground/10 px-4 py-3 text-sm font-semibold">
        <BellIcon className="h-4 w-4 text-foreground/60" />
        Payment Details
      </div>
      <ul className="divide-y divide-foreground/10">
        {charges.map((c, idx) => (
          <li
            key={c.label}
            className={`flex items-center justify-between px-4 py-3 ${
              idx === 1 ? "bg-background" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <c.icon className="h-5 w-5 text-foreground/60" />
              <span className="text-sm text-foreground">{c.label}</span>
            </div>
            <div className="text-sm font-medium text-foreground">
              {currency(c.amount)}
            </div>
          </li>
        ))}
        {methods.map((m) => (
          <li
            key={m.label}
            className="flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <m.icon className="h-5 w-5 text-foreground/60" />
              <span className="text-sm text-foreground">{m.label}</span>
            </div>
            <div className="text-sm text-foreground/70">
              <span className="italic">{m.count}</span>
              <span className="ml-1">({currency(m.amount)})</span>
            </div>
          </li>
        ))}
        <li className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <BanknotesIcon className="h-5 w-5 text-foreground/60" />
            <span className="text-sm font-medium text-foreground">
              Total Payment Received
            </span>
          </div>
          <div className="text-sm font-semibold text-foreground">
            {currency(totalReceived)}
          </div>
        </li>
      </ul>
    </div>
  );
}
