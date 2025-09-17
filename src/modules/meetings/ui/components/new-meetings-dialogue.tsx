import { Dispatch } from "react";
import { MeetingsGetOne } from "../../types";
import { ResponsiveDialogue } from "@/components/responsive-dialogue";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  isEdit: boolean;
  initialMeeting?: MeetingsGetOne;
  onOpenChange: Dispatch<React.SetStateAction<boolean>>;
  isInstant: boolean;
}

export const NewMeetingsDialogue = ({
  open,
  isEdit,
  onOpenChange,
  initialMeeting,
  isInstant,
}: Props) => {
  return (
    <>
      <ResponsiveDialogue
        open={open}
        onOpenChange={onOpenChange}
        title={isEdit ? "Edit Meeting" : "Create Meeting"}
        description={isEdit ? "Edit your Meeting " : "Create a Meeting"}
      >
        <Button></Button>
      </ResponsiveDialogue>
    </>
  );
};
