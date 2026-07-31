import AdminOrderCard from "@/components/Admin-Order-Card";

export default function AdminOrdersDashboard() {

    const categories = ["Pending", "Confirmed", "Preparing", "Shipped"];

    return (
        <div className="w-[90%] max-w-7xl mx-auto my-8 space-y-6">
        
            <div className="flex gap-5">
                <div className="bg-foreground text-white p-5 rounded-md pr-20 flex-1">
                    <h2>Pending Orders</h2>
                    <p className="text-5xl font-bold">12</p>
                </div>

                <div className="p-5 rounded-md pr-20 bg-white shadow-sm flex-1">
                    <h2>Confirmed Orders</h2>
                    <p className="text-5xl font-bold">103</p>
                </div>

                <div className="p-5 rounded-md pr-20 bg-white shadow-sm flex-1">
                    <h2>Preparing Orders</h2>
                    <p className="text-5xl font-bold">11</p>
                </div>

                <div className="p-5 rounded-md pr-20 bg-white shadow-sm flex-1">
                    <h2>Shipped Orders</h2>
                    <p className="text-5xl font-bold">11</p>
                </div>
            </div>

            <div className="flex gap-5">
                {categories.map((c) => (
                    <button key={c}>{c}</button>
                ))}
            </div>

            <div className="grid flex md:grid-cols-2">
                <AdminOrderCard/>
                <AdminOrderCard/>
            </div>

        </div>
    );
}