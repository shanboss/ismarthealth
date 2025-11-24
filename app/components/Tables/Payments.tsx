type PaymentRow = {
  receipt: string;
  registrationFee: number;
  consultationFee: number;
  medicineFee: number;
  investigationCharges: number;
  nursing: number;
  total: number;
  modeOfPayment: string;
  date: string;
};

export default function Payments() {
  const payments: PaymentRow[] = [
    {
      receipt: "20190708031",
      registrationFee: 100,
      consultationFee: 200,
      medicineFee: 0,
      investigationCharges: 0,
      nursing: 0,
      total: 300,
      modeOfPayment: "cash",
      date: "31-10-2025",
    },
    {
      receipt: "20190708028",
      registrationFee: 200,
      consultationFee: 0,
      medicineFee: 0,
      investigationCharges: 0,
      nursing: 0,
      total: 200,
      modeOfPayment: "cash",
      date: "05-07-2023",
    },
    {
      receipt: "20190708026",
      registrationFee: 125,
      consultationFee: 100,
      medicineFee: 40,
      investigationCharges: 0,
      nursing: 0,
      total: 265,
      modeOfPayment: "cash",
      date: "08-05-2023",
    },
    {
      receipt: "20190708022",
      registrationFee: 200,
      consultationFee: 0,
      medicineFee: 0,
      investigationCharges: 0,
      nursing: 0,
      total: 200,
      modeOfPayment: "cash",
      date: "22-10-2021",
    },
    {
      receipt: "20190708019",
      registrationFee: 200,
      consultationFee: 0,
      medicineFee: 0,
      investigationCharges: 0,
      nursing: 0,
      total: 200,
      modeOfPayment: "cash",
      date: "11-09-2020",
    },
    {
      receipt: "20190708012",
      registrationFee: 200,
      consultationFee: 100,
      medicineFee: 500,
      investigationCharges: 50,
      nursing: 80,
      total: 930,
      modeOfPayment: "cash",
      date: "26-12-2019",
    },
  ];

  return (
    <div className="space-y-4 max-w-full">
      <h1 className="text-2xl font-semibold tracking-tight">Payment</h1>

      <div className="overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="min-w-max divide-y divide-foreground/10">
            <thead className="bg-background">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Sl. No
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Receipt #
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Registration Fee
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Consultation Fee
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Medicine Fee
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Investigation Charges
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Nursing
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Total
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Mode of Payment
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground/70">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10">
              {payments.map((p, idx) => (
                <tr key={p.receipt} className="">
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80">
                    {idx + 1}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground">
                    {p.receipt}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground/80">
                    {p.registrationFee}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground/80">
                    {p.consultationFee}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground/80">
                    {p.medicineFee}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground/80">
                    {p.investigationCharges}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground/80">
                    {p.nursing}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground">
                    {p.total}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80">
                    {p.modeOfPayment}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80">
                    {p.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
