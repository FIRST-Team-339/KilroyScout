import { useEffect, type Dispatch, type SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import Loading from "./loading";
import { toast } from "sonner";

type SavebarProps = {
  showing: boolean;
  setShowing: Dispatch<SetStateAction<boolean>>;
  resetCallback: () => void;
  saveCallback: () => void | Promise<void>;
}

export default function Savebar({ showing, setShowing, resetCallback, saveCallback }: SavebarProps) {
  const [saving, setSaving] = useState(false);

  const reset = () => {
    resetCallback();

    setShowing(false);
  }

  const save = async () => {
    setSaving(true);

    await saveCallback();

    setSaving(false);
    setShowing(false);
  }

  useEffect(() => {
    const down = (e: globalThis.KeyboardEvent): void => {
      if (
        showing && e.key === 's' &&
        (e.metaKey /* for Mac */ || /* for non-Mac */ e.ctrlKey)
      ) {
        e.preventDefault();

        void save();
      }
    }

    window.addEventListener('keydown', down)
    return () => {
      window.removeEventListener('keydown', down)
    }
  }, [])

  return (
    <div className={`fixed z-10 bottom-6 left-0 right-0 flex p-2 justify-center items-center transition ease-in-out duration-150 ${!showing ? "opacity-0 translate-y-1" : "opacity-100 -translate-y-1"}`}>
      <div className="bg-gray-100 dark:bg-gray-900 relative flex max-w-4xl rounded-md items-center justify-between p-2 shadow-md md:flex-grow font-medium">
        <span className="hidden md:block ml-2 text-gray-900 dark:text-gray-100">Careful — you have unsaved changes!</span>
        <div className="flex w-full justify-center md:w-auto">
          <Button variant="ghost" type="reset" className="hover:bg-transparent text-gray-900 dark:text-gray-100 hover:underline underline-offset-4" onClick={() => reset()}>
            Reset
          </Button>
          <Button variant="default" type="submit" className="text-gray-100 hover:text-gray-50" disabled={saving} onClick={() => save()}>
            {saving && <Loading className="h-5 w-5 mr-2 -ml-1" />}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}