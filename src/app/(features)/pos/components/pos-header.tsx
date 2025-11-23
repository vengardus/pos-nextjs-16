import { PosUser } from "./pos-header/pos-user";
import { PosCashRegister } from "./pos-header/pos-cash-register";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Clock from "@/components/common/time/clock";


export const PosHeader = () => {
  return (
    <div className="grid grid-cols-[40%_60%] md:grid-cols-[33%_34%_33%] md:justify-beetween w-full">
      <div className="flex gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="image-user" />
          <AvatarFallback>img-prof</AvatarFallback>
        </Avatar>
        <PosUser />
      </div>
      <div className="order-3 col-span-3 md:col-span-1 md:order-none flex md:justify-center md:items-center p-2 md:p-0">
        <PosCashRegister />
      </div>
      <div className="order-2 md:order-none flex flex-col items-center justify-center">
        <Clock />
      </div>
    </div>
  );
};
