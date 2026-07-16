import { filterOptions } from "@/config";
import { Fragment, useState } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

function ProductFilter({ activeFilter, handleFilter }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden mb-3">
        <button
          className="w-full bg-primary text-primary-foreground py-2 px-3 rounded-md font-semibold"
          onClick={() => setOpen((s) => !s)}
          aria-expanded={open}
        >
          {open ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div
        className={`${open ? "block" : "hidden"} md:block bg-background rounded-lg shadow-sm`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-extrabold">Filters</h2>
        </div>
        <div className="p-4 space-y-4">
          {Object.keys(filterOptions).map((keyItem) => (
            <Fragment key={keyItem}>
              <div>
                <h3 className="text-base font-bold capitalize">{keyItem}</h3>
                <div className="grid gap-2 mt-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label
                      key={option.id}
                      className="flex font-medium items-center gap-2"
                    >
                      <Checkbox
                        checked={
                          activeFilter?.section === keyItem &&
                          activeFilter?.value === option.id
                        }
                        onCheckedChange={() => handleFilter(keyItem, option.id)}
                      />
                      {option.label}
                    </Label>
                  ))}
                </div>
              </div>
              <Separator />
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductFilter;
