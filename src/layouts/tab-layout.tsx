import { Button, Card } from '@shadcn';
import { X } from 'lucide-react';
import { useRef } from 'react';
import Draggable from 'react-draggable';

interface Props {
  onClose: () => void;
  children: React.ReactNode;
  cancelDrag: string;
}

export const TabLayout: React.FC<Props> = ({
  onClose,
  children,
  cancelDrag
}) => {
  const dragRef = useRef(null);

  return (
    <Draggable nodeRef={dragRef} bounds="parent" cancel={cancelDrag}>
      <div ref={dragRef} className="absolute z-50 top-5 left-5">
        <Card className="cursor-move p-7 flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 w-5 h-5"
            onClick={onClose}>
            <X />
          </Button>

          {children}
        </Card>
      </div>
    </Draggable>
  );
};
