import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarProfileProps {
  image: string;
  isMenuProfileOpen: boolean;
  setIsMenuProfileOpen: (value: boolean) => void;
}
export const NavbarProfile = ({
  image,
  isMenuProfileOpen,
  setIsMenuProfileOpen,
}: NavbarProfileProps) => {
  return (
    <Avatar onClick={() => setIsMenuProfileOpen(!isMenuProfileOpen)}>
      <AvatarImage src={image} alt="image" />
      <AvatarFallback>img-prof</AvatarFallback>
    </Avatar>
  );
};
