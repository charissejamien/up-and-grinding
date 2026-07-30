import Image from "next/image";
import ProductCard from "@/components/Product-Card";

export default function Home() {
  return (
    <div>
      <div className="relative w-full min-h-[700px] flex py-20 px-6 text-white overflow-hidden">
        
        <Image 
          src="/promotional-bg.png" 
          alt="Promotional background" 
          fill 
          priority
          className="object-cover object-center -z-10"
        />

        <div className="absolute inset-0 bg-black/70 -z-10" />

        <div className="pl-20">
          <h3 className="text-6xl font-semibold">THE MORNING RITUAL, REFINED.</h3>
          <p className="text-2xl mt-2">Up Eearly. Brewed Bold.</p>
          <p className="text-lg mt-2 text-white/70 tracking-wide w-200">
            From precision hand grinders to rare single-origin beans, we supply
            the fuel for big ideas and early mornings.
          </p>

          <button>Start Grinding</button>
          <button>Find Your Roast</button>
        </div>

      </div>

      <div className="w-[80%] lg:w-[60%] mx-auto mt-20">
        <h2 className="text-xl text-text-gray font-semibold">Product Categories</h2>
        <p className="text-gray-500 text-sm">Select your path to the perfect brew.</p>
        <div className="flex gap-5 mt-5">
          <div className="bg-foreground text-white/90 p-10 pt-60 rounded-xl flex-1 shadow-lg">
            <h3 className="text-xl font-semibold">Grinders & Gear</h3>
            <p className="text-white/70 w-70">Manual grinders, kettles, and precision scales.</p>
            <button className="bg-white text-foreground text-sm font-medium py-1 px-2 rounded-sm mt-3">Browse Products</button>
          </div>
          <div className="bg-foreground text-white/90 p-10 pt-60 rounded-xl flex-1 shadow-lg">
            <h3 className="text-xl font-semibold">Artisanal Coffee Beans</h3>
            <p className="text-white/70 w-80">Single-origin beans sourced and freshly roasted to order.</p>
            <button className="bg-white text-foreground text-sm font-medium py-1 px-2 rounded-sm mt-3">Browse Products</button>
          </div>
        </div>
      </div>

      <div className="w-[80%] lg:w-[60%] mx-auto mt-20">
        <h2 className="text-xl font-semibold">Featured Products</h2>
        <p className="text-gray-500 text-sm">Handpicked favorites for the modern barista.</p>
        <div className="mt-5 flex justify-between">
          <ProductCard/>
          <ProductCard/>
          <ProductCard/>
        </div>
      </div>

    </div>
  );
}
