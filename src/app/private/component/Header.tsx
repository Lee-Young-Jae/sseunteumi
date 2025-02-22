import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../../../../public/logo.jpeg";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const router = useRouter();

  return (
    <header className="h-[70px] bg-white shadow-sm flex items-center z-50 p-4">
      <button
        onClick={() => router.back()}
        className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-gray-50 active:bg-gray-100 transition-colors"
      >
        <IoChevronBack className="w-6 h-6 text-gray-700" />
      </button>

      <div className="flex items-center justify-center flex-1 mr-10">
        <Image src={logo} alt="로고" width={32} height={32} className="mr-2" />
        <h1 className="text-2xl font-semibold text-gray-700">{title}</h1>
      </div>
    </header>
  );
};

export default Header;
