import Image from "next/image";
import { AppConstants } from '@/shared/constants/app.constants'

export const NavbarLogoApp = () => {
  return (
    <div className='flex items-center gap-2 pl-4'>
      <Image src="/favicon.png" alt="Logo" width={24} height={24} className="h-6 w-6" />
      <span className="font-semibold">{AppConstants.APP_NAME}</span>
    </div>
  )
}
