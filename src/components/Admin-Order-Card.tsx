import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function AdminOrderCard() {
    return(
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Order No. 00001</CardTitle>
                <CardDescription>
                4 Products | Jul 31, 2026 10:00 PM
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <div className="flex gap-10">
                    <div className="text-gray-700/70 flex flex-col gap-1">
                        <p>Status:</p>
                        <p>Customer:</p>
                        <p>Total:</p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <p className="text-yellow-600">Pending </p>
                        <p>Charisse Jamien Alagbay</p>
                        <p className="font-semibold">P100,000.00</p>
                    </div>
                </div>
                <div>
                    <p className="font-semibold mb-2">Orders</p>
                    <div>
                        <h3 className="font-semibold">Expresso Machine</h3>
                        <p className="text-xs text-gray-700/70">Quantity: 1</p>
                    </div>
                </div>
            </CardContent>
            <CardFooter>
                <button className="bg-foreground text-white rounded-md py-2 px-5 cursor-pointer">View Order</button>
            </CardFooter>
        </Card>
    );
}