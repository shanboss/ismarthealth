export type Row = {
  ss_id: number;
  referralId: string;
  name: string;
  age: string;
  mobile: string;
  email: string;
  referdate: Date;
  totalAmount: number | null;
  status: number;
};

export type DisplayRow = {
  ss_id: number;
  referralId: string;
  name: string;
  age: string;
  mobile: string;
  email: string;
  referredDate: string;
};