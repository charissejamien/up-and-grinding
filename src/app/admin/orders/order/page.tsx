import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function OrderDetailsPage() {
    return(
        <div className="mt-20 w-[90%] lg:w-[60%] mx-auto">
            <h2 className="text-lg font-medium">Order ID: 00001</h2>
            <p className="text-sm text-gray-700/70">Jul 30, 2026 at 10:10 am</p>
            <p>Pending</p>
            <div className="mt-10 flex gap-10 w-full">
                <div className="flex-1 flex flex-col gap-5">
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Order Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-700/80 flex flex-col gap-5">
                            <div className="flex gap-3">
                                <div className="p-7 rounded-sm bg-foreground">
                                </div>
                                <div>
                                    <p className="text-sm">Machines</p>
                                    <h3 className="text-lg font-semibold text-foreground">Expresso Machine</h3>
                                    <p className="text-xs">1 Quantity</p>
                                </div>
                                
                            </div>

                            <div className="flex gap-3">
                                <div className="p-7 rounded-sm bg-foreground">
                                </div>
                                <div>
                                    <p className="text-sm">Machines</p>
                                    <h3 className="text-lg font-semibold text-foreground">Expresso Machine</h3>
                                    <p className="text-xs">1 Quantity</p>
                                </div>
                                
                            </div>
                        </CardContent>
                    </Card>


                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-700/80 flex flex-col gap-5">
                            <div className="flex justify-between pr-20 pb-5 border-b-1 border-foreground/30">
                                <div className="flex flex-col gap-1">
                                    <p>Subtotal</p>
                                    <p>Discount</p>
                                    <p>Shipping</p>
                                    <p className="font-semibold text-foreground mt-1">Total</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p>P1000.00</p>
                                    <p>-P0.00</p>
                                    <p>P0.00</p>
                                    <p className="font-semibold text-foreground mt-1">P1000.00</p>
                                </div>
                            </div>
                            <div className="flex justify-between pr-20">
                                <p>Payment Method</p>
                                <p>MasterCard</p>
                            </div>
                            
                        </CardContent>
                    </Card>
                </div>

                <div className="flex flex-col gap-5 flex-1">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-700/80">
                            <p>Customer Notes</p>
                        </CardContent>
                    </Card>

                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Customer Information</CardTitle>
                        </CardHeader>
                        <CardContent className="text-gray-700/80">
                            <p>Charisse Jamien Alagbay</p>
                            <p>Compostela, Cebu, Philippines 6003</p>
                            <p>jamiencharisse@gmail.com</p>
                            <p>0960-822-6296</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <button className="bg-foreground py-2 px-5 text-white rounded-md">Confirm Order</button>
            
        </div>
    );
}