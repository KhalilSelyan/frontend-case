/* eslint-disable @next/next/no-img-element */
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type api as serverApi } from "@/trpc/server";
import { type inferAsyncReturnType } from "@trpc/server";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { type Character } from "rickmortyapi";
import { Skeleton } from "./ui/skeleton";
import { toast } from "./ui/use-toast";

type DropdownProps = {
  data: inferAsyncReturnType<typeof serverApi.ricknmorty.getCharacters.mutate>;
};

const Dropdown = ({ data }: DropdownProps) => {
  const [value, setValue] = useState<string[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get characters from server
  const [characters, setCharacters] = useState<Character[] | undefined>(
    data.results,
  );

  const { mutateAsync: getCharacters, isLoading } =
    api.ricknmorty.getCharacters.useMutation({
      onSuccess: (data) => {
        searchRef.current?.focus();
        setCharacters(data.results);
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: `${error.message}, please try again.`,
          variant: "destructive",
        });
      },
    });

  // Handler for search input change
  const handleSearchChange = (e: string) => {
    setSearchTerm(e);
  };

  // Debounced function for fetching characters
  const debouncedSearch = useCallback(
    debounce(async (searchValue: string) => {
      if (!searchValue.trim()) {
        return;
      } else {
        await getCharacters({ name: searchValue });
      }
    }, 1000), // delay in ms
    [],
  );

  // Effect to trigger the debounced search
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  // Memoized function for highlighted text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) {
      return <span>{text}</span>;
    }
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} className="font-extrabold">
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </span>
    );
  };

  return (
    <div>
      <Command className="w-96 max-w-96 gap-2">
        <CommandInput
          selectedItems={value}
          setSelectedItems={setValue}
          placeholder="Search For Character"
          value={searchTerm}
          onValueChange={handleSearchChange}
          ref={searchRef}
          className="overflow-x-auto"
        />
        <CommandList
          className={cn(
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md flex h-96 flex-col overflow-y-auto rounded-lg p-0",
          )}
        >
          {isLoading ? (
            <SkeletonDropdown />
          ) : (
            <div className="flex flex-col">
              <CommandEmpty>No Characters found.</CommandEmpty>
              <CommandGroup>
                {characters?.map((character) => (
                  <div key={character.id} className="flex flex-col">
                    <CommandItem
                      value={character.name}
                      onSelect={(currentValue) => {
                        if (value.includes(currentValue)) {
                          setValue((prevValue) =>
                            prevValue.filter((item) => item !== currentValue),
                          );
                        } else {
                          setValue((prevValue) => [...prevValue, currentValue]);
                        }
                      }}
                    >
                      <div className="flex flex-col gap-2 p-2">
                        <div className="flex gap-4">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Checkbox
                              checked={
                                value.includes(character.name.toLowerCase())
                                  ? true
                                  : false
                              }
                              onCheckedChange={(isChecked) => {
                                if (isChecked) {
                                  setValue((prevValue) => [
                                    ...prevValue,
                                    character.name.toLowerCase(),
                                  ]);
                                } else {
                                  setValue((prevValue) =>
                                    prevValue.filter(
                                      (item) =>
                                        item !== character.name.toLowerCase(),
                                    ),
                                  );
                                }
                              }}
                            />
                          </div>
                          <img
                            src={character.image}
                            alt={character.name}
                            className="aspect-square h-14 w-14 rounded-lg"
                          />
                          <div className="flex flex-col gap-2">
                            <Label className="font-light capitalize">
                              {highlightText(character.name, searchTerm)}
                            </Label>
                            <span className="text-sm text-gray-500">
                              {character.episode.length}{" "}
                              {character.episode.length > 1
                                ? "episodes"
                                : "episode"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                    <CommandSeparator />
                  </div>
                ))}
              </CommandGroup>
            </div>
          )}
        </CommandList>
      </Command>
    </div>
  );
};

export default Dropdown;

// Debounce function with TypeScript typing
const debounce = <F extends (...args: string[]) => unknown>(
  func: F,
  delay: number,
): ((...args: Parameters<F>) => void) => {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<F>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const SkeletonDropdown = () => {
  return (
    <div className="flex h-full flex-col gap-4 p-2">
      {Array<undefined>(4)
        .fill(undefined)
        .map((_, index) => (
          // use skeleton
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center justify-center gap-2">
              <Skeleton className="h-4 w-4 rounded-sm" />
            </div>
            <Skeleton className="aspect-square h-14 w-14 rounded-lg" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
    </div>
  );
};
