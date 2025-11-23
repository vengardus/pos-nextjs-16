import { cn } from "@/utils/tailwind/cn"

interface TitleProps {
    label: string,
    className?: string
}
export const Title = ({label, className=""}:TitleProps) => {
    return (
        <h1 className={cn(`font-bold text-center`, className)}>{label}</h1>
    )
}
