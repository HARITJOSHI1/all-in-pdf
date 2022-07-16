
export interface PO {
    value: "Credit or Debit card" | "PayPal";
    label: "Credit or Debit card" | "PayPal";
}

export const PAYMENT_OPTIONS: PO[] = [
    {value: "Credit or Debit card", label: "Credit or Debit card"},
    {value: "PayPal", label: "PayPal"}
];
