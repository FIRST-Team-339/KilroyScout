"use client"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

type ComboboxProps = {
  placeholder: string;
  emptyResult: string;
  options: Array<{ label: string, value: string }>;
  defaultValue?: string;
  onChange: (newValue: string) => void;
}

export function Combobox({ placeholder, emptyResult, options, defaultValue, onChange}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-min justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : defaultValue && defaultValue !== "" ? defaultValue : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command className="w-full">
          <CommandInput placeholder={placeholder} />
          <CommandEmpty>{emptyResult}</CommandEmpty>
          <CommandList>
            {options.map((option) => (
              <CommandItem
              key={option.label}
              value={option.value}
              onSelect={(currentValue) => {
                setValue(currentValue === value ? "" : currentValue)
                setOpen(false);
                onChange(currentValue);
              }}
              className="m-2 p-2"
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  value === option.value ? "opacity-100" : "opacity-0"
                )}
              />
              {option.label}
            </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
