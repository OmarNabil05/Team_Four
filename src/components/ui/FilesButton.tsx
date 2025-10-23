import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FileButton {
  label: string;
  path: string;
}

interface FilesButtonsGroupProps {
  buttons: FileButton[];
}

export default function FilesButtonsGroup({ buttons }: FilesButtonsGroupProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 w-full max-w-md mx-auto">
      {buttons.map((btn) => (
        <Button key={btn.path} onClick={() => navigate(btn.path) } variant='outline' >
          {btn.label}
        </Button>
      ))}
    </div>
  );
}
