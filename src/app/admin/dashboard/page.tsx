import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]


export default function AdminDashboard() {
    return(
        <div className="w-[65%] mx-auto mt-20 flex flex-col gap-20">

            <div className="flex gap-5">
                <div className="bg-foreground text-white p-5 rounded-md pr-20 flex-1">
                    <h2>Total Products</h2>
                    <p className="text-5xl font-bold">12</p>
                </div>

                <div className="p-5 rounded-md pr-20 bg-white shadow-sm flex-1">
                    <h2>Total Orders</h2>
                    <p className="text-5xl font-bold">103</p>
                </div>

                <div className="p-5 rounded-md pr-20 bg-white shadow-sm flex-1">
                    <h2>Total Sales</h2>
                    <p className="text-5xl font-bold">P203,013.00</p>
                </div>

                <div className="p-5 rounded-md pr-20 bg-white shadow-sm flex-1">
                    <h2>Total Customers</h2>
                    <p className="text-5xl font-bold">54</p>
                </div>
            </div>
            
            <div className="flex gap-10">
                <div className="bg-white p-5 rounded-md shadow-sm flex-1">
                    <h2 className="font-semibold mb-3">Pending Orders</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                </div>

                <div className="bg-white p-5 rounded-md shadow-sm flex-1">
                    <h2 className="font-semibold mb-3">Completed Orders</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium">{invoice.invoice}</TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                </div>
            </div>

            
        </div>
    );
}