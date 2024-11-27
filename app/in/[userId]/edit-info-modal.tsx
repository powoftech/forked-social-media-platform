"use client";
import { DatetimePicker } from "@/app/feed/components/date-time-picker-custom";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { user } from "@prisma/client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsFillPatchMinusFill } from "react-icons/bs";
import { toast } from "sonner";
interface EditInfoModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  user: user;
  isNestedOpen?: boolean;
  setUser: (value: user) => void;
}

const EditInfoModal = ({ open, setOpen, user }: EditInfoModalProps) => {
  const [currenUser, setCurrentUser] = useState<user | null>(user);
  const [data, setData] = useState({
    phoneNumber: currenUser?.phone_number ? currenUser?.phone_number : "",
    address: currenUser?.address ? currenUser?.address : "",
    birthDate: currenUser?.birth_date ? currenUser?.birth_date : "",
  });
  const [date, setDate] = useState<Date>(
    currenUser?.birth_date ? new Date(currenUser.birth_date) : new Date()
  );
  const [origin, setOrigin] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    const phoneNumber = data.phoneNumber.toString();
    if (phoneNumber === "") return;
    // Check if the phone number contains only digits and has exactly 10 digits
    if (!/^[0-9]+$/.test(phoneNumber)) {
      setError("Phone number does not contain any characters");
    } else if (phoneNumber.length > 10) {
      setError("Invalid phone number");
    } else {
      setError(""); // Clear error if valid
    }
  }, [data.phoneNumber]);

  useEffect(() => {
    setData((prev) => ({ ...prev!, birthDate: date || "" }));
  }, [date]);

  const onClose = () => {
    setOpen(false);
    setData({
      phoneNumber: currenUser?.phone_number ? currenUser?.phone_number : "",
      address: currenUser?.address ? currenUser?.address : "",
      birthDate: currenUser?.birth_date ? currenUser?.birth_date : "",
    });
    setError("");
  };

  const onSave = async () => {
    try {
      setIsLoading(true);
      console.log(data);
      const response = await axios.put(`/api/in?action=edit-info`, data);
      if (response.status === 200) {
        const { updatedUser } = response.data;
        setCurrentUser(updatedUser);
        setIsLoading(false);
        setOpen(false);
      } else {
        setIsLoading(false);
        toast.error(response.data.error);
      }
    } catch {
      setIsLoading(false);
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-xl overflow-hidden bg-gray-50 p-0">
          <div className="rounded-lg border bg-white">
            <DialogHeader className="p-6">
              <DialogTitle className="text-xl font-medium">
                Edit contact info
              </DialogTitle>
            </DialogHeader>
            <Separator className="p-0" />
            <div className="w-full space-y-8 p-6">
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">Profile URL</p>
                <p className="w-fit rounded-md bg-slate-100 p-3 text-sm text-black">
                  {origin}/in/{currenUser?.id}
                </p>
              </div>
              <div className="flex flex-col space-y-2 text-gray-500">
                <p className="text-sm text-gray-600">Email</p>
                <p className="w-fit rounded-md bg-slate-100 p-3 text-sm text-black">
                  {currenUser?.email}
                </p>
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-600">Phone number</p>
                <input
                  type="text"
                  value={data.phoneNumber ?? ""}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev!,
                      phoneNumber: e.target.value,
                    }))
                  }
                  className={`w-full rounded-sm px-2 py-[6px] text-sm outline outline-1 hover:outline-2 focus:outline-2 ${error ? "border-red-500" : ""}`}
                />
                {error && (
                  <span className="flex items-center text-xs font-semibold text-red-500">
                    <BsFillPatchMinusFill className="mr-1 size-4" />
                    {error}
                  </span>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Address</p>
                <textarea
                  value={data.address ?? ""}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev!,
                      address: e.target.value,
                    }))
                  }
                  className="w-full rounded-sm px-2 py-[6px] text-sm outline outline-1 hover:outline-2 focus:outline-2"
                />
              </div>
              <div className="flex flex-col space-y-2">
                <p className="text-sm">Birthday</p>
                <DatetimePicker
                  value={date ? date : undefined}
                  onChange={(nextDate) => setDate(nextDate || new Date())}
                  format={[["months", "days", "years"]]}
                />
              </div>

              <Separator />
              <div className="w-full text-end">
                <Button
                  disabled={isLoading || !!error}
                  className="mb-6 mr-6 mt-5 rounded-full px-6 py-2"
                  onClick={onSave}
                >
                  {isLoading ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditInfoModal;