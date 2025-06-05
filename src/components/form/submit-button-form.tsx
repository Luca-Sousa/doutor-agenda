import Image from "next/image";

import { Button } from "../ui/button";

interface SubmitButtonFormProps {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

const SubmitButtonForm = ({
  isLoading,
  className,
  children,
}: SubmitButtonFormProps) => {
  return (
    <Button
      type="submit"
      className={className ?? "w-full cursor-pointer"}
      disabled={isLoading}
    >
      {isLoading ? (
        <Image
          src="/assets/icons/loader.svg"
          alt="loader"
          width={24}
          height={24}
          className="animate-spin"
        />
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButtonForm;
