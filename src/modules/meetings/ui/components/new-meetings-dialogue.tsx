import { Dispatch } from "react";
import { MeetingsGetOne } from "../../types";
import { ResponsiveDialogue } from "@/components/responsive-dialogue";
import { Button } from "@/components/ui/button";
import { MeetingsForm } from "./meetings-form";

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
        <MeetingsForm
          isInstant={isInstant}
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
        />
      </ResponsiveDialogue>
    </>
  );
};
